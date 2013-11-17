/*global angular*/


angular.module('everythingIsOnFireApp')

.controller('main',
	['$scope', 'game', '$timeout',
	function ($scope, game, $timeout) {
	'use strict';
	
	$scope.lasersCharged = false;
	
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
}]);
