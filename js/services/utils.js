(function () {
  "use strict";

  FirebaseChat.factory('utils', function($rootScope, storage){


    var _is = new function(){

      this.int = function (n) {
        return n % 1 === 0;
      };
      this.valid = function (who) {
        return !(who === undefined || who === null || who == []  || who == {} || who === '' || who === ' ');
      };
      this.invalid = function (who){
        return (who === undefined || who === null || who == []  || who == {} || who === '' || who === ' ');
      };


    };


    var _notifyMe = new function(){
      this.create = function(data){
        return new Notification(data.title, {
          body : data.body,
          icon : data.icon
        });
      };
      this.permission = function(){
        Notification.requestPermission(function(result) {
          if(result === 'granted'){
            storage.notification.set(true);
          }else{
            storage.notification.set(false);
          }
          $rootScope.$broadcast('NotificationPermission');
        });
      };
    };

    var _hour = function () {
      function addZero(i) {
        if (i < 10) { i = "0" + i; }
        return i;
      }
      var today = new Date();
      var hour = addZero(today.getHours()) + ':' + addZero(today.getMinutes());
      return hour;
    };


     var _convertImgToBase64URL = function(file, callback){
        var coolFile = {};
        function readerOnload(e){
          var base64 = btoa(e.target.result);
          coolFile.base64 = base64;
          callback(coolFile)
        };

        var reader = new FileReader();
        reader.onload = readerOnload;

        var file = file[0].files[0];
        coolFile.filetype = file.type;
        coolFile.size = file.size;
        coolFile.filename = file.name;
        reader.readAsBinaryString(file);
      };


    var _subdomain =  function(){
      var domain = window.location.host;
      var sub    = domain.split('.');
      return sub[0];
    };

    return {
      notifyMe              : _notifyMe,
      is                    : _is,
      hour                  : _hour,
      convertImgToBase64URL : _convertImgToBase64URL,
      subdomain             : _subdomain
    }

  });
})();