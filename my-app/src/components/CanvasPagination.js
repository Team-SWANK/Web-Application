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
import {  getMetadataTags } from '../utils/utils';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { convertMask2dToImage } from '../utils/utils';
const axios = require('axios');

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
  const theme  = useTheme(); 
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [coordsPass, setCoordsPass] = useState([]);
  const [isCensored, setIsCensored] = useState(false);
  const [isCensoring, setIsCensoring] = useState(false);
  const [censoredImage, setCensoredImage] = useState(new Image());

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); 

  // this holds all metadata tags for all images
  const [allMeta, setAllMeta] = useState([]);
  // this holds the censorship options in an array
  const [censorOptions, setCensOptions] = useState([]);

  let url = 'http://18.144.37.100:8000/Censor?options=[pixel_sort]'; 
  
  const handlePagination = (event, value) => { 
    setPage(value);
  };

  const handleCoordsChange = (coords) => {
    let newCoords = coordsPass;
    newCoords[page - 1] = coords;
    setCoordsPass(newCoords); 
  }

  const censorImages = async () => {
    let currentPage = page - 1;  
    // let values = Object.values(checkBoxState);  
    // if(!values.includes(true)) {
    //   alert('No censoring algorithm were chosen');  
    // }
    //  else {
      setIsCensoring(true); 
      let imageMask2dArray = coordsPass[currentPage]; 
      let maskedImage = await convertMask2dToImage(imageMask2dArray, currentPage);
      console.log(maskedImage); 
      setCensoredImage(await getCensoredImageAsync(maskedImage, currentPage)); 
      setIsCensored(true); 
      setIsCensoring(false); 
    // }
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
        url: url,
        data: form, 
        headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}`, },
      }).then(response => {
        console.log('data:image/jpeg;base64,' + response.data.ImageBytes);
        return 'data:image/jpeg;base64,' + response.data.ImageBytes;
      });
    } catch(err) {
      console.log('error detected'); 
    }
    response = await Promise.resolve(response);
    // console.log(response);  
    let image = new Image();
    image.src = response;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        console.log(image);
        resolve(image); 
        reject('image not censored'); 
      } 
    })
  }

  useEffect(() => {    
    setCoordsPass(imageMasks); 
  }, [imageMasks]);

  useEffect(() => {
    console.log(resizedImages); 
  }, [resizedImages]);

  const download = () => {
    setIsCensored(false); // temp
  }

  const reload = () => {
    history.go(0);
  }

  useEffect(async () => { 
    // /** Retrieve the dimensions for each image */
    // let dimensions = [];
    // images.forEach((image) => {
    //   dimensions.push(getDimensions(image));
    // });
    // dimensions = await Promise.all(dimensions);
    
    // /** Populate coordsPass with 2D array pixel mappings for each image */
    // dimensions.forEach((dimension) => {
    //   let initCoordsPass = Array.from({ length: dimension[0] }, () =>
    //     Array.from({ length: dimension[1] }, () => false)
    //   );
    //   let newCoordsPass = coordsPass;
    //   newCoordsPass.push(initCoordsPass);
    //   setCoordsPass(newCoordsPass);
    // });
  }, [images]);
  

  // sets up censorship options with defaults for each image
  useEffect(async () => {
    /**Populate allMeta with allTag dictionary for each image */
    let exifs = [];
    let defaultOptions = 
      {
        'pixelization': false,
        'gaussian': true,
        'pixel_sort': true,
        'fill_in': false,
        'black_bar': false,
        'metaDataTags': []
      };
    let defaultMetadataSubstrings = ["make", "model", "gps", "maker", "note", "location", "name",
    "date", "datetime", "description", "software", "device",
    "longitude", "latitude", "altitude"];
    let censOptCopy = [...censorOptions];
    images.forEach((image, index) => {
      exifs.push(getMetadataTags(image));

      /**Populate censorOptions state variable with default options for each image*/
      if (index < censOptCopy.length) {
        censOptCopy[index] = defaultOptions;
      } else {
        censOptCopy.push(defaultOptions);
      }
    });
    exifs = await Promise.all(exifs);
    setAllMeta(exifs);
    exifs.forEach((exif, index) => {
      for(const [key, value] of Object.entries(exif)) {
        if (new RegExp(defaultMetadataSubstrings.join("|")).test(key.toLowerCase())) {
          // At least one match
          if (censOptCopy[index]['metaDataTags'].indexOf(key) < 0) {
            censOptCopy[index]['metaDataTags'].push(key);
          }
        }
      }
    });
    setCensOptions(censOptCopy);
    //unfinished
  }, [images]);


  if(isCensoring) {
    return(
      <Container className={classes.root}>
        <LinearProgress />
      </Container>
    );
  } else {
    return (
      <Container>
        {/* Toolbar Components */}
        <Grid container>
        {isCensored
          ? 
              <Grid item xs={6}>
                <Button size='small' className={classes.reloadButton} onClick={reload}>
                  New Image
                </Button>
                <Button size='small' className={classes.downloadButton} onClick={download}>
                  Download
                </Button>
              </Grid>
              : <Grid item xs={6}>
                  <CensorshipOptionsDialog 
                    censorOptions={censorOptions} 
                    setCensorOpt={setCensOptions}
                    pagenum={page} 
                    metadata={allMeta} 
                    setPage={handlePagination}
                  />
                  <Button size='small' className={classes.censorButton} onClick={censorImages}>
                    Censor
                  </Button>
              </Grid>
          }
              {/* Canvas Component */}
              <Canvas
                image={[images[page - 1]]}
                coordsPass={coordsPass[page - 1]}
                setCoordsPass={handleCoordsChange}
              />
          </Grid>
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