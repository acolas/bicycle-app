'use strict';

angular.module('bicycleApp')
.factory('BicycleFactory', function($q, $timeout) {



	var ll = new google.maps.LatLng(13.0810, 80.2740);
	var dirService= new google.maps.DirectionsService();

	var mapOptions = {
		center: ll,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

    var getMessages = function(from,to,travelMode) {
      var deferred = $q.defer();

      var request = {
       origin: from, 
       destination: to,
       travelMode: travelMode
   };

   dirService.route(request, function(response, status) {
      $timeout(function() {

       if (status == google.maps.DirectionsStatus.OK) {
           deferred.resolve([response.routes[0].legs[0].distance.text, response.routes[0].legs[0].duration.text]);
       }

   }, 0);
  });
   return deferred.promise;
};

return {
  getMessages: getMessages
};

})

.controller('MainCtrl', function ($scope, BicycleFactory) {
	$scope.transportations = [
        	'Voiture',
        	'Vélo',
        	'A pied',
        	'En transports en commun'
	];



	$scope.searchNavigationGM = function () {

        $scope.walkingValues = BicycleFactory.getMessages($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.WALKING);
        $scope.bicyclingValues = BicycleFactory.getMessages($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.BICYCLING);
        $scope.drivingValues = BicycleFactory.getMessages($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.DRIVING);
        $scope.transitValues = BicycleFactory.getMessages($scope.inputData.from, $scope.inputData.to, google.maps.DirectionsTravelMode.TRANSIT);

    }; 
});
