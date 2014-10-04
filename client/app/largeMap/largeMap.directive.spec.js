'use strict';

describe('Directive: largeMap', function () {

  // load the directive's module and view
  beforeEach(module('ccrbsiteApp'));
  beforeEach(module('app/largeMap/largeMap.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<large-map></large-map>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the largeMap directive');
  }));
});