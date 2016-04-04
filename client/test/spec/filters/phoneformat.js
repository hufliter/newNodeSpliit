'use strict';

describe('Filter: phoneformat', function () {

  // load the filter's module
  beforeEach(module('webApp'));

  // initialize a new instance of the filter before each test
  var phoneformat;
  beforeEach(inject(function ($filter) {
    phoneformat = $filter('phoneformat');
  }));

  it('should return the input prefixed with "phoneformat filter:"', function () {
    var text = 'angularjs';
    expect(phoneformat(text)).toBe('phoneformat filter: ' + text);
  });

});
