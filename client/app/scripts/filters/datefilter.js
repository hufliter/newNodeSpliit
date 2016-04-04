'use strict';

/**
 * @ngdoc filter
 * @name webApp.filter:dateFilter
 * @function
 * @description
 * # dateFilter
 * Filter in the webApp.
 */
angular.module('webApp')
  .filter('dateFilter', function () {
  	var getDateTimeSince = function (date) {
	    var timenow = new Date().getTime();
	    var inputDate = new Date(date).getTime();
	    var ageInSeconds = ( inputDate  - timenow) / 1000;
	    var s = function(n) { return n == 1 ? '' : 's' };
	    var second_text = 'second', seconds_text = 'seconds', minute_text = 'minute',
	    	minutes_text = 'minutes', hour_text = 'hour', hours_text = 'hours',
	    	day_text = 'day', days_text = 'days', week_text = 'week',
	    	weeks_text = 'weeks', year_text = 'year', years_text = 'years', months_text = 'months', month_text = 'month';
		if(ageInSeconds){
		    if (timenow > inputDate) {
		        return "expired";
		    }
		    if (ageInSeconds < 60) {
		    	var n = ageInSeconds;
		        return "expires in " + n +" "+(n == 1 ? second_text : seconds_text);
		    }
		    if (ageInSeconds < 60 * 60) {
		        var n = Math.floor(ageInSeconds/60);
		        return "expires in " + n +" "+(n == 1 ? minute_text : minutes_text);
		    }
		    if (ageInSeconds < 60 * 60 * 24) {
		        var n = Math.floor(ageInSeconds/60/60);
		        return "expires in " + n + " "+(n == 1 ? hour_text : hours_text);
		    }
		    if (ageInSeconds < 60 * 60 * 24 * 7) {
		        var n = Math.floor(ageInSeconds/60/60/24);
		        return "expires in " + n + " "+(n == 1 ? day_text : days_text);
		    }
		    if (ageInSeconds < 60 * 60 * 24 * 31) {
		        var n = Math.floor(ageInSeconds/60/60/24/7);
		        return "expires in " + n + " "+(n == 1 ? week_text : weeks_text);
		    }
		    if (ageInSeconds < 60 * 60 * 24 * 365) {
		        var n = Math.floor(ageInSeconds/60/60/24/31);
		        return "expires in " + n + " "+(n == 1 ? month_text : months_text);
		    }
		    var n = Math.floor(ageInSeconds/60/60/24/365);
		    return "expires in " + n + " "+(n == 1 ? year_text : years_text);
		}else{
			return "expired";
		}
	};
    return function (input) {
      return getDateTimeSince(input);
    };
  });
