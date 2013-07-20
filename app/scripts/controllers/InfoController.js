'use strict';

angular.module('bicycleApp')
.controller('InfoController', function ($scope, $routeParams, bicycleService, $q, $timeout) {

  var deferred = $q.defer();
  var map;
  var ll = new google.maps.LatLng(45.7550586, 4.873918199999935);

    //IMPROVE with localStorage ?
    var dirService= new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });

    map = new google.maps.Map(document.getElementById("map_canvas"));
    directionsDisplay.setMap(map);
    
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

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


  })
;