'use strict';

describe('Directive: fullsidebar', function () {

  // load the directive's module
  beforeEach(module('webApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fullsidebar></fullsidebar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fullsidebar directive');
  }));
});
