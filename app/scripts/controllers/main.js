'use strict';

angular.module('bicycleApp')
.controller('MainCtrl', function ($scope) {
	$scope.transportations = [
	'Voiture',
	'Vélo',
	'A pied',
	'En transports en commun'
	];

	var ll = new google.maps.LatLng(13.0810, 80.2740);
	var dirService= new google.maps.DirectionsService();

	$scope.mapOptions = {
		center: ll,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};



	$scope.searchNavigationGM = function () {
            //$scope.customers.push({ name: $scope.inputData.name, city: $scope.inputData.city });
            console.log("click");
            var request = {
            	origin: $scope.inputData.from, 
            	destination: $scope.inputData.to,
            	travelMode: google.maps.DirectionsTravelMode.WALKING
            };

            
            dirService.route(request, function(response, status) {
            	            console.log("dirService");
            	if (status == google.maps.DirectionsStatus.OK) {

            	            console.log("response");
			         //directionsDisplay.setDirections(response);
			         $scope.distanceWalking = response.routes[0].legs[0].distance.text;
			         $scope.durationWalking = response.routes[0].legs[0].duration.text;
			                console.log($scope.durationWalking);

			     }
			 });


            var request = {
            	origin: $scope.inputData.from, 
            	destination: $scope.inputData.to,
            	travelMode: google.maps.DirectionsTravelMode.BICYCLING
            };

            dirService.route(request, function(response, status) {
            	if (status == google.maps.DirectionsStatus.OK) {
			         //directionsDisplay.setDirections(response);
			         $scope.distanceBicycling = response.routes[0].legs[0].distance.text;
			         $scope.durationBicycling = response.routes[0].legs[0].duration.text;
			     }
			 });


            var request = {
            	origin: $scope.inputData.from, 
            	destination: $scope.inputData.to,
            	travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            dirService.route(request, function(response, status) {
            	if (status == google.maps.DirectionsStatus.OK) {
			         //directionsDisplay.setDirections(response);
			         $scope.distanceDriving = response.routes[0].legs[0].distance.text;
			         $scope.durationDriving = response.routes[0].legs[0].duration.text;
			     }
			 });
            //console.log(bicycleAppService.query());
        }; 
    });
