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


  $scope.searchNavigationGM = function (routesDurationSecond) {
    $scope.walkingValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.WALKING);
    var bicycling = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.BICYCLING);
    bicycling.then(function(result){
      var distanceBicycling = result;
      $scope.bicyclingValues = result;


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

    var bicycleWeatherFrom = true;
    var meteoFrom = WeatherService.today({ q: $scope.inputData.from }, function() {
      if (meteoFrom.weather[0].icon == "09d" || meteoFrom.weather[0].icon == "10d" || meteoFrom.weather[0].icon == "11d" || meteoFrom.weather[0].icon == "13d" ) {
        bicycleWeatherFrom = false;
      }
      console.log
      if (distanceBicycling.slice(2) / 3600 > 0.5 || bicycleWeatherFrom == false){
        $scope.resultat = "NON :-("; 
      } else {
        $scope.resultat = "OUI :^D"; 
      }
    });
    $scope.searchResultFrom = meteoFrom;

    var bicycleWeatherTo = true;
    var meteoTo = WeatherService.today({ q: $scope.inputData.to }, function() {
      if (meteoTo.weather[0].icon == "09d" || meteoTo.weather[0].icon == "10d" || meteoTo.weather[0].icon == "11d" || meteoTo.weather[0].icon == "13d" ) {
        bicycleWeatherTo = false;
      }
      if (distanceBicycling.slice(2) / 3600 > 0.5 || bicycleWeatherTo == false){
        $scope.resultat = "NON :-("; 
      } else {
        $scope.resultat = "OUI :^D"; 
      }
    });
    $scope.searchResultTo = meteoTo; 

  });

}); 
$scope.drivingValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.DRIVING);
$scope.transitValues = bicycleService.getTransportations($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.TRANSIT);
$scope.from = $scope.inputData.from;
$scope.to = $scope.inputData.to;


}; 
})
;



