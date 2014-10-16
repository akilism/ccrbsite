'use strict';

describe('Filter: precinctDisplay', function () {

  // load the filter's module
  beforeEach(module('ccrbsiteApp'));

  // initialize a new instance of the filter before each test
  var precinctDisplay;
  beforeEach(inject(function ($filter) {
    precinctDisplay = $filter('precinctDisplay');
  }));

  it('should return the input prefixed with "precinctDisplay filter:"', function () {
    var text = 'angularjs';
    expect(precinctDisplay(text)).toBe('precinctDisplay filter: ' + text);
  });

});
