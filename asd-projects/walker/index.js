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
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
  }

  // Holds constant values for each of the 4 walls
  const WALLS = {
    LEFT: 0,
    RIGHT: $('#board').width(),
    TOP: 0,
    BOTTOM: $('#board').height(),
  }

  // WALKER object holds data for the walker (x-position, y-position, speed along x-axis, speed along y-axis, id attribute, width, and height)
  const WALKER = {
    x: 50,
    y: 50,
    speedX: 0,
    speedY: 0,
    id: '#walker',
    width: $('#walker').width(),
    height: $('#walker').height(),
    isIt: false,
    defaultColor: 'teal',
  }


  // WALKER2 object holds data for the 2nd walker (x-position, y-position, speed along x-axis, speed along y-axis, id attribute, width, and height)
  const WALKER2 = {
    x: WALLS.RIGHT - 100,
    y: WALLS.BOTTOM - 100,
    speedX: 0,
    speedY: 0,
    id: '#walker2',
    width: $('#walker2').width(),
    height: $('#walker2').height(),
    isIt: false,
    defaultColor: 'blueviolet',
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
  decideIt();

  function newFrame() {
    runAll(WALKER);
    runAll(WALKER2);
  }

  // Handles keys being pressed at any time and adjusts speed if appropriate keys are pressed
  function handleKeyDown(event) {
    // Handles key input for player 1 (WALKER recognizes W, A, S, and D)
    switch (event.which) {
      case KEY.A:
        WALKER.speedX = WALKER.isIt ? -4 : -5;
        break;
      case KEY.D:
        WALKER.speedX = WALKER.isIt ? 4 : 5;
        break;
      case KEY.W:
        WALKER.speedY = WALKER.isIt ? -4 : -5;
        break;
      case KEY.S:
        WALKER.speedY = WALKER.isIt ? 4 : 5;
        break;
    }


    // Handles key input for player 2 (WALKER2 recognizes LEFT, RIGHT, UP, and DOWN)
    switch (event.which) {
      case KEY.LEFT:
        WALKER2.speedX = WALKER2.isIt ? -4 : -5;
        break;
      case KEY.RIGHT:
        WALKER2.speedX = WALKER2.isIt ? 4 : 5;
        break;
      case KEY.UP:
        WALKER2.speedY = WALKER2.isIt ? -4 : -5;
        break;
      case KEY.DOWN:
        WALKER2.speedY = WALKER2.isIt ? 4 : 5;
        break;
    }
  }

  // Handles keys being released for both players and resets respective speed values to 0 when directional key is let go
  function handleKeyUp(event) {
    // Player 1 key release
    switch (event.which) {
      case KEY.A:
      case KEY.D:
        WALKER.speedX = 0;
        break;
      case KEY.W:
      case KEY.S:
        WALKER.speedY = 0;
        break;
    }

    // Player 2 key release;
    switch (event.which) {
      case KEY.LEFT:
      case KEY.RIGHT:
        WALKER2.speedX = 0;
        break;
      case KEY.UP:
      case KEY.DOWN:
        WALKER2.speedY = 0;
        break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Runs all 3 functions for rendering and moving the walker as well as wall collisions
  function runAll(walker) {
    repositionGameItem(walker);
    handleWallCollision(walker);
    handleIt(walker);
    handleTag(WALKER, WALKER2);
    redrawGameItem(walker);
  }

  // Handles positioning of walker
  function repositionGameItem(walker) {
    walker.x += walker.speedX;
    walker.y += walker.speedY;
  }

  // Handles visible movement of walker
  function redrawGameItem(walker) {
    $(walker.id).css({ 'left': walker.x, 'top': walker.y });
  }

  // Handles player collision with walls
  function handleWallCollision(walker) {
    if (walker.x < WALLS.LEFT || (walker.x + walker.width) > WALLS.RIGHT) {
      walker.x -= walker.speedX;
    } if (walker.y < WALLS.TOP || (walker.y + walker.height) > WALLS.BOTTOM) {
      walker.y -= walker.speedY;
    }
  }

  // Randomly decides which player is "it" at the start of the game
  function decideIt() {
    const randomNum = Math.random();
    if (randomNum < 0.5) {
      WALKER.isIt = true;
    } else {
      WALKER2.isIt = true;
    }
  }

  // Changes color to red if player is "it" or resets it to its default color if not
  function handleIt(walker) {
    if (walker.isIt) {
      $(walker.id).css('background-color', 'red');
      $('#it').text(walker.defaultColor + " square is it!")
    } else {
      $(walker.id).css('background-color', walker.defaultColor);
    }
  }

  // Handles collisions between the square and switches "it" square if they touch
  function handleTag(w1, w2) {
    if (w1.x < (w2.x + w2.width) && (w1.x + w1.width) > w2.x && w1.y < (w2.y + w2.height) && (w1.y + w1.height) > w2.y) {
      if (w1.isIt) {
        w1.isIt = false;
        w2.isIt = true;
      } else {
        w1.isIt = true;
        w2.isIt = false;
      }
      resetPos();
    }
  }

  // Resets the positions of the squares when tagged
  function resetPos() {
    WALKER.x = 50;
    WALKER.y = 50;
    WALKER2.x = WALLS.RIGHT - 100;
    WALKER2.y = WALLS.BOTTOM - 100;
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

}
