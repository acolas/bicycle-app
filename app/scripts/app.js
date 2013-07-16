'use strict';

angular.module('bicycleApp', ['ui.map','ui.event'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/info/:travelMode/:from/:to', {
        templateUrl: 'views/info.html',
        controller: 'InfoController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
