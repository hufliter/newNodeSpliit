'use strict';

/**
 * @ngdoc service
 * @name webApp.filterDealFunc
 * @description
 * # filterDealFunc
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('filterDealFunc', function (mydeal, $q) {
    var services = {};
    
    services.filterGetAll = function(data) {
      var d = $q.defer();
      var dataReturn = [];
      angular.forEach( data, function(val, k) {
          var countPartner = val.partners.length + 1;
          val.totalPartners = countPartner;
          if( (val.deal.nbRequiredCust > countPartner) && (val.group_status == 0) && (val.archived == 0) ) {
              val.is_pending = true;
          }
          if ( (val.group_status == 1) && (val.deal.nbRequiredCust == countPartner) && (val.archived == 0) ) {
              val.is_confirmation = true;
          }
          if( (val.group_status == 2) && (val.deal.nbRequiredCust == countPartner) && (val.group_concluded == 0) && (val.archived == 0) ) {
            val.is_inProgress = true;
          }

          if( (val.group_status == 2) && (val.deal.nbRequiredCust == countPartner) && (val.group_concluded == 1) && (val.archived == 0) ) {
            val.is_ended = true;
          }

          if( (val.archived == 1) ) {
            val.is_archived = true;
          }

          //confirmation && in progress && ended deal go here..

          dataReturn.push(val);
      });
      d.resolve(dataReturn);
      return d.promise;
    };
    services.filterPending = function(data){
      var d = $q.defer();
      var dataFilterPending = [];
      angular.forEach( data, function(val, k) {
          var countPartner = val.partners.length + 1;
          val.totalPartners = countPartner;
          if( val.deal.nbRequiredCust == null ) return;
          if( (val.deal.nbRequiredCust > countPartner) && (val.group_status == 0) && (val.archived == 0) ) {
              val.is_pending = true;
              dataFilterPending.push(val);
          }
      });
      d.resolve(dataFilterPending);
      return d.promise;
    };
    services.filterConfirmation = function(data) {
      var d = $q.defer();
      var dataFilterConfirmation = [];
      angular.forEach( data, function(val, k) {
          var countPartner = val.partners.length + 1;
          val.totalPartners = countPartner;
          if( val.deal.nbRequiredCust == null ) return;
          if( (val.group_status == 1) && (val.deal.nbRequiredCust == countPartner) && (val.archived == 0) ) {
              val.is_confirmation = true ;
              dataFilterConfirmation.push(val);
          } 
      });
      d.resolve(dataFilterConfirmation);
      return d.promise;
    };
    services.filterInProgress = function(data) {
      var d = $q.defer();
      var dataFilterProgressDeal = [];
      angular.forEach( data, function(val,k){
          var countPartner = val.partners.length + 1;
          val.totalPartners = countPartner;
          if( val.deal.nbRequiredCust == null ) return;
          if( (val.group_status == 2 ) && (val.group_concluded == 0) && (val.archived == 0) ){
              val.is_inProgress = true;
              dataFilterProgressDeal.push(val);
          }
      });
      d.resolve(dataFilterProgressDeal);
      return d.promise;
    };
    services.filterDealEnd = function(data){
      var d = $q.defer();
      var dataFilterDealEnd = [];
      angular.forEach( data, function(val, k) {
        var countPartner = val.partners.length + 1;
        val.totalPartners = countPartner;
        if( val.deal.nbRequiredCust == null ) return;
        if( (val.group_status == 2) && (val.group_concluded == 1) && (val.archived == 0) ) {
          val.is_ended = true;
          dataFilterDealEnd.push(val);
        }
      });
      d.resolve(dataFilterDealEnd);
      return d.promise;
    };
    services.filterArchivedDeal = function(data) {
      var d = $q.defer();
      var dataFilterArchivedDeal = [];
      angular.forEach( data, function(val, k) {
        var countPartner = val.partners.length + 1;
        val.totalPartners = countPartner;
        if( val.deal.nbRequiredCust == null ) return;
        if( (val.archived == 1) ) {
          val.is_archived = true;
          dataFilterArchivedDeal.push(val);
        }
      });
      d.resolve(dataFilterArchivedDeal);
      return d.promise;
    }
    return services;
  });
