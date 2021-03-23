const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');
const axios = require('axios');

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

  let form = new FormData();

  let data = req.files;

  let image = data['image'][0];
  let mask = data['mask'][0];

  form.append('image', image.buffer, image.originalname);
  form.append('mask', mask.buffer, mask.originalname);

  axios({
  method: "post",
  url: "http://localhost:5000/api/censor",
  data: form,
  headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}`, },
})
  .then(function (response) {
    return res.send(response.data.ImageBytes)
  })
  .catch(function (response) {
    //handle error
    console.log(response);
    return res.send(response);
  });

});

app.listen(process.env.PORT || 8080);
