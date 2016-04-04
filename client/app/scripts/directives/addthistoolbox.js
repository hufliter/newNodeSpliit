'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:addthisToolbox
 * @description
 * # addthisToolbox
 */
angular.module('webApp')
	.directive('addthisToolbox', ['$timeout', function($timeout) {
		return {
		restrict : 'A',
		  transclude : true,
		  replace : true,
		  template : '<ul ng-transclude></ul>',
		  link : function($scope, element, attrs) {
		      $timeout(function () {
		    addthis.init();
		    addthis.toolbox($(element).get(), {}, {
		      url: attrs.url,
		      title : attrs.title,
		      description : attrs.description        
		    });
		  });
		  }
		};
	}]);
