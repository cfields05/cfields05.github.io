var runLevels = function (window) {
  window.opspark = window.opspark || {};

  var draw = window.opspark.draw;
  var createjs = window.createjs;
  let currentLevel = 0;

  window.opspark.runLevelInGame = function (game) {
    // some useful constants
    var groundY = game.groundY;

    // this data will allow us to define all of the
    // behavior of our game
    var levelData = window.opspark.levelData;

    // set this to true or false depending on if you want to see hitzones
    game.setDebugMode(false);

    // TODOs 5 through 11 go here
    // BEGIN EDITING YOUR CODE HERE

    function createSawBlade(x, y) {
      var hitZoneSize = 25;
      var damageFromObstacle = 10;
      var sawBladeHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);

      sawBladeHitZone.x = x;
      sawBladeHitZone.y = y;
      game.addGameItem(sawBladeHitZone);

      var obstacleImage = draw.bitmap("img/sawblade.png");
      obstacleImage.x = -hitZoneSize;
      obstacleImage.y = -hitZoneSize;
      sawBladeHitZone.addChild(obstacleImage);
    }

    function createEnemy(x, y) {
      var enemy = game.createGameItem("enemy", 25);
      var redSquare = draw.rect(50, 50, "red");
      redSquare.x = -25;
      redSquare.y = -25;
      enemy.addChild(redSquare);

      enemy.x = x;
      enemy.y = y;
      enemy.velocityX = -3;
      enemy.rotationalVelocity = -10;

      game.addGameItem(enemy);

      enemy.onPlayerCollision = function () {
        game.changeIntegrity(-10);
      };

      enemy.onProjectileCollision = function () {
        game.increaseScore(100);
        enemy.fadeOut();
      };
    }

    function createReward(x, y) {
      var reward = game.createGameItem("reward", 10);
      var blueCircle = draw.circle(10, "yellow", "darkyellow", 0.75);
      reward.addChild(blueCircle);

      reward.x = x;
      reward.y = y;
      reward.velocityX = -1.85;

      game.addGameItem(reward);

      reward.onPlayerCollision = function () {
        game.increaseScore(100);
        reward.fadeOut();
      };

      reward.onProjectileCollision = function () {
        reward.fadeOut();
      }
    }

    function createMarker(x, y) {
      var marker = game.createGameItem("marker", 20);
      var purpleSquare = draw.rect(40, 40, "purple");
      purpleSquare.x = -20;
      purpleSquare.y = -20;
      marker.addChild(purpleSquare);

      marker.x = x;
      marker.y = y;
      marker.velocityX = -1.75;

      game.addGameItem(marker);

      marker.onPlayerCollision = function () {
        marker.shrink();
        startLevel();
      };

      marker.onProjectileCollision = function () {
        marker.shrink();
        startLevel();
      };
    }


    function startLevel() {
      // TODO 13 goes below here

      var level = levelData[currentLevel];
      var levelObjects = level.gameItems;

      for (var i = 0; i < levelObjects.length; i++) {
        var gameItemObject = levelObjects[i];
        var gameItemX = gameItemObject.x;
        var gameItemY = gameItemObject.y;
        var gameItemType = gameItemObject.type;

        if (gameItemType === "sawblade") {
          createSawBlade(gameItemX, gameItemY);
        } if (gameItemType === "enemy") {
          createEnemy(gameItemX, gameItemY);
        } if (gameItemType === "reward") {
          createReward(gameItemX, gameItemY);
        } if (gameItemType === "marker") {
          createMarker(gameItemX, gameItemY);
        }
      }

      //////////////////////////////////////////////
      // DO NOT EDIT CODE BELOW HERE
      //////////////////////////////////////////////
      if (++currentLevel === levelData.length) {
        startLevel = () => {
          console.log("Congratulations!");
        };
      }
    }
    startLevel();
  };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if (
  typeof process !== "undefined" &&
  typeof process.versions.node !== "undefined"
) {
  // here, export any references you need for tests //
  module.exports = runLevels;
}
