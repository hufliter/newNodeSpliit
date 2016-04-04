'use strict';

describe('Service: mydeal', function () {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var mydeal;
  beforeEach(inject(function (_mydeal_) {
    mydeal = _mydeal_;
  }));

  it('should do something', function () {
    expect(!!mydeal).toBe(true);
  });

});
