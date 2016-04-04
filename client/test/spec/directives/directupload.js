'use strict';

describe('Directive: directupload', function () {

  // load the directive's module
  beforeEach(module('webApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<directupload></directupload>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the directupload directive');
  }));
});
