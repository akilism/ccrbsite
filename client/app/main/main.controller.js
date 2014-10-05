'use strict';

angular.module('ccrbsiteApp')
  .controller('MainCtrl',['$scope', '$http', 'shapes', 'precinctData', function ($scope, $http, shapes, precinctData) {
    $scope.shapes = shapes;
    $scope.precinctData = precinctData;
  }]);
