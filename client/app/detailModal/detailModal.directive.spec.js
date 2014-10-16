'use strict';

describe('Directive: detailModal', function () {

  // load the directive's module and view
  beforeEach(module('ccrbsiteApp'));
  beforeEach(module('app/detailModal/detailModal.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<detail-modal></detail-modal>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the detailModal directive');
  }));
});