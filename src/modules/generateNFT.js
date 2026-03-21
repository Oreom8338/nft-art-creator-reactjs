const generateNFT = async (
  images,
  w,
  h,
  m,
  collectionSize,
  setSplitedResult = () => {},
  setResult = () => {}
) => {
  let imageArrays = [];
  // setting up the rarity
  let percentage = 5 / 100;
  let rarityOfTheImage = collectionSize * percentage;
  console.log("images⚠🙄", images);
  for (let i = 0; i < images.data.length; i++) {
    let layerArray = [];
    for (let j = 0; j < images.data[i].files.length; j++) {
      layerArray.push(images.data[i].files[j]);
    }
    if (images.data[i].files.length) imageArrays.push(layerArray);
  }

  console.log(imageArrays);

  let result = await createAllCombinations(imageArrays, collectionSize);
  console.log("result 😏", result);

  let nft = await createCanvas(result, w, h, m);
  setResult(nft);
  setSplitedResult(result);

  console.log("nft in  generateNFT", nft);
  return nft;
};

async function createCanvas(result, w, h, m) {
  let nft = [];

  // Set the canvas size to the specified dimensions
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext("2d");

  if (m == "image/png") {
    ctx.fillStyle = "rgba(255, 255, 255, 0)"; // Transparent for PNG
  } else {
    ctx.fillStyle = "#ffffff";
  }
  ctx.fillRect(0, 0, w, h);

  for (var i = 0; i < result.length; i++) {
    // Ensure the canvas is clear for each NFT generation
    ctx.clearRect(0, 0, w, h);
    if (m !== "image/png") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }

    for (var j = 0; j < result[i].length; j++) {
      await loadImageAndResize(ctx, result[i][j].src, w, h);
    }
    // Generate the image based on the specified mime type
    let dataURL = canvas.toDataURL(m);
    nft.push({ original: dataURL, thumbnail: dataURL });
  }
  console.log("nft in  createCanvas", nft);
  return nft;
}

async function loadImageAndResize(ctx, src, width, height) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = src;
    img.onload = () => {
      // Draw the image on the canvas, resized to the specified width and height
      ctx.drawImage(img, 0, 0, width, height);
      resolve();
    };
  });
}

// Modified loadImage to use image's natural dimensions
async function loadImage(ctx, src, canvas) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      resolve();
    };
  });
}

/****/

async function createAllCombinations(arrays, collectionSize) {
  let results = new Set();

  // let weightedArrays = arrays.map((layer) =>
  //   layer.flatMap((image) => Array(Math.round(100 / image.rarity)).fill(image))
  // );

// gi


let weightedArrays = arrays.map(layer =>
  layer.flatMap(image => Array(image.rarity).fill(image))
);

  while (results.size < collectionSize) {
    let combination = weightedArrays.map((array) => {
      return array.length > 0
        ? array[Math.floor(Math.random() * array.length)]
        : null;
    });

    let combinationKey = JSON.stringify(combination);
    results.add(combinationKey);
  }

  return Array.from(results).map((item) => JSON.parse(item));
  // return results;
}

/****/

export { generateNFT };
