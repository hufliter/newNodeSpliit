'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:selectedfiltercategory
 * @description
 * # selectedfiltercategory
 */
angular.module('webApp')
  .directive('selectedfiltercategory', function () {
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
        $(element).on('click', function (e) {
        	var $this = $(this);
        	$('.deals-category-filter').children(':last-child').text($this.text());
          /*$('.deals-category-filter').children(':first-child').siblings('.cross-menu').addClass('hide');*/
          $this.siblings().removeClass('active');
          $this.addClass('active');
        	$('.filter-category').addClass('hide');
          $('.wrap-deal-results').removeClass('hide');
          $('.cross-menu').addClass('hide');
          $('.category-filter-menu').removeClass('hide');
        });
      }
    };
  });
