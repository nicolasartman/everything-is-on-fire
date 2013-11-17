/*global angular*/


angular.module('everythingIsOnFireApp')

.controller('main', ['$scope', 'game', function ($scope, game) {
	'use strict';

	$scope.test = game.getThing();
}]);
