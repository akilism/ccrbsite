'use strict';

var L = L || {};
var directives = directives || {};

directives.directive('largeMap', function () {
    return {
      templateUrl: 'app/largeMap/largeMap.html',
      restrict: 'EA',
      scope: {
        shapes: '=shapes',
        precinctData: '=data'
      },
      controller: directives.largeMap,
      controllerAs: 'largeMap',
      link: function (scope, element, attrs) {
      }
    };
  });

directives.largeMap = function ($scope, precinctDisplayFilter) {

  var mapHelpers = (function() {

    var highlightShape = function (evt) {
      evt.target._path.classList.add('highlighted-path');
      evt.target.bringToFront();
    };

    // Remove highlight on mouseout.
    var removeShapeHighlight = function (evt) {
      evt.target._path.classList.remove('highlighted-path');
    };

    var layerClick = function (evt) {
      highlightNeighbors(evt);
      showPopUp(evt);
      // _.forEach($scope.precinctData.data, function(precinct) {
      //   if(precinct.precinct === evt.target.feature.properties.precinctName) {
      //     console.log(precinct);
      //   }
      // });
    };

    var highlightNeighbors = function (evt) {
      var activeStyle = {
        color: 'rgb(0, 0, 0)',
        weight: 1.25,
        fillColor: 'rgb(128, 0, 0)',
        //fillColor: layer.feature.properties.color,
        fillOpacity: '0.5'
      };

      var inactiveStyle = {
        color: 'rgb(0, 0, 0)',
        weight: 1.25,
        fillColor: 'rgb(0, 0, 128)',
        //fillColor: layer.feature.properties.color,
        fillOpacity: '0.5'
      };

      setNeighbors(evt, activeStyle, inactiveStyle);
    };

    var showPopUp = function (evt) {
      evt.target.openPopup();
    };

    var setNeighbors = function (evt, activeStyle, inactiveStyle) {
      var elemBounds = evt.target.getBounds();
      $scope.neighbors = [];

      $scope.precinctGroup.eachLayer(function (layer) {
        var layerBounds = layer.getBounds();
        if (elemBounds.intersects(layerBounds)) {
          layer.setStyle(activeStyle);
          $scope.neighbors.push(layer);
        } else {
          layer.setStyle(inactiveStyle);
        }
      });
    };

    // Set event handlers on shapes.
    var setShape = function (feature, layer) {
      layer.on('mouseover', highlightShape);
      layer.on('mouseout', removeShapeHighlight);
      layer.on('click', layerClick);
      layer.setStyle({
        color: 'rgb(0, 0, 0)',
        weight: 1.25,
        fillColor: 'rgb(0, 0, 128)',
        //fillColor: layer.feature.properties.color,
        fillOpacity: '0.5'
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
      shape.properties.precinctName = precinctDisplayFilter(shape.properties.policePrecinct);
      shape.data = _.find($scope.precinctData.data, function (precinct) {
        return precinct.precinct === shape.properties.precinctName;
      });
      console.log(shape.data, shape.properties.precinctName);
      var popupContent = '<p class="popup-precinct-name">' + shape.properties.precinctName + '</p>';
      popupContent += '<p class="popup-precinct-total">' + shape.data.total + ' Incidents</p>';
      var geo = L.geoJson(shape, {
          onEachFeature: mapHelpers.setShape
        });
      geo.bindPopup(popupContent);
      $scope.precinctGroup.addLayer(geo);
    });

    var bounds = $scope.precinctGroup.getBounds();

    $scope.precinctGroup.addTo($scope.map);
    $scope.map.setView(bounds.getCenter(), 11);

    // var tiles = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}', {
    //   attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    //   minZoom: 11,
    //   maxZoom: 13
    // });
    var tiles = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      minZoom: 11,
      maxZoom: 15
    });

    tiles.addTo($scope.map);
  };

  setMap('largeMap');
};
