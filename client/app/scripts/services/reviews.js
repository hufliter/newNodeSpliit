'use strict';

/**
 * @ngdoc service
 * @name webApp.reviews
 * @description
 * # reviews
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('reviews', function ($q, fetchUrl, serializeData, urlConfig) {
    var services = {};
    services.getReviews = function(formData){
      var d = $q.defer();
      var data = serializeData.cleanData(formData);
      fetchUrl.get(urlConfig.urlGet + 'UsersComments/getCommentByUid?' + data).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    };
    services.reportUser = function(formData) {
      var d = $q.defer();
      fetchUrl.post(urlConfig.urlPost + 'UsersReports/reportUser?access_token='+formData.access_token , formData).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    };
    services.countReviews = function(formData) {
      var d = $q.defer();
      var data = serializeData.cleanData(formData);
      fetchUrl.get(urlConfig.urlGet + 'UsersComments/countUserComments?' + data).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }
    return services;
  });
