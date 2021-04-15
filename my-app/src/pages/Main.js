import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Dropzone, { useDropzone } from 'react-dropzone';
import CanvasPagination from '../components/CanvasPagination';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormData from 'form-data';
import { resizeImage } from '../utils/utils';

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
  
  const onDropAccepted = async (acceptedFiles) => {  
    // render progress indicator after image is uploaded
    setImageUploaded(true); 
    setImages(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));

    console.log(acceptedFiles);
    setImagesSegmented(true); 

    // await getImageMasksAsync(acceptedFiles);  
  };

  async function getImageMasksAsync(acceptedFiles) { 
    let masks = [];
    await acceptedFiles.forEach(async (image, i) => {
      // resize the image before calling the segmentation api  
      let resizedImage = await resizeImage(image);
      // console.log(await resizedImage.text());
      // make the POST request
      let form = new FormData(); 
      form.append('image', resizedImage, resizedImage.fileName);
      let response = await axios({
        method: "post",
        url: "http://13.57.50.47:5000/",
        data: form,
        headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}`, },
      })
      masks.push(response.data.predictions);
     
      // after all images have been masked 
      // set image masks, and segmentation true 
      // so CanvasPagination can be rendered with 
      // the props set   
      if(i === acceptedFiles.length - 1) {   
        setImageMasks(masks); 
        setImagesSegmented(true); 
      }
    });
  }

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    images.forEach((image) => URL.revokeObjectURL(image.preview));  
  }, [images]);

  if(images.length > 0 && imagesSegmented) {
    return (
      <Container>
        <CanvasPagination images={images} imageMasks={imageMasks} />
      </Container>
    ); 
  } else if(imagesUploaded) {
    return(
      <Container className={classes.root}>
        <LinearProgress />
      </Container>
    );  
  } else {
    return(
      <Container>
        <Dropzone 
          // onDrop={onDrop} 
          accept="image/jpeg, image/png"
          onDropAccepted={onDropAccepted}
          onDropRejected={() => alert('Only JPEG and PNG image file types are accepted')}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()} className={clsx(classes.center, classes.dropOutline)}>
                <input {...getInputProps()} />
                <p style={{ textAlign: 'center' }}>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </Container>
    ); 
  }
}

export default Main;

