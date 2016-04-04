'use strict';

describe('Directive: directdealfilter', function () {

  // load the directive's module
  beforeEach(module('webApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<directdealfilter></directdealfilter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the directdealfilter directive');
  }));
});
