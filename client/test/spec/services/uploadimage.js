'use strict';

describe('Service: uploadimage', function () {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var uploadimage;
  beforeEach(inject(function (_uploadimage_) {
    uploadimage = _uploadimage_;
  }));

  it('should do something', function () {
    expect(!!uploadimage).toBe(true);
  });

});
