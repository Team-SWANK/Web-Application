import React, { useState, useEffect } from 'react';
import CanvasPagination from '../components/CanvasPagination';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormData from 'form-data';
import { resizeImage } from '../utils/utils.js';
import { draw } from '../hooks/useCanvas';

const axios = require('axios');

function Url() {
  // Get image source URL
  let location = window.location.href
  let imageURL = location.split('url/')[1]

  const [imagesSegmented, setImagesSegmented] = useState(false);
  const [imageMasks, setImageMasks] = useState([]);
  const [resizedImages, setResizedImages] = useState([]);
  const [i, setI] = useState(new Image())

  async function drawImage(source) {
    // need a Javascript Image object to draw onto canvas
    const img = new Image();
    // set source of the image object to be the uploaded image
    img.src = source;
    // have to wait for image object to load before using its width/height fields
    return new Promise((resolve, reject) => {
      img.onload = () => {
        setI(img)
        resolve();
      }
    });
  }

  async function getImageMasksAsync(acceptedFiles) {
    let resizedImagesTemp = [];
    let maskPredictions = [];

    // resize the image before calling the segmentation api   
    acceptedFiles.forEach((image) => {
      resizedImagesTemp.push(resizeImage(image));
    });
    resizedImagesTemp = await Promise.all(resizedImagesTemp);
    setResizedImages(resizedImagesTemp);
    // call the segmentation api for each resized image
    resizedImagesTemp.forEach((resizedImage) => {
      let form = new FormData();
      form.append('image', resizedImage, resizedImage.fileName);
      try {
        maskPredictions.push(axios({
          method: "post",
          url: "/api/Segment",
          data: form,
          headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}`, },
        }).then(response => {
          return response.data.predictions;
        }));
      } catch (err) {
        console.log('error detected', err);
      }
    });
    maskPredictions = await Promise.all(maskPredictions);
    setImageMasks(maskPredictions);
    setImagesSegmented(true);
    // console.log(maskPredictions)
  }

  // used to set width/height of canvas and to draw uploaded image onto canvas
  useEffect(async () => {
    const results = axios({
      method: "get",
      url: "/imageUrl?url="+imageURL
    }).then(response => {
      return response.data;
    }).catch(err => {
      console.log(err)
    });
    let source = await results;
    await drawImage(source);
    return () => {console.log(i)}
  }, [imageURL])

  useEffect(async () => {
    if(i.src !== "") {
      await getImageMasksAsync([i]);
      setI(i.src);
    }
  }, [i])

    return (
      <div>
        { !imagesSegmented && 
        <Container>
          <LinearProgress />
        </Container>
        }
        { imagesSegmented && 
        <Container>
          <CanvasPagination images={[i]} imageMasks={imageMasks} resizedImages={resizedImages} />
        </Container>
        }
      </div>
    );
}


export default Url;
