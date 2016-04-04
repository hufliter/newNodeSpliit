'use strict';

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */
angular
  .module('webApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngStorage',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'infinite-scroll',
    'ui.bootstrap',
    'ngMap',
    'angular-loading-bar',
    'cgBusy',
    'ngFileUpload',
    'ngScrollbar',
    'ngGeolocation',
    'timer',
    'pascalprecht.translate'
  ])
  .run(function($rootScope, $window){
    $window.fbAsyncInit = function() {
      FB.init({
        appId: appConfig.fbAppId, 
        status: true,
        cookie: true,
        xfbml: true,
        version : 'v2.5'
      });
    };
    (function(d){
      var js,
      id = 'facebook-jssdk', 
      ref = d.getElementsByTagName('script')[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement('script'); 
      js.id = id; 
      js.async = true;
      js.src = "//connect.facebook.net/en_US/sdk.js";

      ref.parentNode.insertBefore(js, ref);
    }(document));
  })
  .config(function ($routeProvider, $httpProvider, $translateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      //Signup controller
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      })
      //Login ctrl
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      //Logout ctrl
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        controllerAs: 'logout'
      })
      //Deals Ctrl
      .when('/deals', {
        templateUrl: 'views/deals.html',
        controller: 'DealsCtrl',
        controllerAs: 'deals'
      })
      //Add Deals Ctrl
      .when('/deals/add', {
        templateUrl: 'views/add-deal.html',
        controller: 'DealsCtrl',
        controllerAs: 'newdeal'
      })
      //Profile Ctrl
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      //Term Ctrl
      .when('/term', {
        templateUrl: 'views/term.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      //Contact Ctrl
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      //Reset password
      .when('/resetPassword/:token', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'resetPass',
      })
      .otherwise({
        redirectTo: '/'
      });

    
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $translateProvider.preferredLanguage('en_US');
    $translateProvider.translations('fr_FR', translationsFR);
    $translateProvider.translations('en_US', translationsEN);
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    $translateProvider.useLocalStorage();
    /*$translateProvider.useStaticFilesLoader({
      prefix: '/languages/',
      suffix: '.json'
    });*/
  });
