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

	$scope.getHealthPercentage = function () {
		return (game.robotOneHealth() / game.maxRobotHealth) * 100;
	}
	
	$scope.getOnFireAmount = function () {
		return game.robotOneHits();
	}

        var actions = [ "reverse polarity", 
                        "invert wave function", 
                        "catalyze hyperaxes",
                        "elevate sprockets",
                        "recalculate lagrange terrain"];

        var components = [ "tachyon grid",
                           "imagination engine",
                           "boson converter",
                           "battle wave reader",
                           "pilot waste disposal"];

	// Set scope to refresh every 50ms as a pseudo-runloop
        var taskInterval = 100;
 	var runLoop = function () {
            if (game.isMaster && ! $scope.lose) {
                    game.incrementTime();

                    var robotOneActions = game.robotOneActions();
                    if(robotOneActions != null) {
                        var actionKeys = Object.keys(robotOneActions);
                        var index;
                        for(index = 0; index < actionKeys.length; index++) {
                            var action = robotOneActions[actionKeys[index]];
                            if(game.time() > action.timeout) {
                                game.removeRobotOneAction(actionKeys[index]);
                                game.hitRobotOne(1);
                            }
                        }
                    }

                    var robotTwoActions = game.robotTwoActions();
                    if(robotTwoActions != null) {
                        var actionKeys = Object.keys(robotTwoActions);
                        var index;
                        for(index = 0; index < actionKeys.length; index++) {
                            var action = robotTwoActions[actionKeys[index]];
                            if(game.time() > action.timeout) {
                                game.removeRobotTwoAction(actionKeys[index]);
                                game.hitRobotTwo(1);
                            }
                        }
                    }

                    if(game.time() % taskInterval == 0) {
                         var action, component;
                         action = actions[Math.floor(Math.random() * actions.length)];
                         component = components[Math.floor(Math.random() * components.length)];
                         game.addRobotOneAction({"action": action, "component": component, "timeout": game.time() + 4 * taskInterval});
                         action = actions[Math.floor(Math.random() * actions.length)];
                         component = components[Math.floor(Math.random() * components.length)];
                         game.addRobotTwoAction({"action": action, "component": component, "timeout": game.time() + 4 * taskInterval});
                    }
                    if(game.time() % 1000 == 0) {
                        taskInterval = Math.floor(taskInterval / 2);
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
