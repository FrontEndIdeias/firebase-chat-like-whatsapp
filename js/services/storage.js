/**
 * Created by Cleiton on 14/09/2015.
 */
(function () {
  "use strict";
  FirebaseChat.factory('storage', function($rootScope){


   var jS = $.jStorage;

    var _store = new function(){
      this.key = function(data){
        var store  = jS.index();
        console.log(store, data);

        if(store.indexOf(data.key) == '-1'){
          jS.set(data.key, [data.value])
        }else{
          var bd = jS.get(data.key);
          bd.push(data.value);
          jS.set(data.key, bd);
        }
      };
      this.index = function(){
        return jS.index();
      };
      this.flush = function(){
        return jS.flush();
      };
    };

    var _chats = new function(){
      this.set = function(data){
        return jS.set('chats', data);
      };
      this.get = function(){
        return jS.get('chats');
      };
      this.delete = function(){
        return jS.set('chats', null);
      };
    };

    var _notification = new function () {
      this.set = function (data) {
        return jS.set('notification', data);
      };
      this.get = function () {
        return jS.get('notification');
      };

    };

    return{
      store        : _store,
      chats        : _chats,
      notification : _notification
    };

  });
})();