'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('ContactCtrl', function ($scope, contact, $sessionStorage) {
    
    $scope.sendContact = function(){
    	var formData = {
    		name: $scope.contact.name,
    		email: $scope.contact.email,
    		message: $scope.contact.message,
            access_token: $sessionStorage.user.accessToken
    	};
    	contact.sendContact(formData).then(function(result){
    		if( result.data.success == 0 ) {
    			$scope.error_msg = result.data.message;
    		} else {
    			$scope.contactSend = !$scope.contactSend;
    		}
    	});
    }
  });
