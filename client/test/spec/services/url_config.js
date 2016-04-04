'use strict';

describe('Service: urlConfig', function () {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var urlConfig;
  beforeEach(inject(function (_urlConfig_) {
    urlConfig = _urlConfig_;
  }));

  it('should do something', function () {
    expect(!!urlConfig).toBe(true);
  });

});
