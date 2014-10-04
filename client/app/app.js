'use strict';

angular.module('ccrbsiteApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ccrbsiteApp.services',
  'ccrbsiteApp.filters',
  'ccrbsiteApp.directives'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });

var directives = angular.module('ccrbsiteApp.directives', []);
var services = angular.module('ccrbsiteApp.services', []);
var filters = angular.module('ccrbsiteApp.filters', []);
