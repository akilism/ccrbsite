'use strict';

angular.module('ccrbsiteApp')
  .controller('MainCtrl',['$scope', '$http', 'shapes', function ($scope, $http, shapes) {
    $scope.shapes = shapes;
  }]);
