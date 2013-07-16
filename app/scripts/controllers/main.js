'use strict';

angular.module('bicycleApp')
.service('bicycleService', function ($q, $timeout) {

  var dirService= new google.maps.DirectionsService();
  //var directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });
  var routes = [];
  var routesDurationSecond = [];
  var min;

  var addRoute = function(route) {
    routes.push(route);
    routesDurationSecond.push(route.durationSecond);
  };

  var minRoute = function() {
    console.log(Math.min.apply(null, routesDurationSecond));
  }

  this.getBestTransportation = function(from,to) {
    var deferred = $q.defer();

    var request = {
     origin: from, 
     destination: to,
     travelMode: google.maps.DirectionsTravelMode.DRIVING
   };

   dirService.route(request, function(response, status) {
    $timeout(function() {

     if (status == google.maps.DirectionsStatus.OK) {
      var min = Math.min.apply(null, routesDurationSecond);
      console.log(Math.min.apply(null, routesDurationSecond));
      console.log(routes);
    var obj;
    for (var i = 0; i < routes.length; i++) {
        if (routes[i].durationSecond === min) {
            obj = routes[i];
        }
    }
      deferred.resolve(obj.travelmode);

    }
  }, 0);

  });

   return deferred.promise;
 };

  this.getTransportations = function(from,to,travelMode) {
    var deferred = $q.defer();

    var request = {
     origin: from, 
     destination: to,
     travelMode: travelMode
   };

   dirService.route(request, function(response, status) {
    $timeout(function() {

     if (status == google.maps.DirectionsStatus.OK) {
      var route = {};
      route.from = from;
      route.to = to;
      route.duration = response.routes[0].legs[0].duration.text;
      route.distance = response.routes[0].legs[0].distance.text;
      route.durationSecond = response.routes[0].legs[0].duration.value;
 
      route.travelmode = travelMode;
      addRoute(route);

      deferred.resolve([response.routes[0].legs[0].distance.text, response.routes[0].legs[0].duration.text]);

    }



      /*var bestTravelModeClass = 1000000;
         angular.forEach(routes, function(value, key){

      console.log("route " + route.durationSecond);
      console.log("value " + value.durationSecond);
      console.log("travelMode " + travelMode);
        if (route.durationSecond < bestTravelModeClass) {
            bestTravelModeClass = value.duration;
            console.log("best" + bestTravelModeClass);
        }

      });*/
  }, 0);

  });

   return deferred.promise;
 };

// return {
//  getTransportations: getTransportations
//};


    //return myRouteService;
  }) 
.factory('BicycleFactory', function($q, $timeout) {
	//var ll = new google.maps.LatLng(13.0810, 80.2740);
})

.controller('MainCtrl', function ($scope, bicycleService) {
	$scope.transportations = [
 'Voiture',
 'Vélo',
 'A pied',
 'En transports en commun'
 ];


 $scope.searchNavigationGM = function (routesDurationSecond) {
  $scope.walkingValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.WALKING);
  $scope.bicyclingValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.BICYCLING);
  $scope.drivingValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.DRIVING);
  $scope.transitValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.TRANSIT);
  $scope.from = $scope.inputData.from;
  $scope.to = $scope.inputData.to;


   var mins = bicycleService.getBestTransportation($scope.inputData.from, $scope.inputData.to);
   mins.then(function(result) {
        console.log(result);
        switch (result) {
          case "WALKING":
          $scope.InfoCssWalking= true;
          break;
          case "DRIVING":
          $scope.InfoCssDriving= true;
          break;
          case "BICYCLING":
          $scope.InfoCssBicycling= true;
          break;
          case "TRANSIT":
          $scope.InfoCssTransit= true;
          break;
          default:
          $scope.InfoCssDriving= true;
        }
        
    });
  

}; 
})


.controller('InfoController', function ($scope, $routeParams, bicycleService, $q, $timeout) {

    var deferred = $q.defer();
    var map;
    var ll = new google.maps.LatLng(45.7550586, 4.873918199999935);

    var mapOptions = {
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: ll
    };

    //IMPROVE with localStorage ?
    var dirService= new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });

        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("directions"));

        var mode;
        switch ($routeParams.travelMode) {
          case "walking":
          mode= google.maps.TravelMode.WALKING;
          break;
          case "driving":
          mode= google.maps.TravelMode.DRIVING;
          break;
          case "bicycling":
          mode= google.maps.TravelMode.BICYCLING;
          break;
          case "transit":
          mode= google.maps.TravelMode.TRANSIT;
          break;
          default:
          mode= google.maps.TravelMode.WALKING;
        }

        var request = {
          origin: $routeParams.from,
          destination: $routeParams.to,
          travelMode: mode
        };
        dirService.route(request, function(response, status) {
          $timeout(function() {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
              directionsDisplay.setMap(map);
          }

        }, 0);
        });
        return deferred.promise;


    });


