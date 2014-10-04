'use strict';

var _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    q = require('q');

var readFile = q.denodeify(fs.readFile);
var dataPath = path.normalize(__dirname);

var precincts = (function (){

  var shapes = function () {
    var path = __dirname + '/precinct.geojson';
    return readFile(path, 'utf-8').then(function (fileContents) {
      return JSON.parse(fileContents);
    });
  };

  return {
    shapes:shapes
  };
})();

// Get list of precinctss
exports.index = function(req, res) {
  res.json([]);
};

exports.shapes = function(req, res) {
  precincts.shapes().then(function (shapes) {
    res.json(shapes);
  });
}
