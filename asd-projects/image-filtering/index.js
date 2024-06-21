// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads.
$(document).ready(function () {
  render($("#display"), image);
  $("#apply").on("click", applyAndRender);
  $("#reset").on("click", resetAndRender);
});

/////////////////////////////////////////////////////////
//////// event handler functions are below here /////////
/////////////////////////////////////////////////////////

// this function resets the image to its original value; do not change this function
function resetAndRender() {
  reset();
  render($("#display"), image);
}

// this function applies the filters to the image and is where you should call
// all of your apply functions
function applyAndRender() {
  // Multiple TODOs: Call your apply function(s) here
  const filter = $('#filters option:selected').val();
  const includeBG = $('#includeBackground option:selected').val();


  if (includeBG === 'true') {
    switch (filter) {
      case 'reddify':
        applyFilter(reddify);
        break;
      case 'decreaseBlue':
        applyFilter(decreaseBlue);
        break;
      case 'increaseGreenByBlue':
        applyFilter(increaseGreenByBlue);
        break;
      case 'smudge':
        smudge();
        break;
    }
  } else {
    switch (filter) {
      case 'reddify':
        applyFilterNoBackground(reddify);
        break;
      case 'decreaseBlue':
        applyFilterNoBackground(decreaseBlue);
        break;
      case 'increaseGreenByBlue':
        applyFilterNoBackground(increaseGreenByBlue);
        break;
      case 'smudge':
        smudgeNoBG();
        break;
    }
  }

  // do not change the below line of code
  render($("#display"), image);
}

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////

// TODO 1, 2 & 4: Create the applyFilter function here
// Applies filter using nested loops by sorting through each index of image, then each index of those values and changing their RGB values
function applyFilter(filterFunction) {
  for (let i = 0; i < image.length; i++) {
    const currentTile = image[i];
    for (let j = 0; j < currentTile.length; j++) {
      let rgbString = currentTile[j];
      let rgbNumbers = rgbStringToArray(rgbString);
      filterFunction(rgbNumbers);
      rgbString = rgbArrayToString(rgbNumbers);
      currentTile[j] = rgbString;
    }
  }
}

// TODO 7: Create the applyFilterNoBackground function
function applyFilterNoBackground(filterFunction) {
  const backgroundColor = image[0][0];
  for (let i = 0; i < image.length; i++) {
    const currentTile = image[i];
    for (let j = 0; j < currentTile.length; j++) {
      let rgbString = currentTile[j];
      if (rgbString !== backgroundColor) {
        let rgbNumbers = rgbStringToArray(rgbString);
        filterFunction(rgbNumbers);
        rgbString = rgbArrayToString(rgbNumbers);
        currentTile[j] = rgbString;
      }
    }
  }
}

// TODO 5: Create the keepInBounds function
// Ensures that numbers used for RGB values are never less than 0 or more than 255
function keepInBounds(colorNum) {
  colorNum = Math.min(colorNum, 255);
  colorNum = Math.max(colorNum, 0);
  return colorNum;
}

// TODO 3: Create reddify function
// Tints the image red by setting red value to 200
function reddify(color) {
  color[RED] = 200;
}

// TODO 6: Create more filter functions
// Decreases the value of blue in the image by 50 to a minimum of 0
function decreaseBlue(color) {
  color[BLUE] = keepInBounds(color[BLUE] - 50);
}

// Increases the value of green in the image by the value of blue to a maximum of 255
function increaseGreenByBlue(color) {
  color[GREEN] = keepInBounds(color[GREEN] + color[BLUE]);
}

// CHALLENGE code goes below here

function smudge() {
  const smudgeDirection = $('#smudgeDirection option:selected').val();
  for (let i = 0; i < image.length; i++) {
    const row = {
      default: image[i],
      down: (i < image.length - 1) ? image[i + 1] : image[i],
    };

    for (let j = 0; j < row.default.length - 1; j++) {
      let pix;
      let altPix;

      // Determine pix & altPix based on direction
      switch (smudgeDirection) {
        case 'left':
          pix = row.default[j + 1];
          altPix = row.default[j];
          break;
        case 'right':
          pix = row.default[j];
          altPix = row.default[j + 1];
          break;
        case 'up':
          pix = row.down[j];
          altPix = row.default[j];
          break;
        case 'down':
          pix = row.default[j];
          altPix = row.down[j];
          break;
      }

      let pixNum = rgbStringToArray(pix);
      let altPixNum = rgbStringToArray(altPix);

      // Smudge in the chosen direction
      switch (smudgeDirection) {
        case 'left':
          for (let x = 0; x < pixNum.length; x++) {
            if (altPixNum[x] >= pixNum[x]) {
              altPixNum[x] -= (Math.abs(altPixNum[x] - pixNum[x]) * 0.1);
            } else {
              altPixNum[x] += (Math.abs(pixNum[x] - altPixNum[x]) * 0.1);
            }
          }
          altPix = rgbArrayToString(altPixNum);
          row.default[j] = altPix;
          break;
        case 'right':
          for (let x = 0; x < pixNum.length; x++) {
            if (altPixNum[x] >= pixNum[x]) {
              altPixNum[x] -= (Math.abs(altPixNum[x] - pixNum[x]) * 0.1);
            } else {
              altPixNum[x] += (Math.abs(pixNum[x] - altPixNum[x]) * 0.1);
            }
          }
          altPix = rgbArrayToString(altPixNum);
          row.default[j + 1] = altPix;
          break;
        case 'up':
          for (let x = 0; x < pixNum.length; x++) {
            if (altPixNum[x] >= pixNum[x]) {
              altPixNum[x] -= (Math.abs(altPixNum[x] - pixNum[x]) * 0.1);
            } else {
              altPixNum[x] += (Math.abs(pixNum[x] - altPixNum[x]) * 0.1);
            }
          }
          altPix = rgbArrayToString(altPixNum);
          row.default[j] = altPix;
          break;
        case 'down':
          for (let x = 0; x < pixNum.length; x++) {
            if (altPixNum[x] >= pixNum[x]) {
              altPixNum[x] -= (Math.abs(altPixNum[x] - pixNum[x]) * 0.1);
            } else {
              altPixNum[x] += (Math.abs(pixNum[x] - altPixNum[x]) * 0.1);
            }
          }
          altPix = rgbArrayToString(altPixNum);
          row.down[j] = altPix;
          break;
      }
    }
  }
}

function smudgeNoBG() {
  const backgroundColor = image[0][0];
  const smudgeDirection = $('#smudgeDirection option:selected').val();
  for (let i = 0; i < image.length; i++) {
    const row = {
      default: image[i],
      down: (i < image.length - 1) ? image[i + 1] : image[i],
    };

    for (let j = 0; j < row.default.length - 1; j++) {
      let pix;
      let altPix;

      // Determine pix & altPix based on direction
      switch (smudgeDirection) {
        case 'left':
          pix = row.default[j + 1];
          altPix = row.default[j];
          break;
        case 'right':
          pix = row.default[j];
          altPix = row.default[j + 1];
          break;
        case 'up':
          pix = row.down[j];
          altPix = row.default[j];
          break;
        case 'down':
          pix = row.default[j];
          altPix = row.down[j];
          break;
      }

      let pixNum = rgbStringToArray(pix);
      let altPixNum = rgbStringToArray(altPix);

      // Smudge in the chosen direction without affecting background tiles
      if (pix !== backgroundColor && altPix !== backgroundColor) {
        switch (smudgeDirection) {
          case 'left':
            for (let x = 0; x < pixNum.length; x++) {
              if (altPixNum[x] >= pixNum[x]) {
                altPixNum[x] -= (Math.abs(altPixNum[x] - pixNum[x]) * 0.1);
              } else {
                altPixNum[x] += (Math.abs(pixNum[x] - altPixNum[x]) * 0.1);
              }
            }
            altPix = rgbArrayToString(altPixNum);
            row.default[j] = altPix;
            break;
          case 'right':
            for (let x = 0; x < pixNum.length; x++) {
              if (altPixNum[x] >= pixNum[x]) {
                altPixNum[x] -= (Math.abs(altPixNum[x] - pixNum[x]) * 0.1);
              } else {
                altPixNum[x] += (Math.abs(pixNum[x] - altPixNum[x]) * 0.1);
              }
            }
            altPix = rgbArrayToString(altPixNum);
            row.default[j + 1] = altPix;
            break;
          case 'up':
            for (let x = 0; x < pixNum.length; x++) {
              if (altPixNum[x] >= pixNum[x]) {
                altPixNum[x] -= (Math.abs(altPixNum[x] - pixNum[x]) * 0.1);
              } else {
                altPixNum[x] += (Math.abs(pixNum[x] - altPixNum[x]) * 0.1);
              }
            }
            altPix = rgbArrayToString(altPixNum);
            row.default[j] = altPix;
            break;
          case 'down':
            for (let x = 0; x < pixNum.length; x++) {
              if (altPixNum[x] >= pixNum[x]) {
                altPixNum[x] -= (Math.abs(altPixNum[x] - pixNum[x]) * 0.1);
              } else {
                altPixNum[x] += (Math.abs(pixNum[x] - altPixNum[x]) * 0.1);
              }
            }
            altPix = rgbArrayToString(altPixNum);
            row.down[j] = altPix;
            break;
        }
      }
    }
  }
}