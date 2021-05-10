import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import CanvasPagination from '../components/CanvasPagination';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormData from 'form-data';
import { resizeImage } from '../utils/utils.js';
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  center: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%'
  },
  dropOutline: {
    height: '20vh',
    width: '50vw',
    borderStyle: 'dashed',
    borderRadius: '10px',
    marginTop: '20px'
  },
  canvas: {
    border: "1px solid black",
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: "auto",
    marginRight: "auto",
    display: "block"
  }
}));

function Main() {
  const classes = useStyles();
  const [images, setImages] = useState([]);
  const [imagesSegmented, setImagesSegmented] = useState(false);
  const [imagesUploaded, setImageUploaded] = useState(false);
  const [imageMasks, setImageMasks] = useState([]);
  const [resizedImages, setResizedImages] = useState([]);

  const onDropAccepted = async (acceptedFiles) => {
    // render progress indicator after image is uploaded
    setImageUploaded(true);
    setImages(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));

    await getImageMasksAsync(acceptedFiles);
    setImagesSegmented(true);
  };

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
          console.log(response)
          return response.data.predictions;
        }));
      } catch (err) {
        console.log('error detected', err);
      }
    });
    maskPredictions = await Promise.all(maskPredictions);
    setImageMasks(maskPredictions);
    // console.log(maskPredictions)
  }

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    images.forEach((image) => URL.revokeObjectURL(image.preview));
  }, [images]);

  if (images.length > 0 && imagesSegmented) {
    return (
      <Container>
        <CanvasPagination images={images} imageMasks={imageMasks} resizedImages={resizedImages} />
      </Container>
    );
  } else if (imagesUploaded) {
    return (
      <Container className={classes.root}>
        <LinearProgress />
      </Container>
    );
  } else {
    return (
      <Container>
        <h2>Welcome to the Photosense Web Application</h2>
        <p style={{width: '70%'}}>If this is your first time visiting we recommend looking at the Learn More section of this website to 
            learn how to use this interface to it's fullest potential. Feel free to also check out our social media bots
            on Twitter and Reddit.
        </p>
        <Dropzone
          accept="image/jpeg, image/png"
          onDropAccepted={onDropAccepted}
          onDropRejected={() => alert('Only JPEG and PNG image file types are accepted')}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()} className={clsx(classes.center, classes.dropOutline)}>
                <input {...getInputProps()} />
                <p style={{ textAlign: 'center' }}>
                  Drag 'n' drop some files here, or click to select files <br></br>
                  <em>(Only Jpeg and PNG images  will be accepted)</em>
                </p>
              </div>
            </section>
          )}
        </Dropzone>
      </Container>
    );
  }
}

export default Main;

