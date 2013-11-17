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

	// Set scope to refresh every 50ms as a pseudo-runloop
 	var runLoop = function () {
            if (game.isMaster && ! $scope.lose) {
		    if (Math.random() > 0.1) {
			    game.hitRobotOne(1);
		    }
		    game.damageRobotOne(game.robotOneHits() * 100000);
            }
	    if ($scope.getHealthPercentage() < 0) {
		    $scope.lose = true;
	    }
	    $timeout(runLoop, 50);
            
	};
        game.reset();
	
	runLoop();
	
}]);
