'use strict';

/**
 * @ngdoc service
 * @name webApp.contact
 * @description
 * # contact
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('contact', function ($q, fetchUrl, urlConfig) {
    var services = {};
    services.sendContact = function(formData){
      var d = $q.defer();
      fetchUrl.post(urlConfig.urlPost + 'Users/contact?access_token=' + formData.access_token, formData).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }
    return services;
  });
