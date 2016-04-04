'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:directfilternumber
 * @description
 * # directfilternumber
 */
angular.module('webApp')
  .directive('directfilternumber', function ($timeout) {
    return {
      restrict: 'AE',
      scope:{
      	modelvalue: '='
      },
      link: function postLink(scope, element, attrs) {
      	//range[1 .. 999]
      	$(element).on('input',function(e){
      		if(e.currentTarget.value != ""){
      			var $this = $(this);
	      		var reqexp = new RegExp("^([1-9]\\d{0,2})$","i");
	    		if(!reqexp.test($this.val())){
	    			$this.val('');
	    			scope.modelvalue = '';
	    			$this.addClass('alert-input');
	    		}
	    		$timeout(function() {
	    			$this.removeClass('alert-input');
	    		},200);   
      		}
		
        });
      }
    };
  });
