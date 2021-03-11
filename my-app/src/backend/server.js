const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const upload = multer();

app.use(express.static(path.join(__dirname, 'build')));

// Test get request
app.get('/ping', function (req, res) {
 return res.send('pong');
});

// Serve main web application
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Test api
let cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mask', maxCount: 1 }])
app.post('/test',cpUpload, function(req, res){

  console.log(req);

  let data = req.files;

  let image = data['image'][0];
  let mask = data['mask'][0];

  let image_data = [image.originalname, image.buffer, 'multipart/form-data'];
  let mask_data = [mask.originalname, mask.buffer, 'multipart/form-data'];

  data = {
    image: image_data,
    mask: mask_data
  }

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    files: data
  };

  let b64 = null;
  fetch('http://127.0.0.1:5000/api/censor', options).then(res => res.json()).then(d=>{
    b64 = d['message']
  }).catch(()=>{
    console.log("Promise rejected!");
  });


  return res.send(b64);

});

app.listen(process.env.PORT || 8080);
