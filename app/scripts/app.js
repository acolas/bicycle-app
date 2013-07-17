'use strict';

angular.module('bicycleApp', ['ui.map','ui.event',
    'waDirectives',
    'waWeatherService',
    'waSessionStore',
    'ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/info/:travelMode/:from/:to', {
        templateUrl: 'views/info.html',
        controller: 'InfoController'
      })
      .when('/a-propos', {
        templateUrl: 'views/a-propos.html',
        controller: 'TodayController',
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'EditoController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
