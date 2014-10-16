'use strict';

var L = L || {};
var d3 = d3 || {};
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

directives.largeMap = function ($scope, precinctDisplayFilter, Loader) {
  $scope.selectedPrecincts = [];
  $scope.selectedClaim = [];
  $scope.selectedYear = '2013';

  var mapHelpers = (function() {
    var defaultStyle = {
      color: 'rgb(0, 0, 0)',
      weight: 1.25,
      fillOpacity: '0.75'
    };

    var highlightShape = function (evt) {
      evt.target._path.classList.add('highlighted-shape');
      // evt.target.bringToFront();
      // $scope.claimGroup.bringToFront();
    };

    // Remove highlight on mouseout.
    var removeShapeHighlight = function (evt) {
      evt.target._path.classList.remove('highlighted-shape');
    };

    var layerClick = function (evt) {
      highlightNeighbors(evt);
      showPopUp(evt);
      if(evt.target.feature.onclick) {
        evt.target.feature.onclick();
      }
      $('#largeMap').on('click', windowClick);
    };

    var highlightNeighbors = function (evt) {
      var activeStyle = {
        color: 'rgb(0, 0, 0)',
        weight: 1.25,
        fillOpacity: '0.85'
      };

      var inactiveStyle = {
        color: 'rgb(0, 0, 0)',
        weight: 1.25,
        fillOpacity: '0.25'
      };

      setNeighbors(evt, activeStyle, inactiveStyle);
    };

    var showPopUp = function (evt) {
      evt.target.openPopup();
      $('#detailModal').addClass('full-view');
    };

    var setNeighbors = function (evt, activeStyle, inactiveStyle) {
      var elemBounds = evt.target.getBounds();
      $scope.neighbors = {};

      $scope.precinctGroup.eachLayer(function (layer) {
        var layerBounds = layer.getBounds();
        if (elemBounds.intersects(layerBounds)) {
          layer.setStyle(activeStyle);
          $scope.neighbors[layer._leaflet_id - 1] = layer;
        } else {
          layer.setStyle(inactiveStyle);
        }
      });
    };

    var resetStyle = function (style) {
      style = style || defaultStyle;
      $scope.precinctGroup.eachLayer(function (layer) {
        layer.setStyle(style);
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
        // fillColor: 'rgb(0, 0, 128)',
        fillColor: layer.feature.data.color,
        fillOpacity: '0.65',
        className: feature.data.pid
      });
    };

    return {
      highlightShape:highlightShape,
      removeShapeHighlight:removeShapeHighlight,
      setShape:setShape,
      resetStyle:resetStyle
    };
  })();

  var precinctClick = function () {
    $scope.selectedPrecincts = _.unique(_.map($scope.neighbors, function(neighbor) {
      return neighbor._layers[neighbor._leaflet_id - 1].feature.data;
    }), function (precinct) {
      return precinct.precinct;
    });
    $scope.$apply();
  };

  var addNewShapes = function () {
    _.forEach($scope.shapes.features, function (shape) {
      shape.properties.precinctName = precinctDisplayFilter(shape.properties.policePrecinct);

      shape.data = _.find($scope.precinctData.data, function (precinct) {

        return precinct.precinct === shape.properties.precinctName;
      });

      shape.onclick = precinctClick;

      var popupContent = '<p class="popup-precinct-name">' + shape.properties.precinctName + '</p>';
      popupContent += '<p class="popup-precinct-total">' + shape.data[$scope.selectedYear] + ' Incidents</p>';

      var geo = L.geoJson(shape, {
          onEachFeature: mapHelpers.setShape
        });
      geo.bindPopup(popupContent);
      $scope.precinctGroup.addLayer(geo);
    });
  };


  var updateShapes = function () {
    $scope.precinctGroup.clearLayers();
    addNewShapes();
    // console.log($scope.precinctGroup.getLayers());
    // $scope.precinctGroup.eachLayer(function (layer) {
    //   layer.setStyle({fillColor: layer.feature.data.color});
    //   console.log(layer);
    // });
  };

  var setMap = function (mapId) {
    $scope.map = $scope.map || L.map(mapId); //.setView([40.7127, -74.0059], 12);

    $scope.precinctGroup = $scope.precinctGroup || L.featureGroup();

    if($scope.precinctGroup.getLayers().length > 0) {
      updateShapes();
    } else {
      addNewShapes();
    }

    var bounds = $scope.precinctGroup.getBounds();

    $scope.precinctGroup.addTo($scope.map);
    $scope.map.setView(bounds.getCenter(), 11);

    var tiles = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      minZoom: 11,
      maxZoom: 15
    });

    tiles.addTo($scope.map);

    // $scope.svg = $scope.svg || d3.select($scope.map.getPanes().overlayPane).append('svg');
    // $scope.g = $scope.g || $scope.svg.append('g').attr('class', 'leaflet-zoom-hide');
  };

  var setPrecinctFill = function(data) {
    var color = d3.scale.threshold();

    var domainMax = d3.max(data, function(d) {
      return d[$scope.selectedYear];
    });

    var domainMin = 0;

    color
    .domain([0, 10, 25, 75, 100, 200, 250, 300])
    .range(['#f7fbff',
      '#deebf7',
      '#c6dbef',
      '#9ecae1',
      '#6baed6',
      '#4292c6',
      '#2171b5',
      '#084594']);

    _.forEach($scope.precinctData.data, function (d)  {
      // console.log(d.total, color(d.total), domainMax, domainMin);
      d.color = color(d[$scope.selectedYear]);
    });

    // var precincts = d3.selectAll('.leaflet-overlay-pane svg path').data(data);

    // precincts.property('fill', function (d) {
    //   console.log(color(d[$scope.selectedYear]));
    //   return color(d[$scope.selectedYear]);
    // });

    // precincts.transition().duration(200);
    // precincts.attr('fill', function (d) {
    //   console.log(color(d[$scope.selectedYear]));
    //   return color(d[$scope.selectedYear]);
    // });
  };

  var windowClick = function () {
    mapHelpers.resetStyle();
    $('#largeMap').off('click', windowClick);
    $('#detailModal').removeClass('full-view');
  };

  var claimClick = function (evt) {
    $scope.selectedClaim = evt.target.feature.properties;
    $scope.$apply();
    $('.claim-display').addClass('show');
  };

  var addClaimLayer = function (claims, onlyAmounts) {
    $scope.claimGroup = $scope.claimGroup || L.featureGroup();

    $scope.claimGroup.clearLayers();

    var setClaim = function (feature, layer) {
      layer.on('click', claimClick);
      layer.setStyle({
        color: 'rgb(0, 0, 0)',
        weight: 1.5,
        fillColor: 'rgb(255, 0, 0)',
        fillOpacity: '0.95'
      });
    };

    var setClaimShape = function (feature, latLng) {
      return L.circle(latLng, 50);
    };

    var claimSet = (onlyAmounts) ? _.filter(claims, function (claim) { return claim.properties.amount !== ''; }) : claims;

    _.forEach(claimSet, function (claim) {
      // console.log(claim);

      var geo = L.geoJson(claim, {
        pointToLayer: setClaimShape,
        onEachFeature: setClaim
      });
      // geo.bindPopup(popupContent);
      $scope.claimGroup.addLayer(geo);
    });

    $scope.claimGroup.addTo($scope.map);
  };

  $scope.showClaimStat = function (evt, onlyAmounts) {
    if($scope.claims) {
      if($scope.map.hasLayer($scope.claimGroup) && onlyAmounts === $scope.onlyAmounts) {
        $scope.map.removeLayer($scope.claimGroup);
      } else {
        addClaimLayer($scope.claims, onlyAmounts);
      }
    } else {
      Loader('claims').then(function (claims) {
        $scope.claims = claims;
        addClaimLayer(claims, onlyAmounts);
      });
    }

    $scope.setYear = function () {
      console.log($scope.selectedYear);
    };

    $scope.onlyAmounts = onlyAmounts;
  };

  $scope.$watch('selectedYear', function() {
    setPrecinctFill($scope.precinctData.data);
    setMap('largeMap');
  });

  setPrecinctFill($scope.precinctData.data);
  setMap('largeMap');
};
