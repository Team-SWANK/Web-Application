import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Canvas from '../Canvas';
import CensorshipOptionsDialog from "./CensorshipOptionsDialog.js";

const useStyles = makeStyles((theme) => ({
  pagination: {
    color: 'white',
    position: 'absolute',
    bottom: '35px'
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
    }
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
  }
}));

function CanvasPagination({ images, imageMasks }) {
  const classes = useStyles();
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [coordsPass, setCoordsPass] = useState([]);
  const [isCensored, setIsCensored] = useState(false);

  const handlePagination = (event, value) => { 
    setPage(value);
  };

  const handleCoordsChange = (coords) => {
    let newCoords = coordsPass;
    newCoords[page - 1] = coords;
    setCoordsPass(newCoords); 
  }

  const censorImages = async () => {
    setIsCensored(true); // temp
  }

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
  

  useEffect(() => { 
    // console.log('image masks: ' + imageMasks);
    setCoordsPass(imageMasks);
  }, [imageMasks]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={2}>
          <CensorshipOptionsDialog />
        </Grid>
        {isCensored
          ? <Grid item xs={6}>
            <Button size='small' className={classes.reloadButton} onClick={reload}>
              New Image
              </Button>
            <Button size='small' className={classes.downloadButton} onClick={download}>
              Download
              </Button>
          </Grid>
          : <Grid item xs={6}>
            <Button size='small' className={classes.censorButton} onClick={censorImages}>
              Censor
              </Button>
          </Grid>
        }
      </Grid>
      <Canvas
        image={[images[page - 1]]}
        coordsPass={coordsPass[page - 1]}
        setCoordsPass={handleCoordsChange}
      />
      <Grid container justify="center">
        {images.length > 1
          ? <Pagination
            size="small"
            className={classes.pagination}
            count={images.length}
            variant="outlined"
            page={page}
            onChange={handlePagination}
          /> : null
        }
      </Grid>
    </Container>
  );
}

export default CanvasPagination;