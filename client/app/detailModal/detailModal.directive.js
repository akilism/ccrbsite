'use strict';

var L = L || {};
var directives = directives || {};

directives.directive('detailModal', function () {
    return {
      templateUrl: 'app/detailModal/detailModal.html',
      restrict: 'EA',
      scope: {
        precinctData: '=data',
        selectedYear: '=year'
      },
      controller: directives.detailModal,
      controllerAs: 'detailModal',
      link: function (scope, element, attrs) {
      }
    };
  });

directives.detailModal = function ($scope, precinctDisplayFilter) {
  $scope.sortedData = _.sortBy($scope.precinctData, function (precinct) {
    return precinct[$scope.selectedYear];
  });

  $scope.highlightShape = function (evt, pid) {
    var shape = $('path.' + pid);
    var activeShape = $('.active-shape');
    activeShape.attr('fill-opacity', '0.05').removeClass('active-shape');
    console.log(activeShape);
    shape.addClass('active-shape').attr('fill-opacity', '1');
    // console.log(shape);
  };

  $scope.$watch('precinctData', function(value){
      $scope.sortedData = _.sortBy($scope.precinctData, function (precinct) {
        return precinct[$scope.selectedYear];
      });
  });
};
