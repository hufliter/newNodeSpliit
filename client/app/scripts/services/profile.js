'use strict';

/**
 * @ngdoc service
 * @name webApp.profile
 * @description
 * # profile
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('profile', function ($q, fetchUrl, serializeData, urlConfig) {
    var services = {};
    services.getUserProfiles = function(formData){
      var data = serializeData.cleanData(formData);
      var d = $q.defer();
      fetchUrl.get(urlConfig.urlGet + 'Users/getProfile?' + data).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    };
    services.updateUserProfiles = function(fullMobileNumber){
      var d = $q.defer();
      fetchUrl.post(urlConfig.urlPost + 'Users/updateProfile', fullMobileNumber).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }
    return services;
  });
