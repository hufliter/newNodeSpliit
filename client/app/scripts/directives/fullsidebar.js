'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:fullsidebar
 * @description
 * # fullsidebar
 */
angular.module('webApp')
  .directive('fullsidebar', function ($timeout) {
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
          $timeout(function() {
            updateSidebar();
          })
        $( window ).resize(function() {
    			updateSidebar();
    		});
        $('.content').find(':input').blur(function() {
          $timeout(function() {
            updateSidebar();
          })
        }).on('input',function(e){
          $timeout(function() {
            updateSidebar();
          })
        });
		function updateSidebar() {
      		var win_h, menu_h, header_sidebar_h, list_reviews_h,content_h, max_param;
      		menu_h = $('.header').outerHeight();
	        win_h = $(window).height();
	        header_sidebar_h = $('.header-sidebar').outerHeight();
          content_h = $('.content-profile').outerHeight();
	        list_reviews_h = win_h -  menu_h - header_sidebar_h;
          max_param = win_h - menu_h - content_h;
          if(max_param > 0){
            $(element).find('.scrolllist').css({
                'height': list_reviews_h - 30 + 'px'
                }); 
          }else{
            $(element).find('.scrolllist').css({
              'height': (content_h - header_sidebar_h ) - 30 + 'px'
            });
          }
      	}
      }
    };
  });
