'use strict';

/**
 * @ngdoc service
 * @name webApp.serializeData
 * @description
 * # serializeData
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('serializeData', function ($q) {
    var services = {};
    services.cleanData = function(formData){
      var data = '';
      angular.forEach(formData, function(v,k){
            if( !k ) k = '';
            data += (k + '=' + v + '&');
        }, data);
      data = data.slice(0,-1);
      return data;
    }
    return services;
  });
