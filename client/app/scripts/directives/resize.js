'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:resize
 * @description
 * # resize
 */
angular.module('webApp')
  .directive('resize', function ($window) {
   return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            // rebuild the scrollbars
            scope.$broadcast('rebuild:category');
            scope.$broadcast('rebuild:profilelistreport');
            scope.$broadcast('rebuild:listreport');
            scope.$broadcast('rebuild:search');
        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
  });
