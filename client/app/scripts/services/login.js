'use strict';

/**
 * @ngdoc service
 * @name webApp.Login
 * @description
 * # Login
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('Login', function ($q, fetchUrl, urlConfig) {
    var services = {};
    services.validate = function(formData){
      // formData.debug = 'true';
      var d = $q.defer();
      fetchUrl.post(urlConfig.urlPost + 'Users/authenticate', formData).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }
    services.forgotPassword = function(formData){
      var d = $q.defer();
      fetchUrl.post(urlConfig.urlPost + 'Users/requestPasswordReset', formData).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }
    services.checkToken = function(token) {
      var d = $q.defer();
      fetchUrl.get(urlConfig.urlGet + 'Users/confirmResetPassword?access_token=' + token).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }
    services.updateNewPassword = function(formData) {
      var d = $q.defer();
      fetchUrl.post(urlConfig.urlPost + 'Users/rePassword', formData).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }
    return services;
  });
