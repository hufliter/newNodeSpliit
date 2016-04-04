'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('ProfileCtrl', function ($timeout, $scope, $location ,$sessionStorage, profile, reviews, uploadimage, serializeData, fetchUrl, urlConfig, $window) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.mobileNumber = '+33 2 01 12 34 45';
    
    if( $sessionStorage.user == null || $sessionStorage.user == undefined ) {
    	console.log('please login!');
        $scope.login = function(){
            $location.path('/login');
        };
    } else {
    	$scope.$global = $sessionStorage;

        if( $scope.$global.user != null || $scope.$global.user != '' ) {
            if( $scope.$global.user.avatar == '' ) {
                $scope.user_avatar = 'user-def';
            }
            /*$scope.user_avatar = $scope.$global.user.avatar;*/
        	//get user profile 
        	var formData = {
        		access_token: $scope.$global.user.accessToken
        	};
        	profile.getUserProfiles(formData).then(function(result){
                console.log(result);
        		if( result.data.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {

                    if( !result.data.data[0].facebookId ) {
                        $scope.avatar = appConfig.api_url + result.data.data[0].avatar;
                    } else {
                        $scope.avatar = result.data.data[0].avatar;
                    }

                    $scope.profiles = result.data.data;
                    $scope.full_name = result.data.data[0].firstName + ' ' + result.data.data[0].lastName;
                    $scope.mobileNumber = result.data.data[0].mobilePhone;
                    $scope.country = result.data.data[0].country;
                    $scope.email = result.data.data[0].email;
                }
        	});

            //config start rating
            $scope.ratings = {
                max: appConfig.ratingConfig,
            };

            //check input phone is changed
            $scope.isChanged = false;
            $scope.isPhoneChanged = function(){
                $scope.isChanged = true;
                angular.element(document).find('#btnSendPhone').addClass('show');
            }

        	//get user reviews
            formData.selected_id_cust = $scope.$global.user.id;
        	reviews.getReviews(formData).then(function(result){
                //console.log(result);
        		if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {
                    $scope.urlReviewAvatar =  appConfig.api_url;
                    console.log('rev',result.data.data);
                    $scope.reviews = result.data.data;
                    $scope.countReviews = result.data.data.length;
                }
        	});

            $scope.sendPhone = function(){
                angular.element(document).find('#btnSendPhone').removeClass('show');
                angular.element(document).find('#btnSendPhone').addClass('hide');
                var fullMobileNumber = $scope.mobileNumber.replace(/ /g,'');
                formData.mobilePhone = fullMobileNumber;
                profile.updateUserProfiles(formData).then(function(result){
                    //console.log(result);
                    if( result.data.success == 0 ){
                        $scope.error_msg = result.data.message;
                    } else {
                        $scope.isChanged = false;
                        $scope.error_msg = result.data.message;
                        $location.path('/profile');
                    }
                });
            }

            //example data
        	$scope.saveChangedProfile = function(){
                var values = $scope.full_name.split(" ");
                formData.firstName = values[0];
                formData.lastName = values[1];
                formData.email = $scope.email;
                formData.country =  $scope.country;
                /*formData.mobile_phone = $scope.profile.mobile_phone;*/

                profile.updateUserProfiles(formData).then(function(result){
                    console.log(result);
                    /*if( result.data.success == 0 ){
                        $scope.error_msg = result.data.message;
                    } else {
                        console.log($scope.$global);
                        $scope.error_msg = result.data.message;
                        $scope.profiles[0].firstName = values[0];
                        $scope.profiles[0].lastName = values[1];
                        $scope.$global.user.firstName = values[0];
                        $scope.$global.user.lastName = values[1];
                    }*/
                });
        	};

            //upload func
            $scope.upload = function(file) {
                formData.fileUpload = file;
                formData.table = 'user';
                uploadimage.uploadImage(formData,file).then(function(resp){
                    console.log(resp);
                });
            };
        }
    }
  });
