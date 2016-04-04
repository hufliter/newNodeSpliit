'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:directlang
 * @description
 * # directlang
 */
angular.module('webApp')
  .directive('directlang', function () {
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
        $(element).on('click', function(e){
        	var $this = $(this);
        	if( $this.hasClass('active') ) {
        		$this.siblings('span').removeClass('active');
        	} else {
            $this.addClass('active');
            $this.siblings('span').removeClass('active');
          }
        });
      }
    };
  });
