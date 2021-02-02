import { useState, useEffect, useRef } from 'react';

export function redraw(ctx, coords) {
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2;
  if (coords.length === 0) {
    return;
  }

  const lastIndex = coords.length-1;

  coords.forEach((coord, index) => {
    if(!coord.drag) {
      if(index===0) {
        ctx.beginPath();
        ctx.moveTo(coord.x, coord.y);
        ctx.lineTo(coord.x, coord.y);
        ctx.stroke();
      }
      // if this is just a different path
      else {
        ctx.fill();
        ctx.closePath();
        ctx.moveTo(coord.x, coord.y);
        ctx.beginPath();
        ctx.lineTo(coord.x, coord.y);
        ctx.stroke();
      }
    } else {
      ctx.lineTo(coord.x, coord.y);
      ctx.stroke();
      if(index===lastIndex) {
        ctx.fill();
        ctx.closePath();
      }
    }

  })
}

export function setStyles(ctx, params) {
  ctx.fillStyle = 'fillStyle' in params ? params.fillStyle : ctx.fillStyle;
  ctx.strokeStyle = 'strokeStyle' in params ? params.strokeStyle : ctx.strokeStyle;
}

// only use for drawing the last element added to array
export function draw(ctx, coords) {
  ctx.fillStyle = "#75c2eb4d";
  //console.log(ctx.fillStyle);
  ctx.strokeStyle = '#004ba6';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2;
  if (coords.length === 0) {
    return;
  }

  let i = coords.length - 1
  // if this is the first point of a new path
  if (!coords[i].drag) {
    // if this is the first point being drawn
    if (coords.length === 1) {
      ctx.beginPath();
      ctx.moveTo(coords[i].x, coords[i].y);
      ctx.lineTo(coords[i].x, coords[i].y);
      ctx.stroke();
    }
    // if this is just a different path
    else {
      ctx.moveTo(coords[i].x, coords[i].x);
      ctx.beginPath();
      ctx.lineTo(coords[i].x, coords[i].y);
      ctx.stroke();
    }
  }
  // if this is the continuation of a path
  else {
    ctx.lineTo(coords[i].x, coords[i].y);
    ctx.stroke();
  }
};

export function useCanvas() {
  const canvasRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    // clear the canvas area before rendering the coordinates held in state
    //ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);

    // draw all coordinates held in state
    //coordinates.forEach((coordinate) => { draw(ctx, coordinate, rect) });
    draw(ctx, coordinates)
  }, [coordinates]);

  return [coordinates, setCoordinates, canvasRef];
}