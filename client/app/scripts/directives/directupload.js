'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:directupload
 * @description
 * # directupload
 */
angular.module('webApp')
  .directive('directupload', function () {
    return {
      link: function postLink($scope, element, attrs) {
  		element.bind("change", function(e){
  				$scope.file = (e.srcElement || e.target).files[0];
          $scope.getFile();
  		  });
      }
    };
  });
