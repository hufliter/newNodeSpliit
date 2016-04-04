'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:directdealsocial
 * @description
 * # directdealsocial
 */
angular.module('webApp')
  .directive('directdealsocial', function () {
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
      	$(element).on('mouseenter',function(e){
      		var $this = $(this);
      		var socialBox = $this.children().siblings('.deal-social');
      		socialBox.removeClass('hide');
      	});
      	$(element).on('mouseleave',function(e){
      		var $this = $(this);
      		var socialBox = $this.children().siblings('.deal-social');
      		socialBox.addClass('hide');
      	})
      }
    };
  });
