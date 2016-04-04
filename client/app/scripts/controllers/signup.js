'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('SignupCtrl', function (Signup ,$scope, $sessionStorage, $location, $window, fileReader, $uibModalInstance, uploadimage, $localStorage) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    //user submit login
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
      // $uibModalInstance.close();
    }
    $scope.sex = [
        {label:'Female',value:'F'},
        {label:'Male',value:'M'},
    ];

    $scope.isStepOne = true;
    $scope.nextStep = function(){
        $scope.isStepOne = false;
        $scope.isStepTwo = true;
    }

    $scope.imageUrl = "./images/upload-def.png";
    /*$scope.getFile = function() {*/
    /*$scope.getFile = function() {
        fileReader.readAsDataURL($scope.file, $scope).then(function(result){
            $scope.imageSrc = result;
        });
    }*/
    var currentDateTime = new Date();
    /*$scope.upload = function(file) {
        var n = currentDateTime.toLocaleDateString();
        var table = 'tmp';
        uploadimage.signupImage(table, file).then(function(result){
            // console.log(result);
            //$localStorage.urlUserImage = result.data.data.path;
            $scope.imageUrl = result.data.data.url;
            $scope.avatar = result.data.data.path;
            // $scope.userImageCss = {
            //     'background': 'url('+result.data+') no-repeat center center',
            //     'background-size': 'cover'
            // };
        });
    };*/

    $scope.getFile = function() {
        var table = 'tmp';
        var dealImage = $scope.file;
        uploadimage.signupImage(table, dealImage).then(function(result){
            $scope.imageUrl = result.data.data.url;
            $scope.avatar = result.data.data.path;
        });
    }
    //Datetime picker
    $scope.open = function($event) {
        $scope.status.opened = true;
        $event.preventDefault();
        $event.stopPropagation();
    };
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.status = {
        opened: false
    };

    //user submit signup 
    $scope.signupSubmit = function() {
        /*$scope.$global = $sessionStorage;*/
        /*if( $scope.signup.first_name != '' && $scope.signup.last_name != '' && $scope.signup.email != '' && $scope.signup.password != '' && $scope.signup.mobile_phone != '' && $scope.signup.gender != ''){*/
            var birthday = new Date($scope.signup.birthday).toLocaleDateString();
            var signupForm = {
                'firstName' : $scope.signup.first_name,
                'lastName' : $scope.signup.last_name,
                'email' : $scope.signup.email,
                'password' : $scope.signup.password,
                'mobilePhone' : $scope.signup.mobile_phone,
                'gender' : $scope.signup.gender,
                'country' : '',
                'mark': 0,
                'birthdate': birthday,
                'avatar' : $scope.avatar,
                'created': new Date(),
                'lastUpdated': new Date()
            };
            // console.log(formData);
            Signup.validate(signupForm).then(function(result){
                console.log(result);
                if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {
                    //if sigup success, should confirm email before go to explore
                    /*$scope.$global.user = result['data']['data'];*/
                    /*$window.location.href = '/';*/
                    $scope.isStepOne = false;
                    $scope.isStepTwo = false;
                    $scope.isSuccess = true;
                    delete $localStorage.urlUserImage;
                }
            });
        /*} else */
        if( $scope.signup.first_name == '' || $scope.signup.first_name == undefined) {
            $scope.error_msg = 'Please input First name';
        } else if( $scope.signup.last_name == '' || $scope.signup.last_name == undefined) {
            $scope.error_msg = 'Please input last name';
        } else if( $scope.signup.email == '' || $scope.signup.email == undefined) {
            $scope.error_msg = 'Please input Email';
        } else if( $scope.signup.password == '' || $scope.signup.password == undefined) {
            $scope.error_msg = 'Please input Password';
        } else if( $scope.signup.mobile_phone == '' || $scope.signup.mobile_phone == undefined) {
            $scope.error_msg = 'Please input Mobile phone';
        } 
    };
});
