import React, { useState, useEffect, useRef } from 'react';
import { useCanvas, redrawGrid, setStyles } from './hooks/useCanvas';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Slider from '@material-ui/core/Slider';
import BrushSizeDisplay from './components/BrushSize';
import { drawImage } from './utils/utils';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "relative",
    paddingLeft: 10,
    paddingRight: 10,
  },
  canvas: {
    border: "1px solid black",
    position: 'absolute',
    top: 0,
    left: 0
  },
  toolbarButton: {
    marginLeft: "10px",
    width: "120px",
    fontWeight: "bold",
    color: "#181818",
    backgroundColor: "#eceff1",
    marginBottom: '10px'
  },
  pagination: {
    color: 'white',
    position: 'absolute',
    bottom: '35px'
  },
  toolbarGrid: {
    margin: 'auto',
    marginTop: 0,
    // marginBottom: 10
  },
  toolbarSlider: {
    maxWidth: 200,
    paddingBottom: 55,
    marginRight: 20,
  }
}));

function Canvas({ image = new Image(), coordsPass = [[]], setCoordsPass }) {
  const classes = useStyles();

  // Canvas Hooks
  const [coordinates, setCoordinates, canvasRef, width, setWidth, height, setHeight, drawPixel] = useCanvas();
  const [paint, setPaint] = useState(false);
  const [rect, setRect] = useState({});

  // Image Hooks
  const imageCanvasRef = useRef(null);

  // Toolbar Hooks
  const [mode, setMode] = useState(1); // true => Draw, false => Erase
  const [radius, setRadius] = useState(10);

  // used to set the rect object (the bounding client rectangle used to find offsets)
  useEffect(() => {
    const canvasObj = canvasRef.current;
    setRect(canvasObj.getBoundingClientRect());
    if (coordsPass[0].length === width) {
      let ctx = canvasRef.current.getContext('2d');
      setStyles(ctx, { 'globalAlpha': 0.5, 'strokeStyle': 'rgba(117, 194, 235, 255)', 'fillStyle': 'rgba(117, 194, 235, 255)', 'globalCompositeOperation': 'xor' })
      console.log(coordsPass)
      redrawGrid(ctx, coordsPass);
    }
  }, [canvasRef, width, height]);

  // used to set width/height of canvas and to draw uploaded image onto canvas
  useEffect(() => {
    drawImage(imageCanvasRef.current.getContext('2d'), image, setWidth, setHeight);
    // dependencies so useEffect is not constantly reran
  }, [image, imageCanvasRef, setWidth, setHeight])

  // used to set coordinates based on image data (to toptimize performance)
  const imgDataToCoordinates = () => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    console.log(height, width)
    let imageData = ctx.getImageData(0, 0, width, height);
    let copy = [...coordinates];
    console.log(copy)
    for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
        // 4 bytes for each channel color and need the 4th channel (alpha) to compute
        copy[x][y] = imageData.data[(x * width + y) * 4 + 4] > 0 ? true : false;
      }
    }
    console.log(copy)
    setCoordinates(copy);
    setCoordsPass(copy);
  }

  const handleToolbarClick = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      const ctx = canvasRef.current.getContext('2d');
      if (newMode) {
        setStyles(ctx, { 'globalAlpha': 0.3, 'strokeStyle': 'rgba(117, 194, 235, 0.2)', 'fillStyle': 'rgba(117, 194, 235, 0.2)', 'globalCompositeOperation': 'xor' })
      } else {
        setStyles(ctx, { 'globalAlpha': 1, 'strokeStyle': 'rgba(0, 0, 0, 1)', 'fillStyle': 'rgba(0, 0, 0, 1)', 'globalCompositeOperation': 'destination-out' })
      }
    }
  }

  const handleRadiusSliderChange = (event, newValue) => {
    if (newValue >= 10 && newValue <= 50) {
      setRadius(newValue);
    }
  }

  const handleCanvasClick = (event) => {
    let x = Math.floor(event.pageX - rect.left);
    let y = Math.floor(event.pageY - rect.top);

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x - 0.0001, y - 0.0001);
    drawPixel(ctx, x, y, radius);
    drawPixel(ctx, x, y, radius);
    drawPixel(ctx, x, y, radius);
    drawPixel(ctx, x, y, radius);
    //drawPixel(ctx, x+1, y+1, radius);
    setPaint(true);
  }

  const handleMouseMove = (event) => {
    // if the mouse is still down, after the user has clicked once already
    if (paint) {
      let x = Math.floor(event.pageX - rect.left);
      let y = Math.floor(event.pageY - rect.top);

      const ctx = canvasRef.current.getContext('2d');
      drawPixel(ctx, x, y, radius);
    }
  }

  const handleMouseUp = () => {
    if (paint) {
      imgDataToCoordinates();
      //canvasRef.current.getContext('2d').endPath();
    }
    setPaint(false);
  }

  const handleMouseExitCanvas = () => {
    if (paint) {
      imgDataToCoordinates();
    }
    setPaint(false);
  }

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center" className={classes.toolbarGrid} style={{ width: width }}>
        <Grid item xs={12} md={2}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleToolbarClick}
            aria-label="tool toggle">
            <ToggleButton value={1} aria-label="draw tool">
              <i className="fas fa-pen"></i>
            </ToggleButton>
            <ToggleButton value={0} aria-label="draw tool">
              <i className="fas fa-eraser"></i>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} md={8}>
          <Slider value={radius} onChange={handleRadiusSliderChange}
            min={10} max={50} aria-labelledby="radius slider" className={classes.toolbarSlider}>
          </Slider>
          <BrushSizeDisplay radius={radius} />
        </Grid>
      </Grid>
      <Grid container spacing={0} justify="center">
        <Paper className={classes.paper} elevation={3} style={{ width: width, height: height }}>
          <canvas
            id="image-canvas"
            className={classes.canvas}
            ref={imageCanvasRef}
            width={width}
            height={height}
            style={{ zIndex: 0 }}
          />
          <canvas
            id="canvas"
            className={classes.canvas}
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseExitCanvas}
            style={{ zIndex: 1 }}
          />
        </Paper>
      </Grid>
    </div>
  );
}

export default Canvas;
