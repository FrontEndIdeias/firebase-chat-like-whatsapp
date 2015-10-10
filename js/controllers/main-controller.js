(function() {
  "use strict";

  FirebaseChat.controller('MainCtrl', function ($rootScope, $scope, $timeout, $window, $location, $anchorScroll,
                                            fbConn, utils, storage, api, URI) {

    // In load request
    $scope.load = true;

    //Local Professional ID
    var localID = parseInt($('.currentUserID').val());

    $scope.reciverINDEX = 0;

    // Check if web notifications enabled
    utils.notifyMe.permission();

    // Web notification re check
    $scope.notify = function () {
      utils.notifyMe.permission();
    };

    //Block current user for chating
    $scope.blockuser = function(){
      $('#blockuser').openModal();
    };

    //Change current prof
    $scope.changeUser = function () {
      $scope.myID = $scope.myID == 0 ? 1 : 0;
      $scope.reciverID = $scope.reciverID == 1 ? 0 : 1;
    };

    // Send a messages
    $scope.message = [];
    $scope.addMessage = function () {
      var _msgFb = new Message(false, $scope.msg, '', $scope.myID, $scope.reciverID, utils.hour());
      $scope.message = $scope.msg;
      $scope.msg = null;
      fbConn.chat.sendMessage({who : $scope._ids[$scope.reciverINDEX], msg : _msgFb});
      Materialize.fadeInImage('.chat-area');
      scrollChat();
      //$scope.autoInput();
    };

    // Upload img in base64 for firebase
    $scope.uploadDirect = function () {
      var _msgFb = new Message(true, '', $scope.imgConverted, $scope.myID, $scope.reciverID, utils.hour());
      console.log(_msgFb);
      $scope.message = $scope.msg;
      $scope.msg = null;
      fbConn.chat.sendMessage({who : $scope._ids[$scope.reciverINDEX], msg : _msgFb});
      Materialize.fadeInImage('.chat-area');
    };

    // Open img dialog
    $scope.uploadImage = function () {
      $('#img-upload').click();
    };

    // Set chat active
    $scope.setChat = function (index, id) {
      $scope.reciverID    = id;
      $scope.reciverINDEX = index;
      $scope.message   = $scope.peoples[$scope._ids[index]].message;
      $scope.chatID    = $scope._ids[index];
      $scope.bloqueado = $scope.peoples[$scope._ids[index]].chat_block;
      scrollChat();
    };

    $scope.activeSearch = function () {
      $scope.searchActive = $scope.searchActive == true ? false : true;
    };

    // Get real Firebase ID
    api.professional.get(utils.subdomain(), localID)
      .success(function(res){
        $scope.professional = res;
        $scope.myID = res.professional_id;
        $scope.$broadcast('ProfessionalReady');
    }).error(function(res){

    });

    // Create new chat
    $scope.openChat = function(id, name){
      $scope.searchText = null;
      $scope.autocomplete = null;
      $scope.searchActive = null;
      var room = new Room($scope.myID, $scope.professional.professional_name, false, id, name, false,utils.hour(), false);
      fbConn.chat.create(room);
    };

    // Search patient for new chat
    $scope.searchPatients = function(){
      //if($scope.searchText.length > 1)
        api.patient.get(utils.subdomain(), localID, $scope.searchText)
          .success(function(res){
            $scope.autocomplete = res;
            console.log(res);
        }).error(function(res){
            console.warn(res);
        });
    };

    $scope.blockPatient = function(){
      fbConn.chat.block($scope._ids[$scope.reciverINDEX]);
    };

    $scope.unblockPatient = function(){
      fbConn.chat.unblock($scope._ids[$scope.reciverINDEX]);
    };

    // TODO - IMPROVE METHOD TO MORE FUNCTIONS AND LESS CODE
    $scope.autoInput = function(){

      //var gif = $scope.msg.indexOf('/gif');
      //if(gif == 0 && $scope.msg.length > 7){
      //  api.gif.get($scope.msg.substring(5)).success(function(res){
      //   var indice =  Math.floor((Math.random() * res.data.length) + 1);
      //    $scope.message = res.data[indice].images.downsized.url;
      //    var _msgFb = new Message(true, $scope.msg, res.data[indice].images.downsized.url, $scope.myID, $scope.reciverID, utils.hour());
      //    $scope.message = $scope.msg;
      //    $scope.msg = null;
      //    fbConn.chat.sendMessage({who : $scope._ids[$scope.reciverINDEX], msg : _msgFb});
      //    Materialize.fadeInImage('.chat-area');
      //    //scrollChat();
      //  });
      //}else{
      //
      //}
    };

    // Scroll to end chat
    function scrollChat(){
      $timeout(function() {
        $('.chat-area').scrollTo('#bottom'); // Scroll to
        $('.materialboxed').materialbox(); // View imgs
      }, 0);
    };


    /* ===============
    //    LISTENES
    =================*/

    //Web Notifications
    $rootScope.$on('NotificationPermission', function () {
      $scope.$apply(function() {
        $scope.notification = storage.notification.get();
      });
    });

    // Load Opened conversations
    $scope.$on('ProfessionalReady', function(){
      // FETCH INIT DATA AND WS OBJECTS
      // TODO - REFACTOR TO FACTORY AND MULTIPLES QUERYS
      $scope.peoples = [];
      var initCount  = 0;
      var ref = new Firebase(URI.stage + '/chats');
      ref.orderByChild('professional_id').equalTo($scope.myID).limitToLast(10).on('value', function(res){
        $timeout(function() {
          $scope.peoples = res.val();
          // Resul
          if(res.val() != null){
            $scope.empty = false;
            $scope._ids = Object.keys(res.val());
            $scope.message   = $scope.peoples[$scope._ids[$scope.reciverINDEX]].message;
            $scope.bloqueado = $scope.peoples[$scope._ids[$scope.reciverINDEX]].chat_block;
            $scope.load = false;
          }else{
            $scope.empty = true;
            $scope.load = false;
          }

        }, 0);
        scrollChat();
      });
    });

    //Convert img
    $.jStorage.listenKeyChange('uploadImg', function () {
      utils.convertImgToBase64URL($('#img-upload'), function (data) {
        $scope.imgConverted = 'data:' + data.filetype + ';base64,' + data.base64;
        $scope.uploadDirect();
        console.log($scope.imgConverted);
      });
    });



    // CAPTURE EVENT EXIT AND CHECK IF MSG NOT SEND
    window.onbeforeunload = function (e) {
      if($scope.msg.length > 0){
        var message = "Ainda existem mensagens não enviadas, caso saia da página a mensagem não será enviada",
          e = e || window.event;
        // For IE and Firefox
        if (e) {
          e.returnValue = message;
        }
        // For Safari
        return message;
      }

    };


    // POPULANDO

     //for(var i = 0; i < 100; i++){
     // var room = new Room('cleiton-1', 'Cleiton Tavares', false, 'cleiton-1', 'Usuario de teste', false, utils.hour());
     // fbConn.chat.create(room);
     //}



  });

})();
