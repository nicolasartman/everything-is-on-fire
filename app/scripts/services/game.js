angular.module('everythingIsOnFireApp').factory('game', function () {
	'use strict';
	
	var gameData = {
                        "robotOneHealth": 1000000000,
                        "robotOneHits": 0,
                        "robotOneTasks": {},

                        "robotTwoHealth": 1000000000,
                        "robotTwoHits": 0,
                        "robotTwoTasks": {}
                       };
        var self = {};
	
	var root = new Firebase('https://everythingisonfire.firebaseIO.com/');
        var robotOne = root.child('robotOne');
        var robotOneActionQueue = robotOne.child('activeEvents');
        var robotOneHealth = robotOne.child('health');
        var robotOneHits = robotOne.child('hits');

        var robotTwo = root.child('robotTwo');
        var robotTwoActionQueue = robotTwo.child('activeEvents');
        var robotTwoHealth = robotTwo.child('health');
        var robotTwoHits = robotTwo.child('hits');

        self.reset = function() {
            robotOneHealth.set(1000000000);
            robotOneActionQueue.set(null);
            robotOneHits.set(0);

            robotTwoHealth.set(1000000000);
            robotTwoActionQueue.set(null);
            robotTwoHits.set(0);
        };

	robotOneActionQueue.on('child_removed', function(snapshot) {
            console.log('task removed for robot 1');
            console.log(snapshot.val());
            gameData["robotOneTasks"][snapshot.name()] = snapshot.val();
        });
	robotOneActionQueue.on('child_added', function(snapshot) {
            console.log('New task for robot 1');
            console.log(snapshot.val());
            gameData["robotOneTasks"][snapshot.name()] = snapshot.val();
        });

				self.maxRobotHealth = 1000000000;

        self.addRobotOneAction = function(action) {
            robotOneActionQueue.push(action);
        }
        self.robotOneHits = function() {
            return gameData["robotOneHits"];
        }
        self.robotOneActions = function() {
            return gameData["robotOneActions"];
        }
        self.robotOneHealth = function() {
            return gameData["robotOneHealth"];
        }

        self.hitRobotOne = function(hits) {
            robotOneHits.transaction(function (current) {
		return (current || 0) + hits;
            });
	};

	robotOneActionQueue.on('child_removed', function(snapshot) {
            console.log('task removed for robot 1');
            console.log(snapshot.val());
            gameData["robotTwoTasks"][snapshot.name()] = snapshot.val();
        });
	robotTwoActionQueue.on('child_added', function(snapshot) {
            console.log('New task for robot 2');
            console.log(snapshot.val());
            gameData["robotTwoTasks"].push(snapshot.val());
        });
        self.addRobotTwoAction = function(action) {
            robotTwoActionQueue.push(action);
        }
        self.robotTwoHits = function() {
            return gameData["robotTwoHits"];
        }
        self.robotTwoActions = function() {
            return gameData["robotTwoActions"];
        }
        self.robotTwoHealth = function() {
            return gameData["robotTwoHealth"];
        }
        self.hitRobotTwo = function(hits) {
            robotTwoHits.transaction(function (current) {
		return (current || 0) + hits;
            });
	};

	return self;
});
