'use strict';

/**
 * @ngdoc service
 * @name webApp.fbServices
 * @description
 * # fbServices
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('fbServices', function ($q, fetchUrl, urlConfig) {
    var services = {};
    services.fbAuthenticate = function(){
      var d = $q.defer();
      FB.login(function(res){
        if( res.authResponse ) {
          console.log('Welcome! Fetching your information...');
          FB.api('/me?fields=id,first_name,last_name,gender,email,picture,location',function(response){
            /*d.resolve(response);*/
            /*checkUserExist(response);*/

            //get more detail location via location id.
            var dataReturn;
            response.gender = response.gender.slice(0,1);
            /*console.log(response);*/
            if( response.location ) {
              FB.api('/'+ response.location.id +'?fields=location',function(locate){
                response.country = locate.location.country;
                dataReturn = checkUserExist(response);
                d.resolve(dataReturn);
              });
            } else {
              dataReturn = checkUserExist(response);
              d.resolve(dataReturn);
            }
          });
        } else {
          console.log('User cancelled login or did not fully authorize');
        }
      }, {
        scope: 'email, user_location',
        return_scopes: true
      });
      return d.promise;
    };

    //this function using for fb authenticate, check user email exist or not
    function checkUserExist(fbResp) {
      var d = $q.defer();
      var data = {
        country: fbResp.country,
        email: fbResp.email,
        facebookId: fbResp.id,
        first_name: fbResp.first_name,
        gender: fbResp.gender,
        last_name: fbResp.last_name,
        avatar: fbResp.picture,
      };
      fetchUrl.post(urlConfig.urlPost + 'Users/fbAuthenticate', data).then(function(result){
        d.resolve(result);
      });
      return d.promise;
    }

    return services;
  });
