'use strict';

describe('Directive: directinfinitescroll', function () {

  // load the directive's module
  beforeEach(module('webApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<directinfinitescroll></directinfinitescroll>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the directinfinitescroll directive');
  }));
});
