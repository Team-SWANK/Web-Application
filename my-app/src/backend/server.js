const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');
const axios = require('axios');

const app = express();
const upload = multer();
var request = require('request').defaults({ encoding: null });

app.use(express.static(path.join(__dirname, '../../build')));

// Test get request
app.get('/ping', function (req, res) {
 return res.send('pong');
});

// Serve main web application
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// get base64 from image
app.get('/imageUrl', function (req, res) {
  let url = req.query.url;
  console.log('got image request')
  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        let data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
        console.log('sending image b64')
        res.send(data);
    } else {
      res.send(error);
    }
  });
})

// Segmentation proxy
let segUpload = upload.fields([{name: 'image', maxCount: 1}])
app.post('/api/Segment', segUpload, function (req, res) {
  // *********
  // ********* change this to 'localhost' in the includes() if in development
  // ********* should be 'photosense.app' if being used in prod
  // *********
  if (!req.get("Referrer") || !req.get("Referer").includes('photosense.app')){
    console.log("attempt to access from outside webapp")
    return res.status(403).send('Forbidden Access');
  }
  let form = new FormData();
  let image = req.files['image'][0];
  form.append('image', image.buffer, image.originalname);
  console.log('segmentation request')
  axios({
    method: "post",
    url: "http://18.144.37.100/Segment?confidence=0.2",
    data: form,
    headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}`, },
  }).then(response => {
    if(!response.data.success) {
      return res.status(400).send(
        {
          message: 'error'
        });
    }
    return res.send(response.data)
  }).catch(err => {
    return res.status(400).send({message: err});
  })

})

// Censoring proxy
let cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mask', maxCount: 1 }])
app.post('/api/Censor',cpUpload, function(req, res) {
  // *********
  // ********* change this to 'localhost' in the includes() if in development
  // ********* should be 'photosense.app' if being used in prod
  // *********
  if (!req.get("Referrer") || !req.get("Referer").includes('photosense.app')) {
    console.log("attempt to access from outside webapp")
    return res.status(403).send('Forbidden Access');
  }
  let form = new FormData();
  let data = req.files;

  let image = data['image'][0];
  let mask = data['mask'][0];
  form.append('image', image.buffer, image.originalname);
  form.append('mask', mask.buffer, mask.originalname);
  console.log('censorship request')
  axios({
    method: 'post',
    url: 'http://18.144.37.100/Censor?options=' + req.query.options+'&metadata='+req.query.metadata,
    data: form,
    headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}`, },
  }).then(response => {
    if(!response.data.success) {
      return res.status(400).send(
        {
          message: 'error'
        });
    }
    return res.send(response.data)
  }).catch(err => {
    console.log(err.config.response)
    return res.status(400).send({message: err});
  })


});

// Serve main web application
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});


app.listen(process.env.PORT || 8080);
console.log("listening on port: 8080")