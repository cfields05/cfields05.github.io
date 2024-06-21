/* IMPORTANT VALUES

This section contains a list of all variables predefined for you to use (that you will need)

The CSS ids you will work with are:

1. bubbleCounter -- the container for the counter text for bubble sort
2. quickCounter  -- the container for the counter text for quick sort

*/

///////////////////////////////////////////////////////////////////////
/////////////////////// YOUR WORK GOES BELOW HERE /////////////////////
///////////////////////////////////////////////////////////////////////

// TODO 2: Implement bubbleSort

// Compares 2 values in an array, and swaps them until they are sorted
async function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 1; j < arr.length; j++) {
            if (arr[j].value < arr[j - 1].value) {
                swap(arr, j, j - 1);

                updateCounter(bubbleCounter);
                await sleep();
            }
        }
    }
}

// TODO 3: Implement quickSort

// Quickly sorts an array by breaking it up into smaller parts and sorting those instead of individually comparing 2 values over and over until everything is sorted
async function quickSort(arr, left, right) {
    if (right - left > 0) {
        let index = await partition(arr, left, right);
        if (left < index - 1) {
            await quickSort(arr, left, index - 1);
        } if (right > index) {
            await quickSort(arr, index, right);
        }
    }
}

// TODOs 4 & 5: Implement partition

// Decides on a pivot and swaps left and right if necessary
async function partition(arr, left, right) {
    const pivot = arr[Math.floor((right + left) / 2)].value;

    // Keeps running as long as left is less than right
    while (left < right) {
        // If left's value is less than the pivot, left needs to be increased
        while (arr[left].value < pivot) {
            left++;
        }
        // If right's value is greater than the pivot, right needs to be decreased
        while (arr[right].value > pivot) {
            right--;
        }
        // If left is still less than right, swap them
        if (left < right) {
            swap(arr, left, right);
            
            updateCounter(quickCounter);
            await sleep();
        }
    }
    
    return left + 1;
}

// TODO 1: Implement swap

// Swaps 2 values in an array
function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;

    drawSwap(arr, i, j);
}

///////////////////////////////////////////////////////////////////////
/////////////////////// YOUR WORK GOES ABOVE HERE /////////////////////
///////////////////////////////////////////////////////////////////////

//////////////////////////// HELPER FUNCTIONS /////////////////////////

// this function makes the program pause by SLEEP_AMOUNT milliseconds whenever it is called
function sleep() {
    return new Promise(resolve => setTimeout(resolve, SLEEP_AMOUNT));
}

// This function draws the swap on the screen
function drawSwap(array, i, j) {
    let element1 = array[i];
    let element2 = array[j];

    let temp = parseFloat($(element1.id).css("top")) + "px";

    $(element1.id).css("top", parseFloat($(element2.id).css("top")) + "px");
    $(element2.id).css("top", temp);
}

// This function updates the specified counter
function updateCounter(counter) {
    $(counter).text("Move Count: " + (parseFloat($(counter).text().replace(/^\D+/g, '')) + 1));
}