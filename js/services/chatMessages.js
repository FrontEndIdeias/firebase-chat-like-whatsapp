FirebaseChat.factory("fbConn", function($rootScope, $timeout, storage, URI) {

  var _chats = new Firebase(URI.stage + '/chats');

  var _chat = new function(){

    this.create = function (data) {
      return _chats.push(data);
    };

    this.sendMessage = function(data) {
      _chats.child(data.who).child('message').push(data.msg);
      _chats.child(data.who).child('last_seed').set(data.msg.send_date);
    };

    this.tipping = function(data){
      _chats.child(data).child('professional_tip').set(true);
      $timeout(function(){
        _chats.child(data).child('professional_tip').set(false);
      }, 500)
    };

    this.block = function(data){
      _chats.child(data).child('chat_block').set(true);
    };

    this.unblock = function(data){
      _chats.child(data).child('chat_block').set(false);
    };
  };

  return {
      chat  : _chat,
      fbURI : _chats
  }
});
