/*global angular*/


angular.module('everythingIsOnFireApp')

.controller('main',
  ['$scope', 'game', '$timeout',
  function ($scope, game, $timeout) {
  'use strict';

  $scope.lasersCharged = false;
  var onFireAmount = 0;
  $scope.damage = 0;

  $timeout(function () {
    $scope.timeLeftToAct = 5;

    var countdown = window.setInterval(function () {
      $scope.timeLeftToAct -= 1;
      $scope.obstacle = 'cow';

      if ($scope.timeLeftToAct <= 0 || $scope.lasersCharged) {
        window.clearInterval(countdown);
        $scope.obstacle = null;
        $scope.lasersCharged = false;
      }

      $scope.$apply();
    }, 1000);
  }, 2000);

  $scope.chargeLasers = function () {
    $scope.lasersCharged = true;
    if (!$scope.obstacle) {
      $scope.lasersCharged = false;
    }
  }
  
  $scope.resetGame = game.reset;

  $scope.getHealthPercentage = function () {
    return (game.robotOneHealth() / game.maxRobotHealth) * 100;
  };
  
  $scope.getOnFireAmount = function () {
    return game.robotOneHits();
  };
  
  $scope.myRobotNumber = null;
  $scope.chooseRobot = function (robotNumber) {
    $scope.myRobotNumber = robotNumber;
    game.setRobot(robotNumber);
  };

  $scope.actions = [
    "reverse polarity", 
    "invert wave function", 
    "catalyze hyperaxes",
    "elevate sprockets",
    "recalculate lagrange terrain"
  ];

  $scope.components = [
    "tachyon grid",
    "imagination engine",
    "boson converter",
    "battle wave reader",
    "pilot waste disposal"
  ];
  
  $scope.latestAction = null;
  
  var maybeCheckInput = function () {
    if ($scope.selectedAction && $scope.selectedComponent) {
      var success = game.tryInput($scope.selectedAction, $scope.selectedComponent);
      $scope.latestAction = {
        action: $scope.selectedAction,
        component: $scope.selectedComponent,
        failed: !success
      };
      
      $scope.selectedAction = null;
      $scope.selectedComponent = null;
    }
  }
  
  $scope.selectAction = function (action) {
    $scope.selectedAction = action;
    maybeCheckInput();
  }

  $scope.selectComponent = function (component) {
    $scope.selectedComponent = component;
    maybeCheckInput();
  }
  
  $scope.getTasks = function () {
    return game.ownActions();
  }

  var checkActions = function(robotActions, robot) {
    var hits = 0;
    if(robotActions != null) {
      var actionKeys = Object.keys(robotActions);
      var index;
      for(index = 0; index < actionKeys.length; index++) {
        var action = robotActions[actionKeys[index]];
        if(game.time() > action.timeout) {
          game.removeRobotAction(actionKeys[index], robot);
          hits++;
        }
      }
    }
    return hits;
  }
  
  // Set scope to refresh every 50ms as a pseudo-runloop
  var runLoop = function () {
            if (game.isMaster && ! $scope.lose) {
                    game.incrementTime();

                    var robotOneActions = game.robotOneActions();
                    game.hitRobotOne(checkActions(robotOneActions, 1));

                    var robotTwoActions = game.robotTwoActions();
                    game.hitRobotTwo(checkActions(robotTwoActions, 2));

                    if(game.time() % game.interval() == 0) {
                         var action, component;
                         action = $scope.actions[Math.floor(Math.random() * $scope.actions.length)];
                         component = $scope.components[Math.floor(Math.random() * $scope.components.length)];
                         game.addRobotOneAction({"action": action, "component": component, "timeout": game.time() + 4 * game.interval()});
                         action = $scope.actions[Math.floor(Math.random() * $scope.actions.length)];
                         component = $scope.components[Math.floor(Math.random() * $scope.components.length)];
                         game.addRobotTwoAction({"action": action, "component": component, "timeout": game.time() + 4 * game.interval()});
                    }
                    if(game.time() % 1000 == 0) {
                        game.decreaseInterval();
                    }
        //if (Math.random() < 0.1) {
          //game.hitRobotOne(1);
        //}
        game.damageRobotOne(game.robotOneHits() * 10000);
        game.damageRobotTwo(game.robotTwoHits() * 10000);
            }
      if ($scope.getHealthPercentage() < 0) {
                game.endGame();
      }
      $scope.lose = game.gameOver();
      $timeout(runLoop, 50);
            
  };
  game.reset();
  runLoop();
  
}]);
