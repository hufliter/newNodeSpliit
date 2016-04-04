'use strict';

/**
 * @ngdoc service
 * @name webApp.contact
 * @description
 * # contact
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('common', function ($q, fetchUrl, urlConfig) {
    var services = {};
    services.isSpecialMarkerCluster = function(c){
        var markers = c.getMarkers();
        var return_data = true;
        var lat = 0;
        var lng = 0;
        var precision = 3;
        function toFixed(value, precision) {
            var power = Math.pow(10, precision || 0);
            return String(Math.round(value * power) / power);
        }
        angular.forEach(markers, function(marker, key) {
            if (lat!=0 && (lat != toFixed(marker.position.lat(), precision) && lng != toFixed(marker.position.lng(), precision))){
                return_data = false;
            }
            lat = toFixed(marker.position.lat(), precision);
            lng = toFixed(marker.position.lng(), precision);
        });
        return return_data;
    }
    return services;
});
