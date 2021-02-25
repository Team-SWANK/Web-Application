import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import Canvas from '../Canvas';

const useStyles = makeStyles((theme) => ({
  pagination: {
    color: 'white',
    position: 'absolute',
    bottom: '35px'
  }
}));

function CanvasPagination({ images }) {
  const classes = useStyles();

  const [page, setPage] = useState(1);

  const handlePagination = (event, value) => {
    setPage(value);
  };

  const coordsPass = Array.from({ length: 1244 }, () => Array.from({ length: 700 }, () => true));

  return (
    <div>
      <Canvas image={[images[page - 1]]} coordsPass={coordsPass} />
      {/* <Canvas image={[images[page - 1]]} /> */}
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
    </div>
  );
}

export default CanvasPagination;