'use strict';

angular.module('ccrbsiteApp')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
          shapes: ['Loader', function(Loader) {
            return Loader('shapes');
          }],
          precinctData: ['Loader', function(Loader) {
            return Loader('precincts');
          }]
        }
      });
  }]);
