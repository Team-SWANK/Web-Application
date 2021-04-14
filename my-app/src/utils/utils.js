const MAX_WIDTH = 1000;
const MAX_HEIGHT = 700;

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
    const file = image.find(f => f);
    // set source of the image object to be the uploaded image
    i.src = file.preview;
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

export async function resizeImage(image) {
  let newDimensions = { width: 1, height: 1 };
  let i = new Image();
  i.src = image.preview;
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
            
      canvas.width = Math.floor(newDimensions.width);
      canvas.height = Math.floor(newDimensions.height);
      canvas.getContext('2d').drawImage(i, 0, 0, canvas.width, canvas.height);
      let dataUrl = canvas.toDataURL('image/jpeg');
      let resizedImage = dataURLToBlob(dataUrl);
      resolve(resizedImage);
    }
  });
}

let dataURLToBlob = function(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = parts[1];

      return new Blob([raw], {type: contentType});
  }

  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {type: contentType});
}