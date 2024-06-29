// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads.
$(document).ready(function () {
  render($("#display"), image);
  $('#smudgeDirection').hide();
  $('#smudgeLabel').hide();
  $("#apply").on("click", applyAndRender);
  $("#reset").on("click", resetAndRender);
  $("#autoApply").on("click", autoApply);
  $("#filters").change(
    function () {
      const filter = $('#filters option:selected').val();
      if (filter === 'smudge') {
        $('#smudgeLabel').fadeIn(500);
        $('#smudgeDirection').fadeIn(500);
      } else {
        $('#smudgeLabel').fadeOut(500);
        $('#smudgeDirection').fadeOut(500);
      }
    }
  )
});

const intervals = [];

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
  const filter = window[$('#filters option:selected').val()];
  const includeBG = $('#includeBackground option:selected').val();
  console.log(filter);

  if (includeBG === 'true') {
    if (filter === 'smudge') {
      smudge();
    } else {
      applyFilter(filter)
    }
  } else {
    if (filter === 'smudge') {
      smudgeNoBG();
    } else {
      applyFilterNoBackground(filter)
    }
  }

  // do not change the below line of code
  render($("#display"), image);
}

// Automatically apply a filter a set number of times dependent on user input
function autoApply() {
  const autoNum = $('#applyNum').val();
  let num = 0;

  const interval = setInterval(
    function () {
      if (num <= autoNum) {
        applyAndRender();
        num++;
      } else {
        clearInterval(interval);
      }
    },
    60
  );
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

// Applies a given filter while excluding the background color
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

// Tints the image blue by setting blue value to 200
function blueify(color) {
  color[BLUE] = 200;
}

// Tints the image green by setting green value to 200
function greenify(color) {
  color[GREEN] = 200;
}

// Decreases the value of blue in the image by 50 to a minimum of 0
function decreaseBlue(color) {
  color[BLUE] = keepInBounds(color[BLUE] - 50);
}

// Increases the value of green in the image by the value of blue to a maximum of 255
function increaseGreenByBlue(color) {
  color[GREEN] = keepInBounds(color[GREEN] + color[BLUE]);
}

// Inverts the colors of the image
// (was originally made by accident when creating smudge filter, though the math is different for the filter than for the original mistake)
function invert(color) {
  color[RED] = 255 - color[RED];
  color[GREEN] = 255 - color[GREEN];
  color[BLUE] = 255 - color[BLUE];
}

// Converts the image to grayscale
function grayscale(color) {
  const ntscGrayscale = 0.299 * color[RED] + 0.587 * color[GREEN] + 0.114 * color[BLUE];
  color[RED] = ntscGrayscale;
  color[GREEN] = ntscGrayscale;
  color[BLUE] = ntscGrayscale;
}

// CHALLENGE code goes below here

// Smudges the image in the chosen direction
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


// Smudges the image without affecting the background
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