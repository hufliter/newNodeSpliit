'use strict';

/**
 * @ngdoc service
 * @name webApp.Signup
 * @description
 * # Signup
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('Signup', function ($q, fetchUrl, urlConfig) {
    var services = {};
    services.validate = function(formData){
      var d = $q.defer();
      fetchUrl.post(urlConfig.urlPost + 'Users' , formData).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }
    return services;
  });
