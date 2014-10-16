'use strict';

var _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    Q = require('q');

var readFile = Q.denodeify(fs.readFile);
var dataPath = path.normalize(__dirname);

var precincts = (function (){
  var getFile = function(path) {
    return readFile(path, 'utf-8').then(function (fileContents) {
      return fileContents;
    });
  };

  var getPrecinctId = function (precinct) {
    return 'p' + precinct.replace(' Precinct', '');
  };

  var transformData = function (precinctData) {
    // console.log(precinctData.data);
    _.forEach(precinctData.data, function (precinct) {
      precinct.pid = getPrecinctId(precinct.precinct);
    })

    return precinctData;
  };

  var shapes = function () {
    return getFile(__dirname + '/precinct.geojson');
  };

  var all = function () {
    return getFile(__dirname + '/precinct_data.json')
      .then(function (precinctData) {
        return transformData(JSON.parse(precinctData));
      });
  }

  return {
    shapes:shapes,
    all:all,
    transformData:transformData
  };
})();

exports.index = function(req, res) {
  precincts.all().then(function (precinctData) {
    res.json(precinctData);
  });
};

exports.shapes = function(req, res) {
  precincts.shapes().then(function (shapes) {
    res.json(JSON.parse(shapes));
  });
}
