'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:directfilteroption
 * @description
 * # directfilteroption
 */
angular.module('webApp')
  .directive('directfilteroption', function () {
    return {
      restrict: 'AE',
      
      link: function postLink(scope, element, attrs) {
        $(element).on('click', function (e) {
            var $this = $(this),
            $filterBox = $this.parent(),
            $filterBoxSpan = $filterBox.siblings('.deals-filter-item');
            $filterBoxSpan.text($this.text());
        });
      }
    };
  });
