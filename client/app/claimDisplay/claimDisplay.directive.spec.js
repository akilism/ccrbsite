'use strict';

describe('Directive: claimDisplay', function () {

  // load the directive's module and view
  beforeEach(module('ccrbsiteApp'));
  beforeEach(module('app/claimDisplay/claimDisplay.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<claim-display></claim-display>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the claimDisplay directive');
  }));
});