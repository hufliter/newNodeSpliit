'use strict';

/**
 * @ngdoc filter
 * @name webApp.filter:filtermydeal
 * @function
 * @description
 * # filtermydeal
 * Filter in the webApp.
 */
angular.module('webApp')
  .filter('filtermydeal', function () {
    return function (input) {
    	console.log(input);
    	var pendingDealArr = [];
    	angular.forEach(input, function(value, key){
    		var countPartner = value.partners.length;
    		if( value.nb_required_cust == null ) return;
    		if( value.nb_required_cust > countPartner ) {
    			pendingDealArr.push(value);
    		}
    	});
    	console.log(pendingDealArr);
      return pendingDealArr;
    };
  });
