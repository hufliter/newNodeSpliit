'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:DealreportctrlCtrl
 * @description
 * # DealreportctrlCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('DealreportCtrl', function ($scope, $uibModalInstance, reviews, $sessionStorage, userData, dealIdData, $window) {
  
  if( !$sessionStorage.user || $sessionStorage.user == undefined ) {
	//console.log('your id_cust & id_crypted is missing, please login!');
	$window.location.href = '/';
  } else {
	$scope.$global = $sessionStorage;

	if( userData.idCust === undefined || !userData.idCust ) {
		userData.idCust = userData.id;
	}
	console.log(userData);
	var formData = {
	  id_cust: $scope.$global.user.id,
	  access_token: $scope.$global.user.accessToken,
	  selected_id_cust: userData.idCust,
	  id_deal: dealIdData,
	};

	$scope.cancel = function() {
	  $uibModalInstance.dismiss('cancel');
	  // $uibModalInstance.close();
	}
	//$scope.realityUrl = appConfig.api_url;
	$scope.isReportFail = false;
	$scope.reportUser = function() {
	  reviews.reportUser(formData).then(function(result){
		//console.log(result);
		if( result.data.success == 0 ) {
		  $scope.isReportFail = true;
		  $scope.error_msg = result.data.message;
		} else {
		  $scope.isReportFail = false;
		  $uibModalInstance.dismiss('cancel');
		}
	  });
	}

	$scope.initScroll = function() {
	  $scope.$broadcast('rebuild:listreport');
	};
	
	//user data
	$scope.userReport = userData;
	/*console.log('userData', userData.users.avatar);*/
	if( !userData.users ) {
		$scope.userReport.url_img = appConfig.api_url + userData.avatar;
		$scope.userReport.firstName = userData.firstName;
  		$scope.userReport.mark = userData.mark;
	} else {
		$scope.userReport.firstName = userData.users.firstName;
  		$scope.userReport.mark = userData.users.mark;
		$scope.userReport.url_img = userData.users.avatar;
	}



	//Rating max 
	$scope.ratings = {
	  max: appConfig.ratingConfig
	};

	//couting reporting review user.

	reviews.countReviews(formData).then(function(result){
		//console.log(result);
		if( result.data.success == 0 ) {
			$scope.countReviews = 0;
		} else {
			$scope.countReviews = result.data.totalReviews;
		}
	});

	//get list reviews
	reviews.getReviews(formData).then(function(result){
		//console.log(result);
	  	if( result.data.success == 0 ) {
			$scope.error_msg = result.data.message;
	  	} else {
			$scope.listReviews = result.data.data;
			angular.forEach($scope.listReviews, function(reviews, index){
				if( reviews.facebookId ) {
					reviews.user_url_image = reviews.user_url_image;
				} else {
					reviews.user_url_image = appConfig.api_url + reviews.user_url_image;
				}
			});
	  	}
	});
  }
});
