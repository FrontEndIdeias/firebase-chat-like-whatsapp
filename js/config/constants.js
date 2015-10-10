angular.module('FirebaseChat.constants', [])

.constant('URI', {
  'prod'  : 'https://clinnio-chat.firebaseio.com/',
  'stage' : 'https://clinnio-chat-stage.firebaseio.com/',
  'dev'   : 'https://clinniochat-beta.firebaseio.com/'
})

.constant('ENV',{
  'stage'   : false,
  'prod'    : false,
  'dev'     : true
})



.constant('VERSION', {
  current : 'Version - 1.0.1'
});
