import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Canvas from '../Canvas';
import CensorshipOptionsDialog from "./CensorshipOptionsDialog.js";
import LinearProgress from '@material-ui/core/LinearProgress';
import CensorshipForm from './CensorshipForm.js';
// Censorship Options Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// Form Components 
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// checkbox
import Checkbox from '@material-ui/core/Checkbox';
// switch 
import Switch from '@material-ui/core/Switch';
import { convertMask2dToImage, resizeImage } from '../utils/utils';

const axios = require('axios');

const CENSOR_URL = 'http://18.144.37.100:8000/Censor?options=[pixel_sort]';

const useStyles = makeStyles((theme) => ({
  pagination: {
    color: 'white',
    // position: 'absolute',
    bottom: '35px',
    marginTop: 25,
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  censorButton: {
    width: "155px",
    fontWeight: "bold",
    color: "#181818",
    backgroundColor: "#f18282",
    '&:hover': {
      color: "#181818",
      backgroundColor: '#FAD0D0'
    },
    marginRight: 10,
  },
  downloadButton: {
    width: "155px",
    fontWeight: "bold",
    color: "#181818",
    backgroundColor: "#dbdbdb"
  },
  reloadButton: {
    width: "155px",
    fontWeight: "bold",
    color: "#181818",
    backgroundColor: "#dbdbdb",
    marginRight: "10px"
  },
  toolbarButton: {
    width: "155px",
    fontWeight: "bold",
    color: "#181818",
    backgroundColor: "#eceff1",
  },
  formControl: {
    margin: theme.spacing(3),
  },
  formComponents: {
    display: 'flex',
  }

}));

function CanvasPagination({ images, imageMasks, resizedImages }) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [coordsPass, setCoordsPass] = useState([]);
  const [isCensored, setIsCensored] = useState(false);
  const [isCensoring, setIsCensoring] = useState(false);
  const [censoredImages, setCensoredImages] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [checkBoxState, setCheckboxState] = React.useState({
    pixel_sort: false,
    simple_blurring: false,
    pixelization: false,
    black_bar: false,
    fill_in: false,
  });

  const { pixel_sort, simple_blurring, pixelization, black_bar, fill_in } = checkBoxState;

  const handleCheckboxChange = (event) => {
    setCheckboxState({ ...checkBoxState, [event.target.name]: event.target.checked });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const handlePagination = (event, value) => {
    setPage(value);
  };

  const handleCoordsChange = (coords) => {
    let newCoords = coordsPass;
    newCoords[page - 1] = coords;
    setCoordsPass(newCoords);
  }

  const censorImages = async () => {
    coordsPass.forEach(async (coords, i) => {
      if (i == 0) setIsCensoring(true);

      let maskedImage = await convertMask2dToImage(coords);
      let res = await getCensoredImageAsync(maskedImage, i);

      let temp = censoredImages;
      temp.push(res);
      setCensoredImages(temp);

      if (i == coordsPass.length - 1) {
        setIsCensored(true);
        setIsCensoring(false);
      }
    });
  }

  async function getCensoredImageAsync(maskedImage, currentPage) {
    let response;
    let resizedImage = resizedImages[currentPage];
    // call api and retreive censored image
    let form = new FormData();
    form.append('image', resizedImage, resizedImage.fileName);
    form.append('mask', maskedImage, maskedImage.fileName);
    // api response returns the image encoded in base64
    try {
      response = axios({
        method: 'post',
        url: CENSOR_URL,
        data: form,
        headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}`, },
      }).then(response => {
        return 'data:image/jpeg;base64,' + response.data.ImageBytes;
      });
    } catch (err) {
      console.log('error detected');
    }
    response = await Promise.resolve(response);
    let image = new Image();
    image.src = response;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
        reject('image not censored');
      }
    })
  }

  const download = () => {
    setIsCensored(false); // temp
  }

  const reload = () => {
    history.go(0);
  }

  useEffect(() => {
    setCoordsPass(imageMasks);
  }, [imageMasks]);

  useEffect(() => {
    console.log(resizedImages);
  }, [resizedImages]);

  if (isCensoring) {
    return (
      <Container className={classes.root}>
        <LinearProgress />
      </Container>
    );
  } else {
    return (
      <Container>
        {/* Toolbar Components */}
        {isCensored
          ? <Grid container>
            <Grid item xs={6}>
              <Button size='small' className={classes.reloadButton} onClick={reload}>
                New Image
                </Button>
              <Button size='small' className={classes.downloadButton} onClick={download}>
                Download
                </Button>
            </Grid>
            {/* Canvas Component */}
            <Canvas
              image={censoredImages[page - 1]}
              coordsPass={coordsPass[page - 1]}
              setCoordsPass={handleCoordsChange}
            />
          </Grid>
          : <Grid container>
            <Grid item xs={6}>
              <Button size='small' className={classes.censorButton} onClick={censorImages}>
                Censor
                </Button>
              <Button size='small' className={classes.toolbarButton} onClick={handleOpenDialog}>
                Select Options
                </Button>
              {/* Censor Options Dialog */}
              <Dialog fullScreen={fullScreen} open={openDialog} onClose={handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogContent>
                  {/* <CensorshipForm options={censoringAlgorithms} handleOptionsChange={handleCensoringAlgorithmsChange}/> */}
                  <div className={classes.formComponents}>
                    {/* Checkbox Components */}
                    <FormControl component="fieldset" className={classes.formControl}>
                      <FormLabel component="legend">Select Censoring Algorithm(s)</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={pixel_sort} onChange={handleCheckboxChange} name="pixel_sort" />}
                          label="Pixel Sorting"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={simple_blurring} onChange={handleCheckboxChange} name="simple_blurring" />}
                          label="Simple Blurring"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={pixelization} onChange={handleCheckboxChange} name="pixelization" />}
                          label="Pixelization"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={black_bar} onChange={handleCheckboxChange} name="black_bar" />}
                          label="Black Bar Censoring"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={fill_in} onChange={handleCheckboxChange} name="fill_in" />}
                          label="Fill In Censoring"
                        />
                      </FormGroup>
                    </FormControl>
                    {/* Switch Component */}
                    {/* <FormControl component='fieldset' className={classes.formControl}>
                      <FormLabel component="legend">Enable Metadata Scrubbing</FormLabel>
                          <Switch
                              checked={enableMeta}
                              onChange={handleMetaChange}
                              name="enableMeta"
                              inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                    </FormControl> */}
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleCloseDialog} color="primary">
                    Close
                    </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            {/* Canvas Component */}
            <Canvas
              image={[images[page - 1]]}
              coordsPass={coordsPass[page - 1]}
              setCoordsPass={handleCoordsChange}
            />
          </Grid>
        }
        {/* Pagination Component */}
        <Grid container justify="center">
          {images.length > 1
            ?
            <Pagination
              size="small"
              className={classes.pagination}
              count={images.length}
              variant="outlined"
              page={page}
              onChange={handlePagination}
            />
            : null
          }
        </Grid>
      </Container>
    );
  }
}

export default CanvasPagination;