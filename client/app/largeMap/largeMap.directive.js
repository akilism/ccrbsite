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
    var highlightShape = function (evt) {
      console.log('highlight');
      evt.target._path.classList.add('highlighted-path');
      evt.target.bringToFront();
    };

    // Remove highlight on mouseout.
    var removeShapeHighlight = function (evt) {
      console.log('remove');
      evt.target._path.classList.remove('highlighted-path');
    };

    var highlightNeighbors = function (evt) {
      console.log(evt);
      var activeStyle = {
        color: 'rgb(0, 0, 0)',
        weight: 1.25,
        fillColor: 'rgb(128, 0, 0)',
        //fillColor: layer.feature.properties.color,
        fillOpacity: '0.75'
      };

      var inactiveStyle = {
        color: 'rgb(0, 0, 0)',
        weight: 1.25,
        fillColor: 'rgb(0, 0, 128)',
        //fillColor: layer.feature.properties.color,
        fillOpacity: '0.75'
      };

      setNeighbors(evt, activeStyle, inactiveStyle);
    };

    var setNeighbors = function (evt, activeStyle, inactiveStyle) {
      var elemBounds = evt.target.getBounds();

      $scope.precinctGroup.eachLayer(function (layer) {
        var layerBounds = layer.getBounds();
        if (elemBounds.intersects(layerBounds)) {
          layer.setStyle(activeStyle);
        } else {
          layer.setStyle(inactiveStyle);
        }
      });
    };

    // Set event handlers on shapes.
    var setShape = function (feature, layer) {
      layer.on('mousemove', highlightShape);
      layer.on('mouseout', removeShapeHighlight);
      layer.on('click', highlightNeighbors);
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
    $scope.map = $scope.map || L.map(mapId); //.setView([40.7127, -74.0059], 12);

    $scope.precinctGroup = $scope.precinctGroup || L.featureGroup();
    _.forEach($scope.shapes.features, function (shape) {
      var geo = L.geoJson(shape, {
          onEachFeature: mapHelpers.setShape
        });
      $scope.precinctGroup.addLayer(geo);
    });

    var bounds = $scope.precinctGroup.getBounds();

    $scope.precinctGroup.addTo($scope.map);
    $scope.map.setView(bounds.getCenter(), 11);


    var tiles = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}', {
      attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      minZoom: 11,
      maxZoom: 13
    });

    tiles.addTo($scope.map);
  };

  setMap('largeMap');
};
