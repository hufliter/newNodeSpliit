'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:directclosereport
 * @description
 * # directclosereport
 */
angular.module('webApp')
  .directive('directclosereport', function () {
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
        $(element).on('click', function(e){
        	var $this = $(this);
        	var closeBox = $this.parent().addClass('hide');
        });
      }
    };
  })
  .directive('directclosecross', function(){
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
        $(element).on('click', function(e){
          var $this = $(this);
          $this.addClass('hide');
          var cateMenu = $this.siblings('.category-filter-menu').removeClass('hide');
          $('.filter-category').addClass('hide');
          $('.wrap-deal-results').removeClass('hide');
          /*$this.parent().siblings('.category-name').text('');*/
        });
      }
    };
  });
