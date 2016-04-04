'use strict';

describe('Service: infinitescroll', function () {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var infinitescroll;
  beforeEach(inject(function (_infinitescroll_) {
    infinitescroll = _infinitescroll_;
  }));

  it('should do something', function () {
    expect(!!infinitescroll).toBe(true);
  });

});
