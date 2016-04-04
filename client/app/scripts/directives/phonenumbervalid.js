'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:phoneNumberValid
 * @description
 * # phoneNumberValid
 */
angular.module('webApp')
  .directive('phonenumbervalid', function () {
    return {
      restrict: 'AE',
      scope:{
      	mobileNumber: '='
      },
      link: function postLink(scope, element, attrs) {
        var telInput = $(element),
		parentTelInput = telInput.parent(),
		btnSendPhone = parentTelInput.find("#btnSendPhone"),
		itemValid = parentTelInput.find(".icon_check_alt"),
		itemNoValid = parentTelInput.find(".icon_error-circle");
        $(element).intlTelInput({
        	nationalMode: true,
	        autoFormat: true,
		      });
			  telInput.on("keyup change", function() {
			  	parentTelInput.removeClass('no-change'); 
			  });
				scope.$watch('mobileNumber', function (newValue, oldValue) {	
						if(newValue){
			            	    var intlNumber = telInput.intlTelInput("getNumber");
							    var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
					        	if (regex.test(intlNumber)) {
								        // Valid international phone number
								        btnSendPhone.removeClass('hide');
								        itemValid.removeClass('hide');
								        itemNoValid.addClass('hide');
								        telInput.intlTelInput("setNumber", intlNumber)
								    } else {
								        // Invalid international phone number
								        btnSendPhone.addClass('hide');
								        itemValid.addClass('hide');
								        itemNoValid.removeClass('hide');
								    }
			            }else{
			           		btnSendPhone.addClass('hide');
							itemValid.addClass('hide');
							itemNoValid.addClass('hide');
		            	}					             
		        });
	    },
	    controller: function ($scope) {
	    	$scope.sendClick = function() {
	    		angular.element(document).find('#btnSendPhone').addClass('hide');
	    	};
        } 
	};
  });
