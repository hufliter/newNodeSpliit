'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('MainCtrl', function ($scope, $sessionStorage , $location, common, Category, Deals, serializeData, fetchUrl, urlConfig, $window, $uibModal, mydeal, $rootScope, $routeParams, Login, $localStorage, $geolocation, NgMap, $translateLocalStorage, $translate, reviews) {
    $scope.storeImageUrl = appConfig.api_url;
    $scope.map = null;
    $scope.position = {
        latitude: 0,
        longitude: 0,
    }
    $scope.center = {
        latitude: null,
        longitude: null,
    }
    NgMap.getMap().then(function(map) {
        if (!$scope.map) {
            $scope.map = map;
        }
        $geolocation.getCurrentPosition({
            timeout: 60000
        }).then(function(position) {
            $scope.center = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            var longitude = position.coords.longitude;
            var latitude = position.coords.latitude;
            $localStorage.currentPosition = {
                longitude: longitude,
                latitude: latitude
            };
            //console.log($scope.center);
            $scope.map.setCenter(new google.maps.LatLng(latitude, longitude));
        });
        $geolocation.watchPosition({
            timeout: 60000,
            maximumAge: 250,
            enableHighAccuracy: true
        });
        // console.log($scope.center);
        // console.log($geolocation.position);
        $scope.$watch('$geolocation.position.coords', function (newValue, oldValue) {
            if (newValue) {   
                $scope.center = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                //console.log($scope.center);
                var longitude = newValue.longitude;
                var latitude = newValue.latitude;
                $localStorage.currentPosition = {
                    longitude: longitude,
                    latitude: latitude
                };    
                if ($scope.map) {
                    $scope.map.setZoom(18);
                    // $scope.map.setCenter(new google.maps.LatLng(latitude, longitude));
                }    
            }      
        }, true);

        $scope.$watch('deals', function (newValue, oldValue) {
            //console.log(newValue);
            var vm = this;
            vm.dynMarkers = [];
            $scope.sameMarker = [];
            $scope.currentCluster = [];
            angular.forEach($scope.deals.items, function(deal, key) {
                if ($scope.map) {
                    if (deal.activeSlide) {
                        $scope.map.setZoom(18);
                        $scope.map.setCenter(new google.maps.LatLng($scope.deals.items[key].coords.latitude, $scope.deals.items[key].coords.longitude));
                    }
                }
            });   
            if (newValue.items.length > oldValue.items.length) {
                /*angular.forEach(newValue.items, function(item, k) {
                    if( item && (item.group.length < item.nb_required_cust) ) {
                        console.log(item);
                    }
                });*/
                if ($scope.map) {
                    var bounds = new google.maps.LatLngBounds();
                    for (var k in $scope.map.customMarkers) {
                        var cm = $scope.map.customMarkers[k];
                        vm.dynMarkers.push(cm);
                        bounds.extend(cm.getPosition());
                    };
                    var clusterStyles = [ {
                        textColor: '#ffffff',
                        textSize: 14,
                        fontWeight: 'bold',
                        url: appConfig.home_url + '/images/green_flag@2x.76adcf12.png',
                        height: 46,
                        width: 46
                    }, {
                        textColor: '#ffffff',
                        textSize: 14,
                        fontWeight: 'bold',
                        url: appConfig.home_url + '/images/green_flag@3x.9488b369.png',
                        height: 60,
                        width: 60
                    }, {
                        textColor: '#ffffff',
                        textSize: 14,
                        fontWeight: 'bold',
                        url: appConfig.home_url + '/images/green_flag@3x.9488b369.png',
                        height: 60,
                        width: 60
                    }];
                    //console.log(vm.dynMarkers);
                    vm.markerClusterer = new MarkerClusterer($scope.map, vm.dynMarkers, {
                        styles: clusterStyles,
                        maxZoom: 31,
                        gridSize: 50,
                        zoomOnClick: false
                    });
                    // map.setCenter(bounds.getCenter());
                    // map.fitBounds(bounds);
                    
                    google.maps.event.addListener(vm.markerClusterer, 'clusterclick', function(cluster) {
                        $scope.$apply(function () {
                            $scope.showClusterBox = true;
                        });
                        if (common.isSpecialMarkerCluster(cluster)) {
                            var markers = cluster.getMarkers();
                            var temp = [];
                            angular.forEach(markers, function(marker, key) {
                                temp.push(marker.data);
                            });
                            $scope.$apply(function () {
                                $scope.sameMarker = temp;
                            });
                            $scope.sameMarker = temp;
                            return;
                        } else {
                            $scope.$apply(function () {
                                $scope.showClusterBox = false;
                            });
                            $scope.map.fitBounds(cluster.getBounds());
                            return;
                        }
                    });
                 }
            }

        }, true);

        //save current position to cookie

        $scope.mapOptions = {
            zoom: 8
        }
        $scope.sameMarker = null;
        //config start rating
        $scope.ratings = {
            max: appConfig.ratingConfig,
        };
        $scope.setWidthMenu = function(event, param) {
            $scope.widthDropMenu = event.currentTarget.offsetWidth * param + 5 + 'px';
            $scope.heightDropMenu = event.currentTarget.offsetWidth + 'px';
        };
        $scope.close_cluster_box = function() {
            $scope.showClusterBox = false;
        }
        $scope.showClusterBox = false;
        $scope.sameMarker = null;
        

        // $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8, options: {scrollwheel: false} };
        $scope.carousel = appConfig.carousel;
        
        //Get list of deal with nearby filter only.
        //with current position from cookie
        if( !$localStorage.currentPosition ) {
            $localStorage.currentPosition = $scope.center;
        }
        formData = {
            option: 2,
            longitude: $localStorage.currentPosition.longitude,
            latitude: $localStorage.currentPosition.latitude
        };
        $scope.deals = new Deals(formData);
        $scope.is_logged = false;
        
        /*$scope.getFilterOpt = function(optionId){
            if( optionId == 2 ) {
                formData.latitude = $scope.center.latitude;
                formData.longitude = $scope.center.longitude;
                formData.distance = '';
            }
            formData.option = optionId;
            $scope.deals = {};
            $scope.deals = new Deals(formData);
            $scope.deals.nextPage();
            if( optionId == 2 ) {
                $scope.map.setCenter(new google.maps.LatLng($scope.center.latitude, $scope.center.longitude));
            }
        }
        $scope.filterOptions = [
            { name: 'Popular', id: 1, keyTranslate: 'POPULAR' },
            { name: 'Recent', id: 3, keyTranslate: 'RECENT' },
            { name: 'Nearby', id: 2, keyTranslate: 'NEARBY' },
            { name: 'Expires Soon', id: 4, keyTranslate: 'EXPIRESOON' }
        ];*/
        
        $scope.map_focus = function(index) {
            angular.forEach($scope.deals.items, function(deal, key) {
                $scope.deals.items[key].focus = 'marker-rotate-hover';
            });
            angular.forEach($scope.deals.items, function(deal, key) {
                if (index == key) {
                    $scope.deals.items[index].focus = 'marker-rotate-focus';
                }
            });
            $scope.map.setZoom(18);
            $scope.map.setCenter(new google.maps.LatLng($scope.deals.items[index].coords.latitude, $scope.deals.items[index].coords.longitude));
        }

        $scope.viewDeal = function(id) {
            angular.forEach($scope.deals.items, function(deal, key) {
                $scope.deals.items[key].focus = 'marker-rotate-hover';                
            });
            angular.forEach($scope.deals.items, function(deal, key) {
                if (id == deal.id) {
                    $scope.deals.items[key].activeSlide = false;
                    $scope.deals.items[key].activeSlide = true;
                    $scope.$broadcast("selectSlide", { slideIndex: key });
                    $scope.deals.items[key].focus = 'marker-rotate-focus';
                    $scope.map.setZoom(18);
                    $scope.map.setCenter(new google.maps.LatLng($scope.deals.items[key].coords.latitude, $scope.deals.items[key].coords.longitude));
                }
            });
        }

        //check token is valid or not
        //if ok open popup add new password.
        var token = $routeParams.token;
        if( token && (token != undefined) ) {
            Login.checkToken(token).then(function(result){
                console.log(result);
                if( result.data.data.success == 0 ) {
                   $window.location.href = '/';
                } else {
                    $scope.items = result.data.data.data;
                    $localStorage.email = result.data.data.data.email;
                    var modalInstance = $uibModal.open({
                      animation: true,
                      templateUrl: 'views/resetpassword.html',
                      controller: 'LoginCtrl',
                    });

                    modalInstance.result.then(function () {
                    }, function () {
                    });
                }
            });
        }

        //set default language
        //fix this later
        /*console.log($translateLocalStorage.get('NG_TRANSLATE_LANG_KEY'));*/
        var formData = {};
        var languageKey = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
        formData.language = languageKey.slice(0,2);
        
        Category.getCategory(formData).then(function(result){
            if( result.data.success == 0 ) {
                $scope.error_msg = result.data.message;
            } else {
                //console.log(result);
                /*console.log(result.data);*/
                $scope.categoryData = result.data.data.data;
            }
        });

        //get deals by category filter
        //get all deal only nearby filter.
        //the current position load from cookie.
        $scope.getFilterCateOpt = function(cateId) {
            // console.log('Category id:' + cateId);
            formData.category = cateId;
            formData.option = 2;
            formData.latitude = $localStorage.currentPosition.latitude;
            formData.longitude = $localStorage.currentPosition.longitude;
            $scope.deals = new Deals(formData);
            $scope.deals.nextPage();
        }

        $scope.initScroll = function() {
            // rebuild the scrollbar
            $scope.$broadcast('rebuild:category');
        };
        $scope.change =function() {
            // rebuild the scrollbar
            $scope.$broadcast('rebuild:search');
            $scope.search.length ? $rootScope.listResult = true : $rootScope.listResult = false;  
        };
        $scope.closeList =function() {
            $rootScope.listResult = false;
        };
        //Clear search params
        $rootScope.$watch('listResult', function (newValue, oldValue) {
            if(!newValue) $scope.search = '';
        });
        if( $sessionStorage.user != null || $sessionStorage.user != undefined ) {
            $scope.$global = $sessionStorage;

            if( $scope.$global.user != null || $scope.$global.user != '' ) {
                $scope.is_logged = true;

                $scope.joinDeal = function(dealId){
                    formData.id_cust = $scope.$global.user.id;
                    formData.id_deal = dealId;
                    formData.access_token = $scope.$global.user.accessToken;
                    mydeal.joinDeal(formData).then(function(result){
                        //console.log(result);
                        if( result.data.success == 0 ) {
                            $scope.error_msg = result.data.message;
                        } else {
                            // $scope.error_msg = result.data.message;
                            $location.path('/deals');
                            //$window.location.reload();
                        }
                    });
                }
            }
        }

        //TP
        $rootScope.$on('viewDealDetail', function(event, args){
            angular.forEach($scope.deals.items, function(deal, key) {
                $scope.deals.items[key].focus = 'marker-rotate-hover';
            });
            angular.forEach($scope.deals.items, function(deal, key) {
                if (args.id == deal.id) {
                    $scope.deals.items[key].activeSlide = false;
                    $scope.deals.items[key].activeSlide = true;
                    $scope.$broadcast("selectSlide", { slideIndex: key });
                    $scope.deals.items[key].focus = 'marker-rotate-focus';
                    $scope.map.setZoom(18);
                    $scope.map.setCenter(new google.maps.LatLng($scope.deals.items[key].coords.latitude, $scope.deals.items[key].coords.longitude));
                }
            });
        });

        $scope.report_success = 0;
        $scope.dealReport = function(id_deal) {
            var formData = {
                id_cust: $scope.$global.user.id,
                access_token: $scope.$global.user.accessToken,
                selected_id_cust: '',
                id_deal: id_deal
            }
            reviews.reportUser(formData).then(function(result){
                if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                    $scope.report_success = 1;
                } else {
                    $scope.report_success = 2;
                    $scope.successMsg = result.data.message;
                    
                }
            });
        }

        $scope.openReport = function(){
            $scope.report_success = 0;
            $scope.removeHide = true;
            $scope.carousel.interval = -1;
            var leftCarousel = document.getElementsByClassName('left carousel-control');
            var rightCarousel = document.getElementsByClassName('right carousel-control');
            var prev = angular.element(leftCarousel);
            var next = angular.element(rightCarousel);
            prev.addClass('hide');
            next.addClass('hide');
        }

        $scope.closeReport = function(){
            $scope.removeHide = false;
            $scope.carousel.interval = -1;
            var leftCarousel = document.getElementsByClassName('left carousel-control');
            var rightCarousel = document.getElementsByClassName('right carousel-control');
            var prev = angular.element(leftCarousel);
            var next = angular.element(rightCarousel);
            prev.removeClass('hide');
            next.removeClass('hide');
        }
    });
});
