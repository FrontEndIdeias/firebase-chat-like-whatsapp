/**
 * Created by Cleiton on 18/09/2015.
 */
(function () {
  "use strict";
  FirebaseChat.factory('api', function($http, utils){

    var uri = '/api/v1/';

    var _professional = new function(){
      this.get = function(clinic_domain, professionalID){
        return $http.get(uri + 'get_professional/' + clinic_domain + '/' + professionalID);
      };
    };

    var _patient = new function(){
      this.get = function(clinic_domain, professional, patient){
        if(utils.is.invalid(patient))
          return $http.get(uri + 'get_patients/' + clinic_domain + '/' + professional);
        return $http.get(uri + 'get_patients/' + clinic_domain + '/' + professional + '/' + patient);

      };
    };

    var _gif = new function(){
      this.get = function(data){
        return $http.get('http://api.giphy.com/v1/gifs/search?q=' + data + '&api_key=dc6zaTOxFJmzC');
      };
    };

    return{
      professional :_professional,
      patient      : _patient,
      gif          : _gif
    };

  });
})();