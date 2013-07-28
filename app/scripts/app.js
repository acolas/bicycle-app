'use strict';

angular.module('bicycleApp', ['ui.map','ui.event',
    'waDirectives',
    'waWeatherService',
    'waSessionStore',
    'ngResource'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        activetab:'accueil'
      })
      .when('/info/:travelMode/:from/:to', {
        templateUrl: 'views/info.html',
        controller: 'InfoController'
      })
      .when('/a-propos', {
        templateUrl: 'views/a-propos.html',
        controller: 'EditoController',
        activetab: 'a-propos'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'EditoController',
        activetab:'contact'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function($rootScope, $location){
        $rootScope.menuActive = function(url, exactMatch){

            if (exactMatch){
                return $location.path() == url;
            }
            else {
                return $location.path().indexOf(url) == 0;
            }
        }
    });
