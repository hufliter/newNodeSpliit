'use strict';

describe('Service: filterDealFunc', function () {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var filterDealFunc;
  beforeEach(inject(function (_filterDealFunc_) {
    filterDealFunc = _filterDealFunc_;
  }));

  it('should do something', function () {
    expect(!!filterDealFunc).toBe(true);
  });

});
