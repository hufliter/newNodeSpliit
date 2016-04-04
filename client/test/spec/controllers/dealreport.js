'use strict';

describe('Controller: DealreportctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var DealreportctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DealreportctrlCtrl = $controller('DealreportctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DealreportctrlCtrl.awesomeThings.length).toBe(3);
  });
});
