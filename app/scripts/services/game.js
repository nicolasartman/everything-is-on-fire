angular.module('everythingIsOnFireApp').factory('game', function () {
	'use strict';
	
	var gameData = {
                        "robotOneHealth": 1000000000,
                        "robotOneHits": 0,
                        "robotOneTasks": [],

                        "robotTwoHealth": 1000000000,
                        "robotTwoHits": 0,
                        "robotTwoTasks": []
                       };
        var self = {};
	
	var root = new Firebase('https://everythingisonfire.firebaseIO.com/');
        var gameOver = root.child('gameOver');
        gameOver.on('value', function(snapshot) {
            gameData['gameOver'] = snapshot.val();
        });
        var interval = root.child('interval');
        interval.on('value', function(snapshot) {
            gameData['interval'] = snapshot.val();
        });
        self.decreaseInterval = function() {
            interval.transaction(function(current) {
                return Math.floor(current / 2);
            });
        };
        self.interval = function() {
            return gameData['interval'];
        }
        var time = root.child('time');
        time.on('value', function(snapshot) {
            gameData['time'] = snapshot.val();
        });
        var master = root.child('master');
        self.isMaster = false;
        master.on('value', function(snapshot) {
            master.transaction(function(state) {
                if(state == 'taken') {
                    console.log("Master position is taken")
                    return 'taken';
                }
                else {
                    self.isMaster = true;
                    console.log("Master")
                    master.onDisconnect().set('free');
                    return 'taken';
                }
            });
        });
            

        var robotOne = root.child('robotOne');
        var robotOneActionQueue = robotOne.child('activeEvents');
        var robotOneHealth = robotOne.child('health');
        var robotOneHits = robotOne.child('hits');

        var robotTwo = root.child('robotTwo');
        var robotTwoActionQueue = robotTwo.child('activeEvents');
        var robotTwoHealth = robotTwo.child('health');
        var robotTwoHits = robotTwo.child('hits');


        self.reset = function() {
            interval.set(100);
            time.set(0);
            gameOver.set(false);

            robotOneHealth.set(1000000000);
            robotOneActionQueue.set(null);
            robotOneHits.set(0);

            robotTwoHealth.set(1000000000);
            robotTwoActionQueue.set(null);
            robotTwoHits.set(0);
        };
        robotOneHealth.on('value', function(snapshot) {
            gameData["robotOneHealth"] = snapshot.val()
        });
        robotOneHits.on('value', function(snapshot) {
            gameData["robotOneHits"] = snapshot.val()
        });
        robotTwoHealth.on('value', function(snapshot) {
            gameData["robotTwoHealth"] = snapshot.val()
        });
        robotTwoHits.on('value', function(snapshot) {
            gameData["robotTwoHits"] = snapshot.val()
        });

	robotOneActionQueue.on('child_removed', function(snapshot) {
            console.log('task removed for robot 1');
            console.log(snapshot.val());
            delete gameData["robotOneTasks"][snapshot.name()];
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
        self.removeRobotOneAction = function(action) {
            robotOneActionQueue.child(action).remove();
        }
        self.robotOneHits = function() {
            return gameData["robotOneHits"];
        }
        self.robotOneActions = function() {
            return gameData["robotOneTasks"];
        }
        self.robotOneHealth = function() {
            return gameData["robotOneHealth"];
        }

        self.hitRobotOne = function(hits) {
            robotOneHits.transaction(function (current) {
		return (current || 0) + hits;
            });
	};
        self.damageRobotOne = function(damage) {
            robotOneHealth.transaction(function (current) {
		return current - damage;
            });
	};

        self.removeRobotAction = function(action, robot) {
            if(robot == 1) {
                robotOneActionQueue.child(action).remove();
            }
            else {
                robotTwoActionQueue.child(action).remove();
            }

        }
	robotTwoActionQueue.on('child_removed', function(snapshot) {
            console.log('task removed for robot 2');
            console.log(snapshot.val());
            delete gameData["robotTwoTasks"][snapshot.name()];
        });
	robotTwoActionQueue.on('child_added', function(snapshot) {
            console.log('New task for robot 2');
            console.log(snapshot.val());
            gameData["robotTwoTasks"][snapshot.name()] = snapshot.val();
        });
        self.addRobotTwoAction = function(action) {
            robotTwoActionQueue.push(action);
        }
        self.removeRobotTwoAction = function(action) {
            robotTwoActionQueue.child(action).remove();
        }
        self.robotTwoHits = function() {
            return gameData["robotTwoHits"];
        }
        self.robotTwoActions = function() {
            return gameData["robotTwoTasks"];
        }
        self.robotTwoHealth = function() {
            return gameData["robotTwoHealth"];
        }
        self.hitRobotTwo = function(hits) {
            robotTwoHits.transaction(function (current) {
		return (current || 0) + hits;
            });
	};
        self.damageRobotTwo = function(damage) {
            robotTwoHealth.transaction(function (current) {
		return current - damage;
            });
	};

        self.incrementTime = function() {
            time.transaction(function(current) {
                return (current || 0) + 1;
            });
        };
        self.time = function() {
            return gameData["time"];
        };
        self.gameOver = function() {
            return gameData['gameOver'];
        };
        self.endGame = function() {
            gameOver.set(true);
        };
        self.robot = function() {
            return gameData['myBot'];
        };
        self.setRobot = function(robot) {
            if(robot == 1) {
                gameData['myBot'] = 1;
                self.otherActions = self.robotTwoActions;
                self.otherHealth = self.robotTwoHealth;
                self.otherHits = self.robotTwoHits;
                self.ownActions = self.robotOneActions;
                self.ownHealth = self.robotOneHealth;
                self.ownHits = self.robotOneHits;
                self.hitOther = self.hitRobotTwo;
                self.hitSelf = self.hitRobotOne;
            }
            else {
                gameData['myBot'] = 2;
                self.ownActions = self.robotTwoActions;
                self.ownHealth = self.robotTwoHealth;
                self.ownHits = self.robotTwoHits;
                self.otherActions = self.robotOneActions;
                self.otherHealth = self.robotOneHealth;
                self.otherHits = self.robotOneHits;
                self.hitOther = self.hitRobotOne;
                self.hitSelf = self.hitRobotTwo;
           }

       };
       self.setRobot(1);
       
	return self;
});
