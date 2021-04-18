import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import CanvasPagination from '../components/CanvasPagination';
import Container from '@material-ui/core/Container';
import EXIF from 'exif-js';

const useStyles = makeStyles((theme) => ({
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
  const [metadata, setMetadata] = useState([]);
  const [allFilesMetadata, setAllFilesMetadata] = useState([]);
  const onDrop = acceptedFiles => {
    console.log(acceptedFiles)
    setImages(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));


    EXIF.getData(acceptedFiles[0], function(){
      //var ex= EXIF.pretty(this); //this is a string and pretty print
      var ex = EXIF.getAllTags(this); //THIS is a dictionary

      // recommended begin
      var rec_list = ["make", "model", "gps", "maker", "note", "location", "name",
        "date", "time", "description", "software", "device", 
        "longitude", "latitude", "altitude"]
      var found = {};
      if (ex){
        for (let tag in ex){
          let t = tag.toLowerCase();
          for (const rec of rec_list){
              if (t.includes(rec)) {
                found[tag] = EXIF.getTag(this,tag); //add to found dictionary tag:description pairs
              }
          }
        }
      }
      console.log(found);
      //recommended end
    });
  };

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    images.forEach(file => URL.revokeObjectURL(file.preview));
  }, [images]);

  return (
    <Container>
      {images.length > 0
        ? <CanvasPagination images={images} />
        : <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()} className={clsx(classes.center, classes.dropOutline)}>
                <input {...getInputProps()} />
                <p style={{ textAlign: 'center' }}>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      }
    </Container>
  );
}

export default Main;