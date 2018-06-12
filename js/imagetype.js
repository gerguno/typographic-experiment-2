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

function getFont() {
    var ratio = 0.09;
    var size = ctx.canvas.width * ratio;   
    return (size|0) + 'px Times New Roman Bold';
}

function getFontTop() {
    return Math.round(ctx.canvas.height * 0.12);
}

function setImages(txt) {
  window.stop();

  var i, data32,
      distance = 2;                                                                          
  imgs = [];
  ctx.canvas.width = ctx.canvas.width;              // clear canvas so we can

  ctx.font = getFont();
  ctx.fillText(txt, 0, getFontTop());  

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
    // setTimeout(function() {
    //   window.stop();
    // },30000);
}

setImages(inp.value);
window.onresize = function() {
  window.stop();
  ctx.canvas.width = ctx.canvas.width; 
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight; 
  setImages(inp.value);
}