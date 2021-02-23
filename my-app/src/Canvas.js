import React, { useState, useEffect } from 'react';
import { useCanvas, redraw, setStyles } from './hooks/useCanvas';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  paper: {
    //margin: 0,
    //position: "absolute",
    //top: "50%",
    //"-ms-transform": "translateY(-50%)",
    //transform: "translateY(-50%)"
  },
  canvas: {
    border: "1px solid black",
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: "auto",
    marginRight: "auto",
    display: "block"
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
  }
}));

function Canvas({ image }) {
  const classes = useStyles();

  // Canvas Hooks
  const [coordinates, setCoordinates, canvasRef] = useCanvas();
  const [paint, setPaint] = useState(false);
  const [rect, setRect] = useState({});

  // Image Hooks
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Toolbar Hooks
  const [mode, setMode] = useState(0); // 0 => Draw, 1 => Erase
  const [page, setPage] = useState(1);

  const maxWidth = 1000;
  const maxHeight = 700;

  const history = useHistory();

  const [isCensored, setIsCensored] = useState(false);

  // used to set the rect object (the bounding client rectangle used to find offsets)
  useEffect(() => {
    const canvasObj = canvasRef.current;
    setRect(canvasObj.getBoundingClientRect());
  }, [canvasRef, width, height]);

  // used to set width/height of canvas and to draw uploaded image onto canvas
  async function drawImage() {
    let i = new Image();
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    console.log(Object.prototype.toString.call(image));
    if(Object.prototype.toString.call(image) === "[object Array]") {
      const file = image.find(f => f);
      // set source of the image object to be the uploaded image
      i.src = file.preview;
    } else if(Object.prototype.toString.call(image) === "[object HTMLImageElement]") {
      i.src = image.src;
    }
    console.log(i)

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
        setWidth(newDimensions.width);
        setHeight(newDimensions.height);
        console.log(newDimensions.width);
        resolve(ctx.drawImage(i, 0, 0, newDimensions.width, newDimensions.height));
      }
    });
  }

  // used to set width/height of canvas and to draw uploaded image onto canvas
  useEffect(() => {
    drawImage();
    // dependencies so useEffect is not constantly reran
  }, [image, rect, canvasRef])

  const handleToolbarClick = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      if (newMode === 1) {
        setPaint(false);
        erase();
      }
    } else {
      if (mode === 1) {
        setPaint(false);
        erase();
      }
    }
  }

  const erase = async () => {
    /** Raycasting intersection code NOT functional */
    // let numIntersections = 0;
    // for(let i=0; i<=coord.x; i++) {
    //   if(coordinates.find(element => Math.floor(element.x) === i && Math.floor(element.y) === coord.y)) {
    //     numIntersections++;
    //   }
    // }
    // console.log('numIntersections: ' + numIntersections);

    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    // reverse loop of the coordinates array
    for (var i = coordinates.length - 1; i >= 0; i--) {
      // this if statement finds the start of the path (first occurence of the drag variable set to false)
      if (!coordinates[i].drag) {
        coordinates.pop();
        break;
      }
      coordinates.pop();
    }
    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
    await drawImage();
    redraw(ctx, coordinates);
    setPaint(false);
  }

  const handleCanvasClick = (event) => {
    if (mode === 0) {
      // first click will always have drag set to false (first point of path always has drag field as false)
      const coord = { x: (event.pageX - rect.left), y: (event.pageY - rect.top), drag: false };
      // sets state variable for is painting to true
      setPaint(true);
      // updates coordinates array so it can be drawn
      setCoordinates([...coordinates, coord]);
    }
  }

  const handleMouseMove = (event) => {
    // if the mouse is still down, after the user has clicked once already
    if (paint) {
      // drag is set to true for this coordinate because it is a part of the first path
      const coord = { x: (event.pageX - rect.left), y: (event.pageY - rect.top), drag: true };
      // update coordinates array that corresponds to the current image
      setCoordinates([...coordinates, coord]);
      //setClickDrag([...clickDrag, true]);
    }
  }

  const handleEndPath = (event) => {
    if (!paint || mode === 1) {
      return;
    }
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    // reverse loop of the coordinates array
    for (var i = coordinates.length - 1; i >= 0; i--) {
      // this if statement finds the start of the path (first occurence of the drag variable set to false)
      if (!coordinates[i].drag) {
        // sets up a line to the first point of the path from current point
        const coord = { x: coordinates[i].x, y: coordinates[i].y, drag: true };
        setCoordinates([...coordinates, coord]);
        //setClickDrag([...clickDrag, true]);
        console.log(coordinates);
        break;
      }
    }
    // fills path that was just made
    ctx.fill();
    // closes path and sets the is painting variable to false
    ctx.closePath();
    setPaint(false);
  }

  const handleMouseExitCanvas = async (event) => {
    if (!paint || mode === 1) {
      return;
    }
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    // reverse loop of the coordinates array
    for (var i = coordinates.length - 1; i >= 0; i--) {
      // this if statement finds the start of the path (first occurence of the drag variable set to false)
      if (!coordinates[i].drag) {
        coordinates.pop();
        break;
      }
      coordinates.pop();
    }
    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
    await drawImage();
    redraw(ctx, coordinates);
    setPaint(false);
  }

  const censorImage = async () => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');

    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
    setStyles(ctx, { 'fillStyle': '#ffffff', 'strokeStyle': '#ffffff' })
    await drawImage();
    redraw(ctx, coordinates);
    setPaint(false);
    canvasObj.onMouseDown = null;
    canvasObj.onMouseLeave = null;
    canvasObj.onMouseUp = null;
    setIsCensored(true);
  }

  const download = () => {
    const canvasObj = canvasRef.current;
    console.log(canvasObj)
    var fullQualityImage = canvasObj.toDataURL('image/jpeg', 1.0);
    var link = document.createElement('a');
    link.download = fullQualityImage;
    link.href = document.getElementById('canvas').toDataURL()
    link.click();
  }

  const reload = () => {
    history.go(0);
  }

  return (
    <div>
      <Grid container justify="center">
        {!isCensored &&
          <div style={{ marginTop: "30px" }}>
            <IconButton
              aria-label="undo"
              className="fas fa-undo"
              onClick={erase}
              style={{
                fontSize: 13,
                width: "30px",
                height: "30px",
                //color: "#181818"
              }}
            >
            </IconButton>
            <Button
              size="small"
              onClick={censorImage}
              className={classes.toolbarButton}
              style={{ marginLeft: "10px" }}
            >
              Censor
            </Button>
          </div>
        }
        {isCensored &&
          <div style={{ marginTop: "30px" }}>
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
          </div>
        }
      </Grid>
      <Grid container spacing={0} justify="center">
        <Paper className={classes.paper} elevation={3}>
          <canvas
            id="canvas"
            className={classes.canvas}
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleEndPath}
            onMouseLeave={handleMouseExitCanvas}
          />
        </Paper>
      </Grid>
    </div>
  );
}

export default Canvas;
