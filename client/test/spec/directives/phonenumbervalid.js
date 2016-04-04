'use strict';

describe('Directive: phoneNumberValid', function () {

  // load the directive's module
  beforeEach(module('webApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<phone-number-valid></phone-number-valid>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the phoneNumberValid directive');
  }));
});
