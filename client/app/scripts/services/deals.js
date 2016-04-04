'use strict';

/**
 * @ngdoc service
 * @name webApp.Deals
 * @description
 * # Deals
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('Deals', function ($q, fetchUrl, serializeData, urlConfig) {
    /*var services = {};
    services.create = function(formData) {
      var data = serializeData.cleanData(formData);
      var d = $q.defer();
      fetchUrl.post(urlConfig.urlPost + 'deals', data).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    };
    services.getDeals = function(formData) {
      var data = serializeData.cleanData(formData);
      var d = $q.defer();
      fetchUrl.get(urlConfig.urlGet + 'deals&'+ data).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    };
    services.getDealsById = function(formData) {
      var data = serializeData.cleanData(formData);
      var d = $q.defer();
      fetchUrl.get(urlConfig.urlGet + 'deals&' + data).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    };*/
    var infinitescroll = function(formData) {
      this.data = serializeData.cleanData(formData);
      this.items = [];
      this.page = '';
      this.busy = false;
      this.after = '';
      this.currentPage = 1;
      this.isFinish = 0;
    };
      infinitescroll.prototype.nextPage = function() {
      if (this.busy) return;
      if( this.isFinish == 1 ) return;
      this.busy = true;
      // + '&page='+ this.currentPage
      var data = this.data;
      fetchUrl.get(urlConfig.urlGet + 'Deals/getDeals?' + data).then(function(result){
        if( result.data.success == 1 ) {
          /*this.currentPage++;*/
          this.isFinish = 1;
          var items = result.data.data;
          for (var i = 0; i < items.length; i++) {
            //when all oarticipants have participated in a deal
            //the deal should no longer be available on the map
            if( items[i].group.length < items[i].nbRequiredCust ) {
              items[i].coords = {
                latitude: items[i].latitude,
                longitude: items[i].longitude,
              } 
              if( !i ) {
                items[i].activeSlide = true;
              } else {
                items[i].activeSlide = false;
              }
              this.items.push(items[i]);
            }
          }
          this.busy = false;
        } else {
          /*this.isFinish = 1;*/
          console.log('Nothing to show');
        }
        // console.log(this.items);
      }.bind(this));
    };
    return infinitescroll;
  });
