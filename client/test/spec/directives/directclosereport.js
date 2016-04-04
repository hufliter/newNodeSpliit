'use strict';

describe('Directive: directclosereport', function () {

  // load the directive's module
  beforeEach(module('webApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<directclosereport></directclosereport>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the directclosereport directive');
  }));
});
