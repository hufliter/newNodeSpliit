'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:directreportdeal
 * @description
 * # directreportdeal
 */
angular.module('webApp')
  .directive('directreportdeal', function () {
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
        $(element).on('click', function(e){
        	var $this = $(this);
          var reportBox = $this.parent().siblings('.btn-report-deal');
          var reportBox1 = $this.parent().parent().parent();
          console.log(reportBox1);
          if( reportBox.hasClass('hide') ) {
            $this.parent().siblings('.btn-report-deal').removeClass('hide');
          } else {
            $('.btn-report-deal').addClass('hide');  
          }
          
          
        });
      }
    };
  });
