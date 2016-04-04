'use strict';

/**
 * @ngdoc service
 * @name webApp.fetchUrl
 * @description
 * # fetchUrl
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('fetchUrl', function ($q, $http, $resource, serializeData) {
      return {
        get: function(url) {
          var d;
          d = $q.defer();
          $http({
            method: 'GET',
            url: url,
          }).then(function(res) {
            d.resolve(res);
          }, function(error) {
            d.reject(error);
          });
          return d.promise;
        },
        post: function(url, data) {
          // var postData = serializeData.cleanData(data);
          var postData = data;
          var d;
          d = $q.defer();
          $http({
            method: 'POST',
            url: url,
            data: postData,
          }).then(function(res) {
            console.log(res);
            d.resolve(res);
          }, function(error) {
            d.reject(error);
          });
          return d.promise;
        },
        put: function(url, data) {
          var d;
          d = $q.defer();
          $http({
            method: 'PUT',
            url: url,
            data: data,
          }).then(function(res) {
            d.resolve(res);
          }, function(error) {
            d.reject(error);
          });
          return d.promise;
        },
        delete: function(url) {
          var d;
          d = $q.defer();
          $http({
            method: 'DELETE',
            url: url,
          }).then(function(res) {
            d.resolve(res);
          }, function(error) {
            d.reject(error);
          });
          return d.promise;
        }
      };
  });
