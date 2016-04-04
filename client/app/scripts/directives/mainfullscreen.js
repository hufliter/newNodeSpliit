'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:mainfullscreen
 * @description
 * # mainfullscreen
 */
angular.module('webApp')
  .directive('mainfullscreen', function () {
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
      updateMain();
      $( window ).resize(function() {
  			updateMain();
  		});
  		function updateMain() {
        		var win_h, corousel_h, menu_h, map_h, map_h_resize, filter_bar_h, filter_results_h, h_content;
  	        win_h = $(window).height();
  	        menu_h = $('.header').height();
  	        filter_bar_h = $('.deals-filter-bar').find('>header').outerHeight();
  	        filter_results_h = win_h -  menu_h - filter_bar_h;
            h_content = win_h - menu_h;
            corousel_h = Math.floor(h_content*40/100); 
            map_h_resize = h_content - corousel_h;
            scope.promotionViewHeight = corousel_h;
            scope.filterResultsHeight = filter_results_h;
  	        $('.angular-google-map-container').css('height', map_h_resize + 'px');
            $('.deals-corousel').css('height', corousel_h + 'px')
            $('.deals-corousel').find('.promotion-view').css('height', corousel_h + 'px');   
   			    $('.deal-filter-results, .filter-category').css('height', filter_results_h + 'px');
            $('.dropup').removeClass('open');  
        	}
      }
    };

  });
