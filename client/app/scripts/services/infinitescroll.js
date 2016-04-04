'use strict';

/**
 * @ngdoc service
 * @name webApp.infinitescroll
 * @description
 * # infinitescroll
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('infinitescroll', function (fetchUrl, serializeData, urlConfig) {
    var infinitescroll = function(formData) {
    this.data = serializeData.cleanData(formData);
    this.items = [];
    this.page = '';
    this.busy = false;
    this.stop = false;
    this.after = '';
    this.currentPage = 1;
    this.isFinish = 0;
  };

  infinitescroll.prototype.nextPage = function() {
    if (this.busy || this.stop) return;
    this.busy = true;

    var data = this.data + '&page='+ this.currentPage;
    fetchUrl.get(urlConfig.urlGet + 'deals?' + data).then(function(result){
      if( result.data.success == 1 ) {
        this.currentPage++;
        var items = result.data.data.deal;
        for (var i = 0; i < items.length; i++) {
          this.items.push(items[i]);
        }
        this.busy = false;
      } else {
        this.isFinish = 1;
      }
    }.bind(this));
  };

  return infinitescroll;
  });
