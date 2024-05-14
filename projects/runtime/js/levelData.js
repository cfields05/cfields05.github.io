var makeLevelData = function (window) {
  window.opspark = window.opspark || {};

  window.opspark.makeDataInGame = function (game) {
    // some useful constants
    var groundY = game.groundY;

    // this data will allow us to define all of the
    // behavior of our game

    // TODO 12: change the below data
    var levelData = [
      {
        name: "Robot Romp",
        number: 1,
        speed: -3,
        gameItems: [
          { type: "sawblade", x: 400, y: groundY },
          { type: "sawblade", x: 800, y: groundY - 110 },
          { type: "sawblade", x: 1200, y: groundY },
          { type: "enemy", x: 600, y: groundY - 50 },
          { type: "enemy", x: 950, y: groundY - 50 },
          { type: "reward", x: 1350, y: groundY - 50 },
          { type: "marker", x: 1600, y: groundY - 50 },
        ],
      },
      {
        name: "Robot Rampage",
        number: 2,
        speed: -3,
        gameItems: [
          { type: "sawblade", x: 350, y: groundY },
          { type: "sawblade", x: 720, y: groundY },
          { type: "sawblade", x: 1400, y: groundY },
          { type: "enemy", x: 500, y: groundY - 60 },
          { type: "enemy", x: 560, y: groundY - 35 },
          { type: "enemy", x: 895, y: groundY - 20 },
          { type: "enemy", x: 965, y: groundY - 50 },
          { type: "enemy", x: 1320, y: groundY - 45 },
          { type: "reward", x: 1520, y: groundY - 50 },
          { type: "reward", x: 1550, y: groundY - 50 },
          { type: "marker", x: 1650, y: groundY - 50 },
        ],
      },
      {
        name: "Robot Rondo",
        number: 3,
        speed: -3,
        gameItems: [
          { type: "sawblade", x: 480, y: groundY - 110 },
          { type: "sawblade", x: 670, y: groundY },
          { type: "sawblade", x: 820, y: groundY - 110 },
          { type: "enemy", x: 360, y: groundY - 35 },
          { type: "enemy", x: 575, y: groundY - 45 },
          { type: "enemy", x: 745, y: groundY - 55 },
          { type: "reward", x: 1200, y: groundY - 40 },
          { type: "reward", x: 1215, y: groundY - 60 },
          { type: "reward", x: 1230, y: groundY - 40 },
          { type: "marker", x: 1500, y: groundY - 50 },
        ],
      },
    ];
    window.opspark.levelData = levelData;
  };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if (
  typeof process !== "undefined" &&
  typeof process.versions.node !== "undefined"
) {
  // here, export any references you need for tests //
  module.exports = makeLevelData;
}