'use strict';

angular.module('bicycleApp')
.factory('BicycleFactory', function($q, $timeout) {
	//var ll = new google.maps.LatLng(13.0810, 80.2740);
})

.controller('MainController', function ($scope, bicycleService, WeatherService) {
	$scope.transportations = [
 'Voiture',
 'Vélo',
 'A pied',
 'En transports en commun'
 ];


  //TODO test input...
 $scope.searchNavigationGM = function (routesDurationSecond) {
  $scope.walkingValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.WALKING);
  $scope.bicyclingValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.BICYCLING);
  $scope.drivingValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.DRIVING);
  $scope.transitValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.TRANSIT);
  $scope.from = $scope.inputData.from;
  $scope.to = $scope.inputData.to;


  var mins = bicycleService.getBestTransportation($scope.inputData.from, $scope.inputData.to);
  mins.then(function(result) {
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

$scope.searchResultFrom = WeatherService.today({ q: $scope.inputData.from });
$scope.searchResultTo = WeatherService.today({ q: $scope.inputData.to });

}; 
})
;



