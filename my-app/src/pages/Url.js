import React, { useState, useEffect } from 'react';
import Canvas from '../Canvas';
import { useLocation } from 'react-router-dom';

function Url() {

  // Get image source URL
  let location = window.location.href
  let imageURL = location.split('url/')[1]

  console.log(imageURL)

  const [i, setI] = useState(new Image())

  async function drawImage() {
    // need a Javascript Image object to draw onto canvas
    const img = new Image();
    // set source of the image object to be the uploaded image
    img.src = imageURL;
    console.log(imageURL)
    // have to wait for image object to load before using its width/height fields
    return new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(setI(img))
      }
    });
  }

  // used to set width/height of canvas and to draw uploaded image onto canvas
  useEffect(() => {
    drawImage();
    // dependencies so useEffect is not constantly reran
  }, [imageURL])

    return (
      <div>
        <Canvas image={i} />
      </div>
    );
}


export default Url;
