'use strict';

var directives = directives || {};

directives.directive('claimDisplay', function () {
    return {
      templateUrl: 'app/claimDisplay/claimDisplay.html',
      restrict: 'EA',
      scope: {
        claim: '=data',
      },
      controller: directives.claimDisplay,
      controllerAs: 'claimDisplay',
      link: function (scope, element, attrs) {
      }
    };
  });

directives.claimDisplay = function ($scope) {

  $scope.hideClaimDisplay = function () {
    $('.claim-display').removeClass('show');
  };
};
