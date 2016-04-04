'use strict';

/**
 * @ngdoc filter
 * @name webApp.filter:appFilter
 * @function
 * @description
 * # appFilter
 * Filter in the webApp.
 */
angular.module('webApp')
  .filter('appFilter', function () {
    return function (input) {
      return 'appFilter filter: ' + input;
    };
  });
