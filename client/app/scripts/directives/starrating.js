'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:starrating
 * @description
 * # starrating
 */
angular.module('webApp')
  .directive('starrating', function () {
    return {
      template: '<span ng-repeat="star in stars" class="star" ng-class="star"></span>',
      restrict: 'A',
      scope: {
      	ratingValue: '=',
      	max: '='
      },
      link: function postLink(scope, element, attrs) {
      	scope.stars = [];
      	for( var i = 0 ; i < scope.max; i++) {
      		scope.stars.push({
      			'star-on': i < scope.ratingValue,
      		});
      	}
      }
    };
  });
