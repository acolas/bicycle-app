'use strict';

angular.module('bicycleApp')
  .controller('MainCtrl', function ($scope) {
    $scope.transportations = [
      'Voiture',
      'Vélo',
      'A pied',
      'En transports en commun'
    ];
  });
