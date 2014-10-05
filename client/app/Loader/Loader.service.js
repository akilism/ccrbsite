'use strict';

var services = angular.module('ccrbsiteApp.services', ['ngResource']);

services.factory('Loader', ['$http', '$q', function ($http, $q) {

  var getPath = function (requestedData) {
    switch(requestedData) {
      case 'shapes':
        return '/api/precincts/shapes';
      case 'precincts':
        return '/api/precincts/';
      default:
        return '';
    }
  };

  return function (requestedData) {
    var deferred = $q.defer();
    var apiPath = getPath(requestedData);

    var getDefer = function () { $http.get(apiPath).success(function(data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    };

    return getDefer();
  };
}]);
