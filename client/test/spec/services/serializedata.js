'use strict';

describe('Service: serializeData', function () {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var serializeData;
  beforeEach(inject(function (_serializeData_) {
    serializeData = _serializeData_;
  }));

  it('should do something', function () {
    expect(!!serializeData).toBe(true);
  });

});
