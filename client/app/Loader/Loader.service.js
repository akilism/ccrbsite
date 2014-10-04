'use strict';

var services = angular.module('ccrbsiteApp.services', ['ngResource']);

services.factory('Loader', ['$http', '$q', function ($http, $q) {

  var getPath = function (requestedData) {
    if(requestedData === 'shapes') {
      return '/api/precincts/shapes';
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
