'use strict';

angular.module('everythingIsOnFireApp', [
  'ngCookies',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
