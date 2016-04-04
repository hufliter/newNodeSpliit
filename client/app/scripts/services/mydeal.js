'use strict';

/**
 * @ngdoc service
 * @name webApp.mydeal
 * @description
 * # mydeal
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('mydeal', function ($q, fetchUrl, serializeData, urlConfig) {
    var services = {};
      services.getDeal = function(formData){
        var d = $q.defer();
        fetchUrl.get(urlConfig.urlGet + 'Users/myDeals?access_token=' + formData.access_token).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }
      services.addDeal = function(formData, access_token){
        var d = $q.defer();
        fetchUrl.post(urlConfig.urlPost + 'deals?access_token=' + access_token, formData).then(function(result){
          /*console.log(result);*/
          d.resolve(result);
        });
        return d.promise;
      }
      services.deals = function(formData){
        var d = $q.defer();
        var data = serializeData.cleanData(formData);
        fetchUrl.get(urlConfig.urlGet + 'Deals/getDeals?' + data).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }
      services.joinDeal = function(formData){
        var d = $q.defer();
        fetchUrl.post(urlConfig.urlPost + 'SharedDeals/joinDeal?access_token='+formData.access_token, formData).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }
      services.leaveDeal = function(formData){
        var data = serializeData.cleanData(formData);
        var d = $q.defer();
        fetchUrl.delete(urlConfig.urlGet + 'SharedDeals/leaveDeal?' + data).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }
      services.validDeal = function(formData){
        var d = $q.defer();
        fetchUrl.post(urlConfig.urlPost + 'SharedDeals/validDeal?access_token='+formData.access_token, formData).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }
      services.dealConclude = function(formData){
        var d = $q.defer();
        fetchUrl.post(urlConfig.urlPost + 'SharedDeals/dealConclude?access_token='+formData.access_token, formData).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }
      services.reviewPartner = function(formData) {
        var d = $q.defer();
        fetchUrl.post(urlConfig.urlPost + 'SharedDeals/reviewDeal?access_token='+formData.access_token, formData).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }
      services.archiveDeal = function(formData) {
        var d = $q.defer();
        fetchUrl.post(urlConfig.urlPost + 'SharedDeals/archiveDeal?access_token='+formData.access_token, formData).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }
      services.dealExpire = function(formData) {
        var d = $q.defer();
        fetchUrl.post(urlConfig.urlPost + 'Deals/checkDealExpireById?access_token='+formData.access_token, formData).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }
      /*services.getLocation = function(address) {
        var d = $q.defer();
        fetchUrl.get(urlConfig.urlGet + 'validlocation?address=' + address).then(function(result){
          d.resolve(result);
        });
        return d.promise;
      }*/
      return services;
  });
