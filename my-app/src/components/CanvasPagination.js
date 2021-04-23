import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Canvas from '../Canvas';
import CensorshipOptionsDialog from "./CensorshipOptionsDialog.js";
import { getDimensions } from '../utils/utils'; 
import LinearProgress from '@material-ui/core/LinearProgress';
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
  }
}));

function CanvasPagination({ images, imageMasks }) {
  const classes = useStyles();
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [coordsPass, setCoordsPass] = useState([]);
  const [isCensored, setIsCensored] = useState(false);
  const [isCensoring, setIsCensoring] = useState(false); 

  const [censoringAlgorithms, setCensoringAlgorithms] = useState([
    { name: 'pixel_sort', isSelected: false, label: 'Pixel Sort', id: 1 }, 
    { name: 'simple_blurring', isSelected: false, label: 'Simple Blurring', id: 2 },
    { name: 'pixelization', isSelected: false, label: 'Pixelization', id: 3 }, 
    { name: 'black_bar', isSelected: false, label: 'Black Bar', id: 4 },
    { name: 'fill_in', isSelected: false, label: 'Fill In', id: 5 },
  ]); 

  // const { pixel_sort, simple_blurring, pixelization, black_bar, fill_in } = checkBoxState;

  let url = 'http://127.0.0.1:5001/api/censor?options='; 

  const handleCensoringAlgorithmsChange = (event) => {
    setCensoringAlgorithms({...censoringAlgorithms, [event.target.name]: event.target.checked});
    console.log(censoringAlgorithms);  
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
    setIsCensoring(true); 
    // call api and retreive censored images
    let form = new FormData(); 
    
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
    setCoordsPass(imageMasks);
    console.log(imageMasks.length); 
  }, [imageMasks]);

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
            </Grid>
          : <Grid container>
              <Grid item xs={6}>
                <Button size='small' className={classes.censorButton} onClick={censorImages}>
                  Censor
                </Button>
                <CensorshipOptionsDialog 
                  options={censoringAlgorithms} 
                  handleOptionsChange={handleCensoringAlgorithmsChange}  
                />
              </Grid>
            </Grid>
        }
        
        {/* Canvas Component */}
        <Canvas
          image={[images[page - 1]]}
          coordsPass={coordsPass[page - 1]}
          setCoordsPass={handleCoordsChange}
        />
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