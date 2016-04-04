'use strict';

/**
 * @ngdoc service
 * @name webApp.Category
 * @description
 * # Category
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('Category', function ($q , fetchUrl, serializeData, urlConfig) {
    var services = {};
    services.getCategory = function(formData) {
      var data = serializeData.cleanData(formData);
      var d = $q.defer();
      fetchUrl.get(urlConfig.urlGet + 'Categories/getCategory?' + data).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }
    return services;
  });
