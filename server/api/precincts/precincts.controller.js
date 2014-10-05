'use strict';

var _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    q = require('q');

var readFile = q.denodeify(fs.readFile);
var dataPath = path.normalize(__dirname);

var precincts = (function (){
  var getFile = function(path) {
    return readFile(path, 'utf-8').then(function (fileContents) {
      return fileContents;
    });
  };

  var shapes = function () {
    return getFile(__dirname + '/precinct.geojson');
  };

  var all = function () {
    return getFile(__dirname + '/precinct_data.json');
  }

  return {
    shapes:shapes,
    all:all
  };
})();

exports.index = function(req, res) {
  precincts.all().then(function (precinctData) {
    res.json(JSON.parse(precinctData));
  });
};

exports.shapes = function(req, res) {
  precincts.shapes().then(function (shapes) {
    res.json(JSON.parse(shapes));
  });
}
