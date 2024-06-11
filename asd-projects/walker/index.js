/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  // Game Item Objects

  // KEY object holds key codes that the program will respond to when pressed
  const KEY = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
  }

  // WALKER object holds data for the walker (x-position, y-position, speed along x-axis, speed along y-axis)
  const WALKER = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
  }

  // one-time setup
  const interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                             // event handler to listen for when a key is pressed and run handleKeyDown()
  $(document).on('keyup', handleKeyUp);                                 // event handler to listen for when a key is released and run handleKeyUp()

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    repositionGameItem(WALKER);

  }

  // Handles keys being pressed at any time and adjusts speed if key pressed is left, right, up, or down
  function handleKeyDown(event) {
    switch (event.which) {
      case KEY.LEFT:
        WALKER.speedX = -5;
        break;
      case KEY.RIGHT:
        WALKER.speedX = 5;
        break;
      case KEY.UP:
        WALKER.speedY = -5;
        break;
      case KEY.DOWN:
        WALKER.speedY = 5;
        break;
    }
  }

  // Handles keys being released and resets respective speed values to 0 when directional key is let go
  function handleKeyUp(event) {
    switch (event.which) {
      case KEY.LEFT:
      case KEY.RIGHT:
        WALKER.speedX = 0;
        break;
      case KEY.UP:
      case KEY.DOWN:
        WALKER.speedY = 0;
        break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  function repositionGameItem(walker) {
    walker.x += walker.speedX;
    walker.y += walker.speedY;
    redrawGameItem(walker);
  }

  function redrawGameItem(walker) {
    $('#walker').css({ 'left': walker.x, 'top': walker.y });
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

}
