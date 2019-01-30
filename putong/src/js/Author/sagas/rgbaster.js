function getContext(width, height) {
  let canvas = document.createElement("canvas");
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  return canvas.getContext('2d');
};

function getImageData(img) {
  let context = getContext(img.width, img.height);
  context.drawImage(img, 0, 0);
  let imageData = context.getImageData(0, 0, img.width, img.height);
  return imageData;
};

function makeRGB(name) {
  return ['rgb(', name, ')'].join('');
};

function mapPalette(palette) {
  let arr = [];
  for (let prop in palette) { arr.push(frmtPobj(prop, palette[prop])) };
  arr.sort(function (a, b) { return (b.count - a.count) });
  return arr;
};

function fitPalette(arr, fitSize) {
  if (arr.length > fitSize) {
    return arr.slice(0, fitSize);
  } else {
    for (let i = arr.length - 1; i < fitSize - 1; i++) { arr.push(frmtPobj('0,0,0', 0)) };
    return arr;
  }
};

function frmtPobj(a, b) {
  return { name: makeRGB(a), count: b };
}

function colorHex(rgb) {
  var bg = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x, 10).toString(16)).slice(-2);
  }
  return (hex(bg[1]) + hex(bg[2]) + hex(bg[3])).toUpperCase();
}

let PALETTESIZE = 10;

export default function RGBaster(img, opts) {
  opts = opts || {};
  let exclude = opts.exclude || []; // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
  let paletteSize = opts.paletteSize || PALETTESIZE;
  let data = getImageData(img).data;
  let colorCounts = {},
    rgbString = '',
    rgb = [];
  for (let i = 0; i < data.length; i += 4) {
    rgb[0] = data[i];
    rgb[1] = data[i + 1];
    rgb[2] = data[i + 2];
    rgbString = rgb.join(",");

    if (rgb.indexOf(undefined) !== -1 || data[i + 3] === 0) {
      continue;
    }
    if (exclude.indexOf(makeRGB(rgbString)) === -1) {
      if (rgbString in colorCounts) {
        colorCounts[rgbString] = colorCounts[rgbString] + 1;
      }
      else {
        colorCounts[rgbString] = 1;
      }
    }
  }
  let palette = fitPalette(mapPalette(colorCounts), paletteSize + 1);
  // console.log(palette[0].name);
  return colorHex(palette[0].name);
};


// WEBPACK FOOTER //
// ./src/Author/sagas/rgbaster.js