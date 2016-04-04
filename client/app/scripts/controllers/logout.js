'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('LogoutCtrl', function ($scope, $sessionStorage, $window, fetchUrl, urlConfig) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.$global = $sessionStorage;
      var data = {
          'access_token' : $scope.$global.user.accessToken
      };
      if( $sessionStorage.user != '' || $sessionStorage.user != undefined ) {
        fetchUrl.post(urlConfig.urlPost + 'Users/signOut' ,data).then(function(res){
          if( res.data.success == 0 ) {
              $scope.error_msg = res.data.message;
          } else {
              $scope.$global.user = null;
              //logout facebook account?
              /*FB.logout(function(resp){});*/
              /*$location.path('/');*/
              $window.location.href = appConfig.home_url;
          }
        });
      } else {
        $window.location.href = appConfig.home_url;
      }
  });
