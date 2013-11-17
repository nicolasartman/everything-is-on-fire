angular.module('everythingIsOnFireApp').factory('game', function () {
	'use strict';
	
	var gameData = {}, self = {};
	
	var root = new Firebase('https://everythingisonfire.firebaseIO.com/');
	
	// Whenever the page loads, bump the test value
	var testRef = root.child('test');
	testRef.transaction(function (current) {
		return (current || 0) + 1;
	});
	
	
	// Expose state getters here
	
	self.getThing = function () {
		return gameData.thing;
	}
	
	return self;
});