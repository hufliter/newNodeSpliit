'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:directdealfilter
 * @description
 * # directdealfilter
 */
angular.module('webApp')
  .directive('directdealfilter', function () {
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
        $(element).on('click', function(e){
        	var $this = $(this);
        	/*var lastClass = $this;*/
    		if( $this.hasClass('active') ) {
    			/*$this.removeClass('active');*/
    		} else {
    			$this.addClass('active');
    			$this.siblings('li').removeClass('active');
    		}
        });
      }
    };
  });
