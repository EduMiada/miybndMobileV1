// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('miybndMobile', ['ionic', 'ngCordova','ngCordovaOauth', 'ngMaterial', 'spotify', 'ionic.utils', 'miybndMobile.routes', 'miybndMobile.services',  'miybndMobile.controllers',  'miybndMobile.directives'])

.constant('SERVER', {
  API_URL:'http://miada.com.br:3000/v1/api',
  //API_URL:'http://localhost:3000/v1/api',
  API_AUTH_FACEBOOK :  '/auth/facebook',
  API_FACEBOOK_CLIENT_ID: '162506894117176',
  API_SPOTIFY_CLIENT_ID: '5063d7fc578d4b928e96e050790860c9',
  API_SPOTIFY_CONNECT: '/connectspotify',
  API_OAUTH_CALLBACK: '/localhost/callback',
  API_AUTHENTICATE :  '/authenticate',
  API_SUGGESTIONS :  '/suggestions' ,
  API_SONGS :  '/songs',
  API_USERS: '/users',
  API_USERS_ACCOUNTS: '/accounts',
  API_USER_PICTURE: '/picture',
  API_USER_PROFILE: '/profile',
  API_FEEDS: '/feeds',
  API_FEED_COMMENT: '/comments',
  API_CURRENT_BAND : '/currentband',
  API_SEARCH_NEW_TRACK: '/searchtrack',
  API_ADD_MUSIXMATCH_TRACK:'/addmusicxmatch'
})


.config(function($httpProvider) {
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show')
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        return response
      }
    }
  })
})


//.run(function($ionicPlatform, PushProcessingService, $ionicPopup, $rootScope, $ionicLoading, $cordovaStatusbar) {
.run(function($ionicPlatform, PushProcessingService, $ionicPopup, $rootScope, $ionicLoading, $cordovaStatusbar) {
  $ionicPlatform.ready(function() {
   if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    
    if(window.StatusBar) {
      //$cordovaStatusBar.overlaysWebView(true);
      //$cordovaStatusBar.style(2);
      $cordovaStatusbar.overlaysWebView(true);
      $cordovaStatusbar.style(2);

      //StatusBar.styleBlackTranslucent();
      //StatusBar.styleLightContent();
     // $cordovaStatusBar.backgroundColorByHexString('#fff');
    }

    //function to show/hide loadding animation called by interceptor config    
    $rootScope.$on('loading:show', function() {
       $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>',
          noBackdrop: true,
          hideOnStateChange:true,
          duration:50000 
        });
    });
  
    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide()
    });

   
   //check internet connection
     if(window.Connection) {
          if(navigator.connection.type == Connection.NONE) {
              $ionicPopup.confirm({
                  title: "Internet Disconnected",
                  content: "The internet is disconnected on your device."
              })
              .then(function(result) {
                  if(!result) {
                      ionic.Platform.exitApp();
                  }
              });
          }
      }
   
   
    
    //PushProcessingService.initialize();
    
   // $ionicPlatform.registerBackButtonAction(function(){
      
     // alert($state.current.name);
     // if($state.current.name === 'app.home'){
        //$state.go('app.home') 
     //  ionic.Platform.exitApp();
      //}
    //}, 100);
    
  });
  
 
});
