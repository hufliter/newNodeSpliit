'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('HeaderCtrl', function ($scope, $rootScope, $sessionStorage, $uibModal, serializeData, fetchUrl, urlConfig, $location, mydeal, filterDealFunc, $translate, $translateLocalStorage, NgMap, $geolocation, common, $localStorage) {
	$rootScope.listResult = false;
	$scope.citiesData = [
	    { name: 'Paris', description: 'Saint Germani' },
	    { name: 'Paris', description: 'Saint Paul' },
	    { name: 'Rome', description: 'Saint Germani' },
	    { name: 'Minsk', description: 'Saint Germani' },
	    { name: 'Ho Chi Minh City', description: 'Saint Germani' },
	    { name: 'Paris', description: 'Saint Germani' },
	    { name: 'Paris', description: 'Saint Germani' },
	    { name: 'Paris', description: 'Saint Germani' },
	    { name: 'Paris', description: 'Saint Paul' },
	    { name: 'Rome', description: 'Saint Germani' },
	    { name: 'Minsk', description: 'Saint Germani' },
	    { name: 'Ho Chi Minh City', description: 'Saint Germani' },
	    { name: 'Paris', description: 'Saint Germani' },
	    { name: 'Paris', description: 'Saint Germani' }
	];



  //search function
  $scope.isSuccess = false;
  $scope.searchChanged = function(){

    if( $scope.search.length <= 1 ) {
      $scope.listResult = false;
    } else {
      $scope.listResult = true;
      var formData = {
        search_key: $scope.search,
        option: 2,
        longitude: $localStorage.currentPosition.longitude,
        latitude: $localStorage.currentPosition.latitude
      }
      mydeal.deals(formData).then(function(result){
        if( result.data.success == 0 ) {
          $scope.error_msg = result.data.message;
          $scope.isSuccess = false;
        } else {
          $scope.isSuccess = true;
          $scope.searchResult = result.data.data;
          $scope.$broadcast('rebuild:search');
        }
      });
    }
  }

  $scope.viewDeal = function(id) {
    console.log(id);
    $scope.listResult = false;
    $rootScope.$emit('viewDealDetail', {
      id: id,
    });
  };

	$scope.openLoginModal = function(size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        size: size
      });

  	modalInstance.result.then(function () {
    		// console.log('ok');
      }, function () {
    		// console.log('dismiss');
      });
  }
  $scope.getLang = function(langKey){
    $translate.use(langKey);
  }
  
  var langKey = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
  $scope.frLangActive = false;
  $scope.enLangActive = false;
  if( langKey == 'fr_FR' ) {
    $scope.frLangActive = true;
  }
  if( langKey == 'en_US' ) {
    $scope.enLangActive = true;
  }
  if( $sessionStorage.user != null || $sessionStorage.user != undefined ) {
      $scope.$global = $sessionStorage;
      if( $scope.$global.user.avatar == '' || $scope.$global.user.avatar == 'undefined') {
          $scope.user_avatar = 'user-icon user-def';
      } else if ($scope.$global.user.facebookId && $scope.$global.user.facebookId !== undefined) {
        $scope.user_avatar = $scope.$global.user.avatar;
      } else {
        $scope.user_avatar = appConfig.api_url + $scope.$global.user.avatar;
      }

      if( $scope.$global.user != null || $scope.$global.user != '' ) {
          $scope.is_logged = true;
      }

      $scope.myDeal = function(){
        $location.path('/deals');
      }
      $scope.getProfile = function(){
        $location.path('/profile');
      }

      	//Add deal modal
      	$scope.openAddDealModal = function(size){
		    var modalInstance = $uibModal.open({
		        animation: true,
		        templateUrl: 'views/add-deal.html',
		        controller: 'DealsCtrl',
		        size: size,
		        windowClass: 'modalAddDeal',
		    });
		    modalInstance.result.then(function () {
		      	console.log('ok');
		    }, function () {
		     	 console.log('dismiss');
		    });
      	};
 	 	var formData = {
       	 	/*id_cust: $scope.$global.user.idCust,*/
        	access_token: $scope.$global.user.accessToken
 	 	};
      	mydeal.getDeal(formData).then(function(result){
          	//console.log(result.data.data);
          	if( result.data.success == 0 ) {
              	$scope.error_msg = result.data.message;
          	} else {
              	//$scope.error_msg = result.data.message;
              	$rootScope.countAll = result.data.data.length;
        	} 
    	});
  	}
});
