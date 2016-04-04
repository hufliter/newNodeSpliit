'use strict';

describe('Filter: filtermydeal', function () {

  // load the filter's module
  beforeEach(module('webApp'));

  // initialize a new instance of the filter before each test
  var filtermydeal;
  beforeEach(inject(function ($filter) {
    filtermydeal = $filter('filtermydeal');
  }));

  it('should return the input prefixed with "filtermydeal filter:"', function () {
    var text = 'angularjs';
    expect(filtermydeal(text)).toBe('filtermydeal filter: ' + text);
  });

});
