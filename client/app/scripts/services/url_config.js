'use strict';

/**
 * @ngdoc service
 * @name webApp.urlConfig
 * @description
 * # urlConfig
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('urlConfig', function () {
    var app_config = {
      urlGet: appConfig.api_url,
      urlPost: appConfig.api_url,
      // urlGet: appConfig.api_url + 'getData.php?urlArgs=',
      // urlPost: appConfig.api_url + 'postData.php?urlArgs=',
      item_per_page: 10,
      num_pages:5,
    };
    return app_config;
  });
