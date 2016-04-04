'use strict';

/**
 * @ngdoc service
 * @name webApp.uploadimage
 * @description
 * # uploadimage
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('uploadimage', function ($q, Upload, fetchUrl, urlConfig, $log) {
    var services = {};
    services.uploadImage = function(formData, file){
      var d = $q.defer();
      console.log(formData);
      Upload.upload({
        url: urlConfig.urlPost + 'Users/upload?options=' + formData.table,
        data: { fileUpload: file, access_token: formData.accessToken },
      }).then(function (resp) {
          d.resolve(resp);
          console.log(resp);
      }, function (resp) {
          console.log('Error status: ' + resp.status);
      }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ');
      });
      return d.promise;
    };
    services.uploadDealImage = function(file) {
      var d = $q.defer();
      Upload.upload({
        url: urlConfig.urlPost + 'deals',
        data: {url_image: file}
      }).then(function (resp) {
        d.resolve(resp);
      });
      return d.promise;
    };
    services.signupImage = function(table, fileImage) {
      var d = $q.defer();
      Upload.upload({
        url: urlConfig.urlPost + 'Users/upload?options=' + table,
        data: { fileUpload: fileImage },
      }).then(function (resp) {
          d.resolve(resp);
          console.log(resp);
      }, function (resp) {
          console.log('Error status: ' + resp.status);
      }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ');
      });
      return d.promise;
    }
    return services;
  });
