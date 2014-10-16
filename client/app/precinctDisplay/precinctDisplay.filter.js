'use strict';

angular.module('ccrbsiteApp')
  .filter('precinctDisplay', function () {
    var addOrdinal = function (i) {
      var j = i % 10;
      if (j === 1 && i !== 11 && i !== 111) {
        return i + 'st';
      }
      if (j === 2 && i !== 12 && i !== 112) {
        return i + 'nd';
      }
      if (j === 3 && i !== 13 && i !== 113) {
        return i + 'rd';
      }
      return i + 'th';
    };

    return function (input) {
      var precinct = parseInt(input, 10);
      if(precinct === 14) { return 'Midtown South Precinct'; }
      if(precinct === 18) { return 'Midtown North Precinct'; }
      if(precinct === 22) { return 'Central Park Precinct'; }
      return addOrdinal(precinct) + ' Precinct';
    };
  });
