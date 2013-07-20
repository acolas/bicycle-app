'use strict';

angular.module('bicycleApp')
.service('bicycleService', function ($q, $timeout) {

  var dirService= new google.maps.DirectionsService();
  var routes = [];
  var routesDurationSecond = [];
  var min;

  var addRoute = function(route) {
    routes.push(route);
    routesDurationSecond.push(route.durationSecond);
  };

  //TODO : doesnt need to call dirService again to seach best transportation...
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
    route.startlocation_longitude = response.routes[0].legs[0].start_location.jb;
    route.startlocation_latitude = response.routes[0].legs[0].start_location.kb;
    route.endlocation_longitude = response.routes[0].legs[0].end_location.jb;
    route.endlocation_latitude = response.routes[0].legs[0].end_location.jb;
    route.travelmode = travelMode;
    addRoute(route);

    deferred.resolve([route.distance, route.duration, route.durationSecond]);

  }

}, 0);

});

 return deferred.promise;
};

}) 