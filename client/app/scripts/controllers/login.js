'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('LoginCtrl',function ($scope, $uibModal, fetchUrl, $sessionStorage, $uibModalInstance, Login, $window, $location, $localStorage, fbServices, $routeParams) {

    //user submit login
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
      // $uibModalInstance.close();
    }

    $scope.loginSubmit = function(){
        $scope.$global = $sessionStorage;
        if( $scope.login.email != '' && $scope.login.password != '' ){
          var formData = {
            email : $scope.login.email,
            password : $scope.login.password
          };
          Login.validate(formData).then(function(result){
            if( result.data.success == 0 ){
              $scope.error_msg = result.data.message;
            } else {
              $scope.$global.user = result.data.data;
              $window.location.href = appConfig.home_url;
            }
          });
        } else if($scope.login.email == '' || $scope.login.email == undefined){
          $scope.error_msg = 'Please input email';
        } else if($scope.login.password == '' || $scope.login.password == undefined){
          $scope.error_msg = 'Please input password';
        }
    };
    //Forgot password modal
      $scope.forgotPassword = function(size){
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/forgotpassword.html',
              controller: 'LoginCtrl',
              size: size,
          });
          modalInstance.result.then(function () {
            console.log('ok');
          }, function () {
            console.log('dismiss');
          });
      }
      $scope.sendForgotPassFrm = function(){
        var formData = { email: $scope.forgot.email };
        $scope.sendSuccess = false;
        Login.forgotPassword(formData).then(function(result){
            if( result.data.data.success == 0 ) {
              $scope.error_msg = result.data.data.message;
            } else {
              $scope.sendSuccess = true;
              $window.location.href = appConfig.home_url;
            }
        });
      };

      $scope.email = $localStorage.email;
      $scope.sendResetPassword = function() {
        var formData = {
          email: $scope.email,
          password: $scope.resetPass.password,
          accessToken: $routeParams.token
        };
        console.log(formData);
        Login.updateNewPassword(formData).then(function(result){
          if( result.data.data.success == 0 ) {
            $scope.error_msg = result.data.data.message;
            $window.location.href = appConfig.home_url;
          } else {
            $scope.error_msg = result.data.data.message;
            $localStorage.$reset();
            $scope.email = '';
            $window.location.href = appConfig.home_url;
          }
        });
      }

      $scope.signUp = function(){
        var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/signup.html',
              controller: 'SignupCtrl',
          });
          modalInstance.result.then(function () {
            console.log('ok');
          }, function () {
            console.log('dismiss');
          });
      }
      //facebook authenticate function
      $scope.fbConnect = function(){
        $scope.$global = $sessionStorage;
        fbServices.fbAuthenticate().then(function(result){
          if( result.data.data.success == 0 ) {
            $scope.error_msg = result.data.data.message;
          } else {
            $scope.$global.user = result.data.data.user;
            $window.location.reload();
          }
        });
      }
  });
