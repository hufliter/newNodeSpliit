'use strict';

describe('Service: Deals', function () {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var Deals;
  beforeEach(inject(function (_Deals_) {
    Deals = _Deals_;
  }));

  it('should do something', function () {
    expect(!!Deals).toBe(true);
  });

});
