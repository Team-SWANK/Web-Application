import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container'; 
import Canvas from '../Canvas';
import ResponsiveDialog from "./ResponsiveDialog.js";

const useStyles = makeStyles((theme) => ({
  pagination: {
    color: 'white',
    position: 'absolute',
    bottom: '35px'
  }
}));

const maxWidth = 1000;
const maxHeight = 700;

async function getDimensions(image) {
  let dimensions = { width: 1, height: 1 };
  let i = new Image();
  i.src = image.preview;
  return new Promise((resolve, reject) => {
    i.onload = () => {
      dimensions.width = i.width;
      dimensions.height = i.height;
      const aspectRatio = i.width / i.height;
      if (i.width > maxWidth) {
        dimensions.width = maxWidth;
        dimensions.height = (aspectRatio ** -1) * maxWidth;
      }
      if (i.height > maxHeight) {
        dimensions.height = maxHeight;
        dimensions.width = (aspectRatio) * maxHeight;
      }
      resolve([
        Math.floor(dimensions.width),
        Math.floor(dimensions.height)
      ]);
    }
  });
}

function CanvasPagination({ images }) {

  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [coordsPass, setCoordsPass] = useState([]);

  const handlePagination = (event, value) => {
    setPage(value);
    console.log(coordsPass);
  };

  const handleCoordsChange = (coords) => {
    let newCoords = coordsPass;
    newCoords[page - 1] = coords;
    setCoordsPass(newCoords);
  }

  useEffect(async () => {
    /** Retrieve the dimensions for each image */
    let dimensions = [];
    images.forEach((image) => {
      dimensions.push(getDimensions(image));
    });
    dimensions = await Promise.all(dimensions);

    /** Populate coordsPass with 2D array pixel mappings for each image */
    dimensions.forEach((dimension) => {
      let initCoordsPass = Array.from({ length: dimension[0] }, () =>
        Array.from({ length: dimension[1] }, () => false)
      );
      let newCoordsPass = coordsPass;
      newCoordsPass.push(initCoordsPass);
      setCoordsPass(newCoordsPass);
    });
  }, [images]);

  return (
    <Container>

      <ResponsiveDialog />
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
          />
          : null
        }
      </Grid>
    </Container>
  );
}

export default CanvasPagination;