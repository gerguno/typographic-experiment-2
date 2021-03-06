// TEXT RESIZING - http://jsfiddle.net/AbdiasSoftware/A8Bc6/

var ctx = document.querySelector("canvas").getContext("2d"),
    form = document.querySelector("form"),
    inp = document.querySelector("#input");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight; 

var imgs = [];          

function loadImage(url) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
        img.src = url;
    img.onload = function () {
      return resolve(img);
    };
    img.onerror = function () {
      return reject(new Error("load " + url + " fail"));
    };
  });
}          

function depictImages(options) {
  // And this is the key to this solution
  // Always remember to make a copy of original object, then it just works :)
    var myOptions = Object.assign({}, options);
    return loadImage(myOptions.uri).then(function (img) {
      ctx.drawImage(img, myOptions.x, myOptions.y);
    });
}  

function getFontSize(txt) {
    var fontSize = 400,
        textWidth,
        fontSizeResult;
    function measureText(fontSize, callback) {    
      ctx.font = fontSize*4.5 + 'px Times New Roman Bold';
      ctx.fillText(txt, 0, 100);
      textWidth = (ctx.measureText(txt).width|0);
      ctx.canvas.width = ctx.canvas.width;
      callback(textWidth);
    }
    (function resizeText() {
      measureText(fontSize, function(textWidth) {
        if (ctx.canvas.width < textWidth) {
          // console.log(ctx.canvas.width, textWidth, fontSize, ctx.font);
          // console.log('fontSize has to be cropped!');
          fontSize = fontSize - 20;          
          resizeText();
        } 
        if (ctx.canvas.width > textWidth) {
          // console.log(ctx.canvas.width, textWidth, fontSize, ctx.font);
          // console.log('Finally fontSize cropped!');
          fontSizeResult = fontSize;
        }
      });      
    })();
    return fontSizeResult;
}

function getFontTopPosition() {
    return Math.round(ctx.canvas.height * 0.12);
}

function setImages(txt) {
  window.stop();
  var i, data32,
      distance = 2;                                                                          
  imgs = [];
  ctx.canvas.width = ctx.canvas.width;              // clear canvas so we can

  ctx.font = getFontSize(txt) + 'px Times New Roman Bold';
  ctx.fillText(txt, 0, getFontTopPosition());  

  // get a Uint32 representation of the bitmap:
  data32 = new Uint32Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data.buffer);

  ctx.canvas.width = ctx.canvas.width;
  // ctx.font = "400px Times New Roman Bold";
  // ctx.strokeText(txt, 7, 290);

  for(i=0; i < data32.length; i++) {
    if (data32[i] & 0xff000000) { 
      width = Math.round(Math.max(20,(40*Math.random())));
      height = Math.round(Math.max(20,(40*Math.random())));
      imgs.push({ 
          uri: 'https://source.unsplash.com/'+width+'x'+height+'/?'+txt, 
          x:   ((i % ctx.canvas.width) * distance * 2 + distance),
          y:   (((i / ctx.canvas.width)|0) * distance * 2 + distance)
      });
    }
  }
    imgs.forEach(depictImages);
}

setImages(inp.value);

window.onresize = function() {
  window.stop();
  ctx.canvas.width = ctx.canvas.width; 
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight; 
  setImages(inp.value);
}