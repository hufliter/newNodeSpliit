'use strict';

/**
 * @ngdoc service
 * @name webApp.fileReader
 * @description
 * # fileReader
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('fileReader', function ($q, $log) {
    var services = {};
    var onLoad = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function(){
          deferred.resolve(reader.result);
        });
      }
    }
    var onError = function(reade, deferredm, scope){
      return function() {
        scope.$apply(function(){
          deferred.resolve(reader.result);
        });  
      }
    }
    var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader,deferred, scope);
      return reader;
    }
    services.readAsDataURL = function(file, scope){
      var d = $q.defer();
      var reader = getReader(d, scope);
      reader.readAsDataURL(file);
      return d.promise;
    }
    return services;
  });
