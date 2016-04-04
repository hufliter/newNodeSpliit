'use strict';

describe('Directive: selectedfiltercategory', function () {

  // load the directive's module
  beforeEach(module('webApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<selectedfiltercategory></selectedfiltercategory>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the selectedfiltercategory directive');
  }));
});
