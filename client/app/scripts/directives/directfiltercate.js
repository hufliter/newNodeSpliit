'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:directfiltercate
 * @description
 * # directfiltercate
 */
angular.module('webApp')
  .directive('directfiltercate', function () {
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
        $(element).on('click', function (e) {
          var $this = $(this);
          var hide = $this.addClass('hide');
          $this.siblings('.cross-menu').removeClass('hide');
          $('.wrap-deal-results').addClass('hide');
    		  $('.filter-category').removeClass('hide');
        });
      }
    };
  });
