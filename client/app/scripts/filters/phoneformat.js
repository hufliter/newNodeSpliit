'use strict';

/**
 * @ngdoc filter
 * @name webApp.filter:phoneformat
 * @function
 * @description
 * # phoneformat
 * Filter in the webApp.
 */
angular.module('webApp')
  .filter('phoneformat', function () {
    return function (tel) {
      	if (!tel) { return ''; }
      	var value = tel.toString().trim().replace(/^\+/, '');
      	if (value.match(/[^0-9]/)) {
            return tel;
        }
        var country, city, number;
        switch (value.length) {
        	case 9 : 
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 2);
                number = value.slice(2);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }
        number = number.slice(0, 3) + ' ' + number.slice(3,5) + ' ' + number.slice(5,7) + ' ' + number.slice(7);
        console.log(number);

        return (country + " " + city + " " + number).trim();
    };
  });
