'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:UploadfileCtrl
 * @description
 * # UploadfileCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('UploadfileCtrl', function ($scope, $sessionStorage, $location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    //user is logged in
    $scope.$global = $sessionStorage;
    if( $scope.$global.user == undefined || new Date($scope.$global.user.expired).getTime() < new Date().getTime()){
    	$location.path('/login');
    }

    /*$scope.uploadSubmit = function(){
    	var formData = {
    		table : $scope.uploadfile.table,
    		id_cust : $scope.uploadfile.id_cust,
    		id_crypted : $scope.uploadfile.id_crypted,
    		image : $scope.uploadfile.image
    	}
    };*/
  });
