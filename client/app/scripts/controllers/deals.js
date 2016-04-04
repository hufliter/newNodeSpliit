'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:DealsCtrl
 * @description
 * # DealsCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('DealsCtrl', function ($http,$rootScope ,$scope, mydeal, $sessionStorage, $location, uploadimage, $window, filterDealFunc, $uibModal,  Category , fileReader, $filter, $localStorage) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    /*
    $scope.$global = $sessionStorage;
    if( $scope.$global.user == undefined || new Date($scope.$global.user.expired).getTime() < new Date().getTime()){
    	$location.path('/login');
    }
    */
    $scope.$on('scrollbar.show', function(){
      console.log('Scrollbar show');
    });
    $scope.$on('scrollbar.hide', function(){
      console.log('Scrollbar hide');
    });

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }
    $scope.modalRendered = false;
    $scope.openDealreportModal = function(users, idDeal) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/deal-report.html',
          controller: 'DealreportCtrl',
          windowTopClass: 'modalDealreport',
          resolve: {
            userData: function() {
                return users; 
            },
            dealIdData: function(){
                return idDeal;
            },
          },
        });
        modalInstance.result.then(function () {
          console.log('ok');
        }, function () {
          console.log('dismiss');
        });
         modalInstance.opened.then(function () {
          console.log('ok_open');
          $scope.initScroll();
        }, function () {
          console.log('dismiss');
        });
    }
    $scope.openLoginModal = function(size) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/no-deal-popup.html',
            controller: 'DealsCtrl',
            windowTopClass: 'modalNoDeal',
            size: size
        });

        modalInstance.result.then(function () {
            // console.log('ok');
        }, function () {
            // console.log('dismiss');
        });
    }

    //pass data to Review modal
    $scope.modalReview = function(partner, brand, id_deal){
        $scope.reviews = partner;
        $scope.reviews.brand = brand;
        $scope.reviews.id_deal = id_deal;
        $rootScope.modalReview = true;
    }
    $scope.closeModalReview = function() {
        $rootScope.modalReview = false;
    };
    $scope.initScroll = function() {
        $scope.$broadcast('rebuild:listreport');
    };
    if( $sessionStorage.user === null || $sessionStorage.user === undefined ) {
        console.log('your id_cust & id_crypted is missing, please login!');
        $scope.login = function(){
            $location.path('/login');
        };
    } else {
        $scope.$global = $sessionStorage;

        $scope.storeImageUrl = appConfig.api_url;
        if( !$scope.$global.user.facebookId ) {
            $scope.urlAvatar = $scope.storeImageUrl + $scope.$global.user.avatar;
        } else {
            $scope.urlAvatar = $scope.$global.user.avatar;
        }

        $scope.customerData = [{
           id: 2, name: 2
        }, {
           id: 3, name: 3
        }];
        var newDealArr = [];
        $scope.backStepOne = function(){
            $scope.showStepOne = true;
            $scope.showStepTwo = false;
        }

        $scope.backStepTwo = function(){
            $scope.showStepThree = false;
            $scope.showStepTwo = true;
        }

        $scope.showStepOne = true;
        $scope.addDealStepOne = function(){
            $scope.showStepOne = false;
            $scope.showStepTwo = true;
        }

        $scope.addDealStepTwo = function(){
            $scope.showStepTwo = false;
            $scope.showStepThree = true;
        }

        //load category
        var formData = { language: 'fr' };
        Category.getCategory(formData).then(function(result){
            console.log(result);
            if( result.data.data.success === 0 ) {
                $scope.error_msg = result.data.data.message;
            } else {
                console.log(result.data.data.data);
                $scope.categoryData = result.data.data.data;
            }
        });

        $scope.getFile = function() {
            var authData = {
                access_token: $scope.$global.user.accessToken,
                table: 'tmp'
            }
            var dealImage = $scope.file;
            uploadimage.uploadImage(authData, dealImage).then(function(result){
                //$localStorage.url_deal_img = result.data;
                $scope.imageUrl = result.data.data.path;
                $localStorage.url_deal_img = result.data;
                //$scope.imageUrl = result.data.data.url;
                $scope.dealCss = {
                    'background': 'url('+result.data.data.url+') no-repeat center center',
                    'background-size': 'contain'
                }; 
            });
        }

        //valid address location
        /*$scope.getLocation = function(address){
            mydeal.getLocation(address).then(function(result){
                if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {
                    console.log(result.data.data);
                    $scope.validAddress = result.data.data;
                }
            });
        }*/
        $scope.getLocation = function(val) {
            return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
              params: {
                address: val,
                sensor: false
              }
            }).then(function(response){
              return response.data.results.map(function(item){
                return item;
              });
            });
        };
        $scope.selectedAddress = function($item, $model) {
            var validAddressLocation = $model.location;
            $scope.lng = validAddressLocation.lng;
            $scope.lat = validAddressLocation.lat;

            $scope.selectedItem = true;
            $scope.locationUrl = 'https://www.google.com/maps/place/'+ $item;
            $scope.addressItem = $item;
        }
        $scope.dataChanged = function() {
            if( $scope.resultaddress === '' ) {
                $scope.selectedItem = false;
                $scope.resultaddress = '';
            }
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
        $scope.minDate = new Date();

        //add deal function
        $scope.addDealSubmit = function(){
            var end_date = $scope.addDeal.end_date;
            var access_token = $scope.$global.user.accessToken;
            $scope.endDate = new Date(end_date);
            $scope.endDate = $filter("date")($scope.endDate, 'yyyy-MM-dd');
            var formData = {
                idCust : $scope.$global.user.id,
                typeDeal : !$scope.addDeal.type_deal ? 0 : $scope.addDeal.type_deal,
                endDate : $scope.endDate,
                category : $scope.addDeal.category,
                address : $scope.resultaddress,
                longitude: $scope.lng,
                latitude: $scope.lat,
                location: { lat: $scope.lat, lng: $scope.lng },
                promo: $scope.addDeal.promo,
                brand : $scope.addDeal.brand,
                nbRequiredCust : $scope.addDeal.nb_required_cust,
                description : $scope.addDeal.description,
                active : !$scope.addDeal.active ? 0 : $scope.addDeal.active,
                urlImage: $scope.imageUrl,
                createdBy: $scope.$global.user.id,
                createdDate: new Date(),
                is_system: 0
            };
            mydeal.addDeal(formData, access_token).then(function(result){
                if( result.status == 200 ) {
                    $window.location.reload();
                    console.log(result);
                } else {
                    console.log(result);
                }
            });
        }
        
        var formData = {
            id_cust: $scope.$global.user.id,
            access_token: $scope.$global.user.accessToken
        };

        $scope.countPendingDeal = 0;
        $scope.countConfirmDeal = 0;
        $scope.countInProgressDeal = 0;
        $scope.countDealEnd = 0;
        $scope.countArchivedDeal = 0;

        //get deal
        mydeal.getDeal(formData).then(function(result){
            if( result.data.success === 0 ) {
                $scope.error_msg = result.data.message;
            } else {
                $scope.error_msg = result.data.message;
                if( result.data.data == undefined || result.data.data == '' ){
                    $scope.myDeals = null;
                    $scope.isEmpty = true;
                } else {
                    filterDealFunc.filterGetAll(result.data.data).then(function(dataReturn){
                        if( (dataReturn.length > 0) || (dataReturn != '') ) {
                            $scope.myDeals = dataReturn;
                            $scope.isEmpty = false;
                            $rootScope.countAll = dataReturn.length;
                            //for Confirmation Phase
                            var expireTime = 24*60*60;
                            var currentTimeStamp = moment(Date.now()).unix();
                            angular.forEach(dataReturn, function(v,k){
                                v.end_date = (moment(v.deal.endDate).unix() ) - currentTimeStamp ;
                                v.lastModifiedDate = ( moment(v.lastModifiedDate).unix() + expireTime) - currentTimeStamp;
                                $scope.partners = v.partners;
                                angular.forEach($scope.partners, function(item, index){
                                    if( !item.users.facebookId ){
                                        item.users.avatar = appConfig.api_url + item.users.avatar;
                                    } else {
                                        item.users.avatar = item.users.avatar;
                                    }
                                });
                            });
                        } else {
                            $scope.myDeals = null;
                        }
                    });
                    filterDealFunc.filterPending(result.data.data).then(function(dataReturn){
                        if( (dataReturn.length > 0) || (dataReturn != '') ){
                            $scope.countPendingDeal = dataReturn.length;
                        } else {
                            $scope.countPendingDeal = 0;
                        }
                    });
                    filterDealFunc.filterConfirmation(result.data.data).then(function(dataReturn){
                        if( (dataReturn.length > 0) || (dataReturn != '') ){
                            $scope.countConfirmDeal = dataReturn.length;
                        } else {
                            $scope.countConfirmDeal = 0;
                        }
                    });
                    filterDealFunc.filterInProgress(result.data.data).then(function(dataReturn){
                        if( (dataReturn.length > 0) || (dataReturn != '') ){
                            $scope.countInProgressDeal = dataReturn.length;
                        } else {
                            $scope.countInProgressDeal = 0;
                        }
                    });
                    filterDealFunc.filterDealEnd(result.data.data).then(function(dataReturn){
                        if( (dataReturn.length > 0) || (dataReturn != '') ) {
                            $scope.countDealEnd = dataReturn.length;
                        } else {
                            $scope.countDealEnd = 0;
                        }
                    });
                    filterDealFunc.filterArchivedDeal(result.data.data).then(function(dataReturn){
                        if( (dataReturn.length > 0) || (dataReturn != '') ) {
                            $scope.countArchivedDeal = dataReturn.length;
                        } else {
                            $scope.countArchivedDeal = 0;
                        }
                    });
                    //Counting End deal and Archived go here
                }
            } 
        });

        $scope.goExplore = function(){
            $window.location.href = '/';
        }

        //call service filter func

        /* Start Filter */
        //filter Get All Deal
        $scope.getAllDeal = function(){
            console.log('getAll');
            mydeal.getDeal(formData).then(function(result){
                /*console.log(result);*/
                if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {
                    $scope.error_msg = result.data.message;
                    if( result.data.data == undefined || result.data.data == '' ){
                        $scope.myDeals = null;
                    } else {
                        filterDealFunc.filterGetAll(result.data.data).then(function(dataReturn){
                            if( (dataReturn.length > 0) || (dataReturn != '') ) {
                                $scope.myDeals = dataReturn;
                                $scope.countAll = dataReturn.length;
                                //for Confirmation phase
                                var expireTime = 24*60*60;
                                var currentTimeStamp = moment(Date.now()).unix();
                                angular.forEach(dataReturn, function(v,k){
                                    v.end_date = (moment(v.deal.endDate).unix() ) - currentTimeStamp ;
                                    /*v.lastModifiedDate = ((Date.parse(v.lastModifiedDate) / 1000) + expireTime) - currentTimeStamp;*/
                                    v.lastModifiedDate = ( moment(v.lastModifiedDate).unix() + expireTime) - currentTimeStamp;
                                    $scope.partners = v.partners;
                                    angular.forEach($scope.partners, function(item, index){
                                        if( !item.users.facebookId ){
                                            item.users.avatar = appConfig.api_url + item.users.avatar;
                                        } else {
                                            item.users.avatar = item.users.avatar;
                                        }
                                    });
                                });
                            } else {
                                $scope.myDeals = '';
                            }
                        });
                    }
                }
            });
        };
        //end get all

        /* obj in_filter = 1,2,3,4,5 */
        //filter get Pending deal
        $scope.getPendingDeal = function(){
            console.log('pending');
            mydeal.getDeal(formData).then(function(result){
                if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {
                    $scope.error_msg = result.data.message;
                    if( result.data.data == undefined || result.data.data == '' ){
                        $scope.myDeals = null;
                    } else {
                        filterDealFunc.filterPending(result.data.data).then(function(dataReturn){
                            if( (dataReturn.length > 0) || (dataReturn != '') ){
                                $scope.myDeals = dataReturn;
                                $scope.countPendingDeal = dataReturn.length;
                                //if use this code many time , write it to a function.
                                var currentTimeStamp = moment(Date.now()).unix();
                                angular.forEach(dataReturn, function(v,k){
                                    v.end_date = (moment(v.deal.endDate).unix() ) - currentTimeStamp ;
                                    $scope.partners = v.partners;
                                    angular.forEach($scope.partners, function(item, index){
                                        if( !item.users.facebookId ){
                                            item.users.avatar = appConfig.api_url + item.users.avatar;
                                        } else {
                                            item.users.avatar = item.users.avatar;
                                        }
                                    });
                                });
                                /*console.log(dataReturn);*/
                            } else {
                                $scope.myDeals = '';
                            }
                        });
                    }
                }
            });
        };
        //end pending

        //filter get confirmation deal
        $scope.getConfirmDeal = function(){
            console.log('confirmation');
            mydeal.getDeal(formData).then(function(result){
                if( result.data.success == 0 ){
                    $scope.error_msg = result.data.message;
                } else {
                    $scope.error_msg = result.data.message;
                    if( result.data.data == undefined || result.data.data == '' ) {
                        $scope.myDeals = null;
                    } else {
                        filterDealFunc.filterConfirmation(result.data.data).then(function(dataReturn){
                            if( (dataReturn.length > 0) || (dataReturn != '') ){
                                $scope.myDeals = dataReturn;
                                console.log(dataReturn);
                                $scope.countConfirmDeal = dataReturn.length;
                                var expireTime = 24*60*60;
                                var currentTimeStamp = moment(Date.now()).unix();
                                angular.forEach(dataReturn, function(v,k){
                                    v.end_date = (moment(v.deal.endDate).unix() ) - currentTimeStamp ;
                                    v.lastModifiedDate = ( moment(v.lastModifiedDate).unix() + expireTime) - currentTimeStamp;
                                    $scope.partners = v.partners;
                                    angular.forEach($scope.partners, function(item, index){
                                        if( !item.users.facebookId ){
                                            item.users.avatar = appConfig.api_url + item.users.avatar;
                                        } else {
                                            item.users.avatar = item.users.avatar;
                                        }
                                    });
                                });
                            } else {
                                $scope.myDeals = '';
                            }
                        });
                    }
                }
            });
        };
        //end confirm

        //filter get in progress deal
        //waiting the API fix. the group status still return wrong data.
        $scope.getProgressDeal = function(){
            console.log('progress');
            mydeal.getDeal(formData).then(function(result){
                /*console.log(result);*/
                if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {
                    $scope.error_msg = result.data.message;
                    if( result.data.data == undefined || result.data.data == '' ){
                        $scope.myDeals = null;
                    } else {
                        filterDealFunc.filterInProgress(result.data.data).then(function(dataReturn){
                            if( (dataReturn.length > 0) || (dataReturn != '') ){
                                $scope.myDeals = dataReturn;
                                console.log(dataReturn);
                                $scope.countInProgressDeal = dataReturn.length;
                                var currentTimeStamp = moment(Date.now()).unix();
                                angular.forEach(dataReturn, function(v,k){
                                    v.end_date = (moment(v.deal.endDate).unix() ) - currentTimeStamp ;
                                    $scope.partners = v.partners;
                                    angular.forEach($scope.partners, function(item, index){
                                        if( !item.users.facebookId ){
                                            item.users.avatar = appConfig.api_url + item.users.avatar;
                                        } else {
                                            item.users.avatar = item.users.avatar;
                                        }
                                    });
                                });
                            } else {
                                $scope.myDeals = '';
                            }
                        });
                    }
                }
            });
        }
        //end in progress

        //filter get ended deal
        $scope.getEndedDeal = function(){
            console.log('end deal');
            mydeal.getDeal(formData).then(function(result){
                /*console.log(result);*/
                if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {
                    if( result.data.data == undefined || result.data.data == '' ){
                        $scope.myDeals = null;
                    } else {
                        filterDealFunc.filterDealEnd(result.data.data).then(function(dataReturn){
                            if( (dataReturn.length > 0) || (dataReturn != '') ) {
                                $scope.myDeals = dataReturn;
                                $scope.countDealEnd = dataReturn.length;
                                console.log(dataReturn);
                                var currentTimeStamp = moment(Date.now()).unix();
                                angular.forEach(dataReturn, function(v,k){
                                    v.end_date = (moment(v.deal.endDate).unix() ) - currentTimeStamp ;
                                    $scope.partners = v.partners;
                                    angular.forEach($scope.partners, function(item, index){
                                        if( !item.users.facebookId ){
                                            item.users.avatar = appConfig.api_url + item.users.avatar;
                                        } else {
                                            item.users.avatar = item.users.avatar;
                                        }
                                    });
                                });
                            } else {
                                $scope.myDeals = '';
                            }
                        });
                    }
                }
            });
        }
        //end deal ended

        //filter get archived deal
        $scope.getArchivedDeal = function(){
            console.log('archive');
            mydeal.getDeal(formData).then(function(result){
                console.log(result);
                if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {
                    if( result.data.data == undefined || result.data.data == '' ) {
                        $scope.myDeals = null;
                    } else {
                        filterDealFunc.filterArchivedDeal(result.data.data).then(function(dataReturn){
                            if( (dataReturn.length > 0) || (dataReturn != '') ) {
                                $scope.myDeals = dataReturn;
                                $scope.countArchivedDeal = dataReturn.length;
                                var currentTimeStamp = moment(Date.now()).unix();
                                angular.forEach(dataReturn, function(v, k){
                                    v.end_date = (moment(v.deal.endDate).unix() ) - currentTimeStamp ;
                                    $scope.partners = v.partners;
                                    angular.forEach($scope.partners, function(item, index){
                                        if( !item.users.facebookId ){
                                            item.users.avatar = appConfig.api_url + item.users.avatar;
                                        } else {
                                            item.users.avatar = item.users.avatar;
                                        }
                                    });
                                });
                            } else {
                                $scope.myDeals = '';
                            }
                        });
                    }
                }
            });
        }
        //end archived deal

        /* End Filter  */

        //leave deal func
        $scope.leaveDeal = function(idDeal){
            if( idDeal != undefined || idDeal != '' ) {
                formData.id_deal = idDeal;
                var newFormData = {
                    access_token: $scope.$global.user.accessToken,
                    id_deal: idDeal,
                    id_cust: $scope.$global.user.id
                }
                mydeal.leaveDeal(newFormData).then(function(result){
                    //console.log(result);
                    if( result.data.success == 0 ) {
                        $scope.error_msg = result.data.message;
                    } else {
                        $scope.error_msg = result.data.message;
                        $window.location.reload();
                    }
                });
            }
        };

        //participate a deal
        $scope.customer_status = 0;
        $scope.validDeal = function(idDeal) {
            if( idDeal != undefined || idDeal != '' ) {
                formData.id_deal = idDeal;
                formData.id_cust = $scope.$global.user.id;
                formData.access_token = $scope.$global.user.accessToken;
                mydeal.validDeal(formData).then(function(result){
                    //console.log(result);
                    if( result.data.data.success == 0 ) {
                        $scope.error_msg = result.data.data.message;
                    } else {
                        $scope.error_msg = result.data.data.message;
                        $scope.customer_status = 1;
                        $window.location.reload();
                    }
                });
            }
        }

        $scope.dealConclude = function(idDeal){
            if( idDeal != undefined || idDeal != '' ) {
                formData.id_deal = idDeal;
                formData.access_token = $scope.$global.user.accessToken;
                formData.id_cust = $scope.$global.user.id;
                mydeal.dealConclude(formData).then(function(result){
                    //console.log(result);
                    if( result.data.data.success == 0 ) {
                        $scope.error_msg = result.data.data.message;
                    } else {
                        //console.log(result.data);
                        $scope.has_concluded = result.data.data.data.hasConcluded;
                        $window.location.reload();
                    }
                });
            }
        }

        //Rating max 
        $scope.ratings = {
            max: appConfig.ratingConfig
        };

        $scope.hasReviewed = false;
        $scope.reviewUser = function(id_partner, id_deal, id_s_deal){
            var ratingPoint = $scope.review.rating;
            if( !ratingPoint && ratingPoint == undefined ) {
                ratingPoint = 1;
            }
            formData = {
                id_cust: $scope.$global.user.id,
                access_token: $scope.$global.user.accessToken,
                rating: ratingPoint,
                comment: $scope.review.comment,
                id_partner: id_partner,
                id_deal: id_deal,
                id_s_deal: id_s_deal
            }
            mydeal.reviewPartner(formData).then(function(result){
                //console.log(result);
                if( result.data.data.success == 0 ) {
                    $scope.error_msg = result.data.data.message;
                } else {
                    $scope.markReviewed = result.data.data.mark;
                    $scope.hasReviewed = true;
                    $('#modal-review').modal('hide');
                    $window.location.reload();
                }
            });
        }

        $scope.archiveDeal = function(id_deal) {
            if( id_deal != undefined || id_deal != '' ) {
                formData.id_deal = id_deal;
                formData.id_cust = $scope.$global.user.id;
                formData.access_token = $scope.$global.user.accessToken;
                mydeal.archiveDeal(formData).then(function(result){
                    //console.log(result);
                    if( result.data.success == 0 ) {
                        $scope.error_msg = result.data.message;
                    } else {
                        $window.location.reload();
                    }
                });
            }
        }

        //callback deal expire
        $scope.callbackDealExpire = function(id_deal) {
            console.log('call me ' + id_deal);
            formData = {
                id_cust: $scope.$global.user.id,
                access_token: $scope.$global.user.accessToken,
                id_deal : id_deal
            };
            mydeal.dealExpire(formData).then(function(result){
                //console.log(result);
                if( result.data.success == 0 ) {
                    $scope.error_msg = result.data.message;
                } else {
                    $window.location.reload();
                }
            });
        }

        $scope.$watch('countConfirmDeal', function(newVal, oldVal) {
            $scope.countConfirmDeal = newVal;
        });
        $scope.$watch('countInProgressDeal', function(newVal, oldVal){
            console.log(oldVal);
            console.log(newVal);
            $scope.countInProgressDeal = newVal;
        });
        $scope.$watch('countDealEnd', function(newVal, oldVal){
            $scope.countDealEnd = newVal;
        });
        $scope.$watch('countArchivedDeal', function(newVal, oldVal){
            $scope.countArchivedDeal = newVal;
        });
    }
    
  });
