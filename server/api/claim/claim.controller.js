'use strict';

var _ = require('lodash'),
  csv = require('fast-csv'),
    path = require('path'),
    concat = require('concat-stream'),
    fs = require('fs'),
    through = require('through'),
    Q = require('q');

var readFile = Q.denodeify(fs.readFile);
var dataPath = path.normalize(__dirname);


var claims = (function (){
  var coordWrite = function (buffer) {
    var coords = buffer.geometry
      .replace('<Point><coordinates>', '')
      .replace(',0.0</coordinates></Point>', '')
      .split(',');

    var geoJSON = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': coords
      },
      'properties': buffer
    };

    delete geoJSON.properties.geometry;
    this.queue(geoJSON);
  };

  var coordEnd = function () {
    this.queue(null);
  }

  var getFile = function(path) {
    var deferred = Q.defer();

    var tr = through(coordWrite, coordEnd);

    fs.createReadStream(path, 'utf-8')
      .pipe(csv({headers : true}))
      .pipe(tr)
      .pipe(concat(function(data) {
        // console.log(data);
        deferred.resolve(data);
      }));

    return deferred.promise;
  };

  var paid = function () {
    return getFile(__dirname + '/claimstat.csv').then(function (claims) {
      return _.filter(claims, function (claim) {
        return claim.amount !== '';
      })
    });
  };

  var all = function () {
    return getFile(__dirname + '/claimstat.csv');
  }

  return {
    paid:paid,
    all:all
  };
})();

// Get list of claims
exports.index = function(req, res) {
  claims.all().then(function (claims) {
    res.json(claims);
  });
};
