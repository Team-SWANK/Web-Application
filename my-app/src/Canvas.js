import React, { useState, useEffect, useRef } from 'react';
import { useCanvas, redrawGrid, setStyles } from './hooks/useCanvas';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
//import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Slider from '@material-ui/core/Slider';
import BrushSizeDisplay from './components/BrushSize';
//import Pagination from '@material-ui/lab/Pagination';
import { useHistory } from 'react-router';

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
  toolbarGrid : {
    margin: 'auto',
    marginTop: 30,
    marginBottom: 15
  },
  toolbarSlider: {
    maxWidth: 200,
    paddingBottom: 55,
    marginRight: 20,
  }
}));

const maxWidth = 1000;
const maxHeight = 700;

// used to set width/height of canvas and to draw uploaded image onto canvas
async function drawImage(ctx, image, setWidth, setHeight) {
  // need a Javascript Image object to draw onto canvas
  let i = new Image();
  if(Object.prototype.toString.call(image) === "[object Array]") {
    const file = image.find(f => f);
    // set source of the image object to be the uploaded image
    i.src = file.preview;
  } else if (Object.prototype.toString.call(image) === "[object HTMLImageElement]"){
    i.src = image.src;
  }
  
  // holds new dimensions of the canvas after calculations
  let newDimensions = { width: 1, height: 1 }
  // have to wait for image object to load before using its width/height fields
  return new Promise((resolve, reject) => {
    i.onload = () => {
      // set new dimensions to equal the dimensions of uploaded image  
      newDimensions.width = i.width;
      newDimensions.height = i.height;
      // aspect ratio of uploaded image
      const aspectRatio = i.width / i.height;
      // cross multiplication of aspect ratio and maxWidth to find new height
      if (i.width > maxWidth) {
        newDimensions.width = maxWidth;
        newDimensions.height = (aspectRatio ** -1) * maxWidth;
      }
      // cross multiplication of aspect ratio and maxHeight to find new width
      if (i.height > maxHeight) {
        newDimensions.height = maxHeight;
        newDimensions.width = (aspectRatio) * maxHeight;
      }
      // sets width/height of canvas so it's same size as image and draws image onto canvas
      setWidth(Math.floor(newDimensions.width));
      setHeight(Math.floor(newDimensions.height));
      resolve(ctx.drawImage(i, 0, 0, newDimensions.width, newDimensions.height));
    }
  });
}

function Canvas({ image = new Image(), coordsPass = [[]] }) {
  const classes = useStyles();

  // Canvas Hooks
  const [coordinates, setCoordinates, canvasRef, width, setWidth, height, setHeight, drawPixel] = useCanvas();
  //const [coordinates2, setCoordinates2, canvasRef2, width2, setWidth2, height2, setHeight2, drawPixel2] = useCanvas();
  const [paint, setPaint] = useState(false);
  const [rect, setRect] = useState({});

  // Image Hooks
  const imageCanvasRef = useRef(null);

  // Toolbar Hooks
  const [mode, setMode] = useState(1); // true => Draw, false => Erase
  const [radius, setRadius] = useState(10);
  //const [page, setPage] = useState(1);

  const history = useHistory();

  const [isCensored, setIsCensored] = useState(false);

  // used to set the rect object (the bounding client rectangle used to find offsets)
  useEffect(() => {
    const canvasObj = canvasRef.current;
    setRect(canvasObj.getBoundingClientRect());

    if(coordsPass.length === width) {
      let ctx = canvasRef.current.getContext('2d');
      setStyles(ctx, {'globalAlpha': 0.3, 'strokeStyle': 'rgba(117, 194, 235, 1)', 'fillStyle': 'rgba(117, 194, 235, 1)', 'globalCompositeOperation': 'xor'})
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
    let imageData = ctx.getImageData(0, 0, width, height);
    let copy = [...coordinates];
    for(let x=0; x<width; x++) {
      for(let y=0; y<height; y++) {
        // 4 bytes for each channel color and need the 4th channel (alpha) to compute
        copy[x][y] = imageData.data[(y*width+x)*4+4] > 0 ? true : false;
      }
    }
    setCoordinates(copy);
  }

  const handleToolbarClick = (event, newMode) => {
    if(newMode !== null) {
      setMode(newMode);
      const ctx = canvasRef.current.getContext('2d');
      if(newMode) {
        setStyles(ctx, {'globalAlpha': 0.3, 'strokeStyle': 'rgba(117, 194, 235, 0.2)', 'fillStyle': 'rgba(117, 194, 235, 0.2)', 'globalCompositeOperation': 'xor'})   
      } else {
        setStyles(ctx, {'globalAlpha': 1, 'strokeStyle': 'rgba(0, 0, 0, 1)', 'fillStyle': 'rgba(0, 0, 0, 1)', 'globalCompositeOperation': 'destination-out'}) 
      }
    }
  }

  const handleRadiusSliderChange = (event, newValue) => {
    if(newValue >= 10 && newValue <= 50) {
      setRadius(newValue);
    }
  }

  const handleCanvasClick = (event) => {
    let x = Math.floor(event.pageX - rect.left);
    let y = Math.floor(event.pageY - rect.top);

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x-0.0001, y-0.0001);
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
    if(paint) {
      imgDataToCoordinates();
      //canvasRef.current.getContext('2d').endPath();
    }
    setPaint(false);
  }

  const handleMouseExitCanvas = () => {
    if(paint) {
      imgDataToCoordinates();
    }
    setPaint(false);
  }

  const censorImage = async () => {
    let canvasObj = imageCanvasRef.current;
    let ctx = canvasObj.getContext('2d');
    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
    setStyles(ctx, { 'fillStyle': '#ffffff', 'strokeStyle': '#ffffff' })
    await drawImage(ctx, image, setWidth, setHeight);
    redrawGrid(ctx, coordinates);
    setPaint(false);
    setIsCensored(true);

    ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.onMouseDown = null;
    ctx.onMouseMove = null;
    ctx.onMouseUp = null;
    ctx.onMouseLeave = null;
  }

  const download = () => {
    let canvasObj = imageCanvasRef.current;
    var fullQualityImage = canvasObj.toDataURL('image/jpeg', 1.0);
    var link = document.createElement('a');
    link.download = fullQualityImage;
    link.href = fullQualityImage;
    link.click();
  }

  const reload = () => {
    history.go(0);
  }

  return (
    <div>
        {!isCensored &&
          <Grid container direction="row" justify="center" alignItems="center" className={classes.toolbarGrid} style={{width: width}}>
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
            <Grid item xs={12} md={2}>
              <Button
                size="small"
                onClick={censorImage}
                className={classes.toolbarButton}
                style={{float: 'right'}}
              >
                Censor
              </Button>
            </Grid>
          </Grid>
        }
        {isCensored &&
          <Grid container direction="row" justify="center" alignItems="center" className={classes.toolbarGrid} style={{width: width}}>
            <Button
              size="small"
              onClick={reload}
              className={classes.toolbarButton}
            >
              New Image
            </Button>
            <Button
              size="small"
              onClick={download}
              className={classes.toolbarButton}
              style={{ marginLeft: "10px" }}
            >
              Download
            </Button>
          </Grid>
        }

      <Grid container spacing={0} justify="center">
        <Paper className={classes.paper} elevation={3} style={{width: width, height: height}}>
          <canvas
            id="image-canvas"
            className={classes.canvas}
            ref={imageCanvasRef}
            width={width}
            height={height}
            style={{zIndex: 0}}
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
            style={{zIndex: 1}}
          />
        </Paper>
      </Grid>
    </div>
  );
}

export default Canvas;
