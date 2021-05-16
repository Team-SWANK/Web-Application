import EXIF from 'exif-js';
import { saveAs } from 'file-saver';
var JSZip = require("jszip");

// const MAX_WIDTH = 1000;
// const MAX_HEIGHT = 700;
const MAX_WIDTH = 980;
const MAX_HEIGHT = 680;

export async function getDimensions(image) {
  let dimensions = { width: 1, height: 1 };
  let i = new Image();
  i.src = image.preview;
  return new Promise((resolve, reject) => {
    i.onload = () => {
      dimensions.width = i.width;
      dimensions.height = i.height;
      const aspectRatio = i.width / i.height;
      if (i.width > MAX_WIDTH) {
        dimensions.width = MAX_WIDTH;
        dimensions.height = (aspectRatio ** -1) * MAX_WIDTH;
      }
      if (i.height > MAX_HEIGHT) {
        dimensions.height = MAX_HEIGHT;
        dimensions.width = (aspectRatio) * MAX_HEIGHT;
      }
      resolve([
        Math.floor(dimensions.width),
        Math.floor(dimensions.height)
      ]);
    }
  });
}

// used to set width/height of canvas and to draw uploaded image onto canvas
export async function drawImage(ctx, image, setWidth, setHeight) {
  // need a Javascript Image object to draw onto canvas
  let i = new Image();
  if (Object.prototype.toString.call(image) === "[object Array]") {
    if (Object.prototype.toString.call(image[0]) === "[object String]") {
      i.src = image[0]
    } else {
      const file = image.find(f => f);
      i.src = file.preview;
    }
  } else if (Object.prototype.toString.call(image) === "[object HTMLImageElement]") {
    i.src = image.src;
  }

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
      if (i.width > MAX_WIDTH) {
        newDimensions.width = MAX_WIDTH;
        newDimensions.height = (aspectRatio ** -1) * MAX_WIDTH;
      }
      // cross multiplication of aspect ratio and maxHeight to find new width
      if (i.height > MAX_HEIGHT) {
        newDimensions.height = MAX_HEIGHT;
        newDimensions.width = (aspectRatio) * MAX_HEIGHT;
      }
      // sets width/height of canvas so it's same size as image and draws image onto canvas
      setWidth(Math.floor(newDimensions.width));
      setHeight(Math.floor(newDimensions.height));
      resolve(ctx.drawImage(i, 0, 0, newDimensions.width, newDimensions.height));
    }
  });
}

//used to get the metadata tags of an image in js, instead of having to send a request from the python API
export async function getMetadataTags(image) {

  return new Promise((resolve, reject) => {
    //var allData = EXIF.getAllTags(this);

    EXIF.getData(image, function () {
      //var ex= EXIF.pretty(this); //this is a string and pretty print
      var ex = EXIF.getAllTags(this); //THIS is a dictionary

      // recommended begin
      var rec_list = ["make", "model", "gps", "maker", "note", "location", "name",
        "date", "time", "description", "software", "device",
        "longitude", "latitude", "altitude"]
      var found = {};
      if (ex) {
        for (let tag in ex) {
          let t = tag.toLowerCase();
          for (const rec of rec_list) {
            if (t.includes(rec)) {
              found[tag] = EXIF.getTag(this, tag); //add to found dictionary tag:description pairs
            }
          }
        }
      }
      resolve(found);
      //recommended end
    });
    //}
  });
}

export async function resizeImage(image) {
  let newDimensions = { width: 1, height: 1 };

  let i = new Image();
  if (Object.prototype.toString.call(image) === "[object File]") {
    // set source of the image object to be the uploaded image
    i.src = image.preview;
  } else if (Object.prototype.toString.call(image) === "[object HTMLImageElement]") {
    i.src = image.src;
  }

  return new Promise((resolve, reject) => {
    i.onload = () => {
      let canvas = document.createElement('canvas');
      // resize image width and height
      newDimensions.width = i.width;
      newDimensions.height = i.height;
      const aspectRatio = i.width / i.height;
      if (i.width > MAX_WIDTH) {
        newDimensions.width = MAX_WIDTH;
        newDimensions.height = (aspectRatio ** -1) * MAX_WIDTH;
      }
      if (i.height > MAX_HEIGHT) {
        newDimensions.height = MAX_HEIGHT;
        newDimensions.width = (aspectRatio) * MAX_HEIGHT;
      }
      // create canvas for resized image
      canvas.width = Math.floor(newDimensions.width);
      canvas.height = Math.floor(newDimensions.height);
      canvas.getContext('2d').drawImage(i, 0, 0, canvas.width, canvas.height);
      // convert canvas to Blob
      let dataUrl = canvas.toDataURL('image/jpeg');
      // var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
      // window.location.href = image; // it will save locally

      let resizedImage = dataURLToBlob(dataUrl);
      resolve(resizedImage);
    }
  });
}

export async function convertMask2dToImage(mask) {
  let width = mask[0].length;
  let height = mask.length;
  // the (* 4) at the end represents RGBA which is needed to be compatible with canvas
  let buffer = new Uint8ClampedArray(width * height * 4);

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  buffer = await fillBuffer(buffer, width, height, mask);

  return new Promise((resolve, reject) => {
    var idata = ctx.createImageData(width, height);
    idata.data.set(buffer);

    ctx.putImageData(idata, 0, 0);

    var dataUri = canvas.toDataURL('image/jpeg');
    let maskedImage = dataURLToBlob(dataUri);

    // var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    // window.location.href = image; // it will save locally

    resolve(maskedImage);
    reject('image was not masked');
  });
}

let fillBuffer = async (buffer, width, height, mask) => {
  
  // fill the buffer with some data
  for (let x = 0; x < height; x++) {
    for (let y = 0; y < width; y++) {
      let pos = (x * width + y) * 4;
      // paint black if element is false
      if (!mask[x][y]) {
        buffer[pos] = 0;
        buffer[pos + 1] = 0;
        buffer[pos + 2] = 0;
        buffer[pos + 3] = 255;
      } else {
        buffer[pos] = 255;
        buffer[pos + 1] = 255;
        buffer[pos + 2] = 255;
        buffer[pos + 3] = 255;
      }
    }
  }
  return new Promise((resolve, reject) => {
    resolve(buffer);
    reject('Buffer was not filled');
  });
}

let dataURLToBlob = function (dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = parts[1];

    return new Blob([raw], { type: contentType });
  }

  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

function base64urlToBase64(base64url) {
  var base64 = base64url.replace(/-/,"+").replace(/_/, "/");
  if (base64.length % 4 != 0) {
      base64.concat(new Array(4 - base64.length % 4).join( "=" ));
      // base64.concat(String(repeating: "=", count: 4 - base64.length % 4))
  }
  return base64
}

export async function downloadImages(images, fileNames) {
  // window.location.href = images[0].src.replace("image/jpeg", "image/octet-stream");
  var zip = new JSZip();
  images.forEach((image, idx) => {
    zip.file(fileNames[idx], base64urlToBase64(images[idx].replace(/^data:image\/(png|jpeg|jpg);base64,/, '')), {base64: true});
  })
  zip.generateAsync({type:"blob"})
    .then(content => {
      saveAs(content, "photosense photos.zip");
    })
}