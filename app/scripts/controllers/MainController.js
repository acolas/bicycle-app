'use strict';

angular.module('bicycleApp')
.factory('BicycleFactory', function($q, $timeout) {
	//var ll = new google.maps.LatLng(13.0810, 80.2740);
})

.controller('MainController', function ($scope, bicycleService, WeatherService) {

  init();

  function init() {
    $scope.transportations = [
    'Voiture',
    'Vélo',
    'A pied',
    'En transports en commun'
    ];

    var options = {
        types: [],
        componentRestrictions: {country: 'fr'}
    };

    //var inputFrom = (document.getElementById('searchTextFieldFrom'));

var inputFrom = document.getElementById('searchTextFieldFrom');

(function pacSelectFirst(input){
    // store the original event binding function
    var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

    function addEventListenerWrapper(type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.

    if (type == "keydown") {
      var orig_listener = listener;
      listener = function (event) {
        var suggestion_selected = $(".pac-item.pac-selected").length > 0;
        if ((event.which == 13 || event.which == 9) && !suggestion_selected) {
          var simulated_downarrow = $.Event("keydown", {keyCode:40, which:40})
          orig_listener.apply(input, [simulated_downarrow]);
        }

        orig_listener.apply(input, [event]);
      };
    }

    // add the modified listener
    _addEventListener.apply(input, [type, listener]);
  }

  if (input.addEventListener)
    input.addEventListener = addEventListenerWrapper;
  else if (input.attachEvent)
    input.attachEvent = addEventListenerWrapper;

})(inputFrom);

    var inputTo = (document.getElementById('searchTextFieldTo'));


(function pacSelectFirst(input){
    // store the original event binding function
    var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

    function addEventListenerWrapper(type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.

    if (type == "keydown") {
      var orig_listener = listener;
      listener = function (event) {
        var suggestion_selected = $(".pac-item.pac-selected").length > 0;
        if ((event.which == 13 || event.which == 9) && !suggestion_selected) {
          var simulated_downarrow = $.Event("keydown", {keyCode:40, which:40})
          orig_listener.apply(input, [simulated_downarrow]);
        }

        orig_listener.apply(input, [event]);
      };
    }

    // add the modified listener
    _addEventListener.apply(input, [type, listener]);
  }

  if (input.addEventListener)
    input.addEventListener = addEventListenerWrapper;
  else if (input.attachEvent)
    input.attachEvent = addEventListenerWrapper;

})(inputTo);

    var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
    var autocompleteTo = new google.maps.places.Autocomplete(inputTo, options);

    var infowindowFrom = new google.maps.InfoWindow();
    var infowindowTo = new google.maps.InfoWindow();

    google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
      infowindowFrom.close();
      inputFrom.className = '';
      var placeFrom = autocompleteFrom.getPlace();
      if (!placeFrom.geometry) {
      // Inform the user that the place was not found and return.
      inputFrom.className = 'notfound';
      return;
    }

    var addressFrom = '';
    if (placeFrom.address_components) {
      addressFrom = [
      (placeFrom.address_components[0] && placeFrom.address_components[0].short_name || ''),
      (placeFrom.address_components[1] && placeFrom.address_components[1].short_name || ''),
      (placeFrom.address_components[2] && placeFrom.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowFrom.setContent('<div><strong>' + placeFrom.name + '</strong><br>' + addressFrom);
    $scope.FROM =  placeFrom.formatted_address;
    $scope.FromLat = placeFrom.geometry.location.jb;
    $scope.FromLong = placeFrom.geometry.location.kb;
  });


    google.maps.event.addListener(autocompleteTo, 'place_changed', function() {
      infowindowTo.close();
      inputTo.className = '';
      var placeTo = autocompleteTo.getPlace();
      if (!placeTo.geometry) {
      // Inform the user that the place was not found and return.
      inputTo.className = 'notfound';
      return;
    }
    var addressTo = '';
    if (placeTo.address_components) {
      addressTo = [
      (placeTo.address_components[0] && placeTo.address_components[0].short_name || ''),
      (placeTo.address_components[1] && placeTo.address_components[1].short_name || ''),
      (placeTo.address_components[2] && placeTo.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowTo.setContent('<div><strong>' + placeTo.name + '</strong><br>' + addressTo);
    $scope.TO =  placeTo.formatted_address;
    $scope.ToLat = placeTo.geometry.location.jb;
    $scope.ToLong = placeTo.geometry.location.kb;
  });

  }


  $scope.searchNavigationGM = function (routesDurationSecond) {

    //if user doesn't use autocomplete
    if ($scope.FROM == undefined){
      $scope.FROM = $scope.inputData.from;
    }
    if ($scope.TO == undefined){
      $scope.TO = $scope.inputData.to;
    }

    $scope.walkingValues = bicycleService.getTransportations($scope.FROM, $scope.TO, google.maps.DirectionsTravelMode.WALKING);
    var bicycling = bicycleService.getTransportations($scope.FROM, $scope.TO, google.maps.DirectionsTravelMode.BICYCLING);
    bicycling.then(function(result){
      var distanceBicycling = result;
      $scope.bicyclingValues = result;


      var mins = bicycleService.getBestTransportation($scope.FROM, $scope.TO);
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
        var queryFrom = {lat: $scope.FromLat, lon: $scope.FromLong} ;
        if(queryFrom.lat == undefined || queryFrom.lon == undefined){
            queryFrom = {q: $scope.inputData.from};
        }
        var meteoFrom = WeatherService.today(queryFrom, function() {
          if (meteoFrom.weather[0].icon == "09d" || meteoFrom.weather[0].icon == "10d" || meteoFrom.weather[0].icon == "11d" || meteoFrom.weather[0].icon == "13d" ) {
            bicycleWeatherFrom = false;
          }
          if (distanceBicycling.slice(2) / 3600 > 0.5 || bicycleWeatherFrom == false){
            $scope.resultat = "NON :-(";             
            $scope.InfoCssBicycling= false;
          } else {
            $scope.resultat = "OUI :^D"; 
            $scope.InfoCssBicycling= true;
            $scope.InfoCssWalking= false;
            $scope.InfoCssDriving= false;
          }
        });
        $scope.searchResultFrom = meteoFrom;

        var bicycleWeatherTo = true;
        var queryTo = {lat: $scope.ToLat, lon: $scope.ToLong} ;
        if(queryTo.lat == undefined || queryTo.lon == undefined){
            queryTo = {q: $scope.inputData.to};
        }
        var meteoTo = WeatherService.today(queryTo, function() {
          if (meteoTo.weather[0].icon == "09d" || meteoTo.weather[0].icon == "10d" || meteoTo.weather[0].icon == "11d" || meteoTo.weather[0].icon == "13d" ) {
            bicycleWeatherTo = false;
          }
          if (distanceBicycling.slice(2) / 3600 > 0.5 || bicycleWeatherTo == false){
            $scope.resultat = "NON :-(";               
            $scope.InfoCssBicycling= false;
          } else {
            $scope.resultat = "OUI :^D"; 
            $scope.InfoCssBicycling= true;
            $scope.InfoCssWalking= false;
            $scope.InfoCssDriving= false;

          }
        });
        $scope.searchResultTo = meteoTo; 

      });

}); 
$scope.drivingValues = bicycleService.getTransportations($scope.FROM, $scope.TO, google.maps.DirectionsTravelMode.DRIVING);
$scope.transitValues = bicycleService.getTransportations($scope.FROM, $scope.TO, google.maps.DirectionsTravelMode.TRANSIT);



}; 
})
;



