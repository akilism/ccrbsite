'use strict';

var L = L || {};
var directives = directives || {};

directives.directive('largeMap', function () {
    return {
      templateUrl: 'app/largeMap/largeMap.html',
      restrict: 'EA',
      scope: {
        shapes: '=shapes'
      },
      controller: directives.largeMap,
      controllerAs: 'largeMap',
      link: function (scope, element, attrs) {
      }
    };
  });

directives.largeMap = function ($scope, $element, $attrs, $http) {

  var mapHelpers = (function() {
    var highlightShape = function (elem) {
      elem.classList.add('highlighted-path');
    };

    // Remove highlight on mouseout.
    var removeShapeHighlight = function (elem) {
      elem.classList.remove('highlighted-path');
    };

    // Set event handlers on shapes.
    var setShape = function (feature, layer) {
      layer.on('mouseover', highlightShape);
      layer.on('mouseout', removeShapeHighlight);
      layer.setStyle({
        color: 'rgb(0, 0, 0)',
        weight: 1.25,
        fillColor: 'rgb(0, 0, 128)',
        //fillColor: layer.feature.properties.color,
        fillOpacity: '0.75'
      });
    };

    return {
      highlightShape:highlightShape,
      removeShapeHighlight:removeShapeHighlight,
      setShape:setShape
    };
  })();



  var setMap = function (mapId) {
    var map = L.map(mapId); //.setView([40.7127, -74.0059], 12);

    var precinctGroup = L.featureGroup();
    _.forEach($scope.shapes.features, function (shape) {
      var geo = L.geoJson(shape, {
          onEachFeature: mapHelpers.setShape
        });
      precinctGroup.addLayer(geo);
    });

    var bounds = precinctGroup.getBounds();

    precinctGroup.addTo(map);
    map.setView(bounds.getCenter(), 11);


    var tiles = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}', {
      attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      minZoom: 11,
      maxZoom: 13
    });

    tiles.addTo(map);
  };

  setMap('largeMap');
};
