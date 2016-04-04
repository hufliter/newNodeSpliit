'use strict';

describe('Service: fbServices', function () {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var fbServices;
  beforeEach(inject(function (_fbServices_) {
    fbServices = _fbServices_;
  }));

  it('should do something', function () {
    expect(!!fbServices).toBe(true);
  });

});
