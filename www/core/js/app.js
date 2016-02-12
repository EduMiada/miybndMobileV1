// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('miybndMobile', ['ionic', 'ngCordova','ngCordovaOauth', 'spotify', 'ionic.utils', 'miybndMobile.routes', 'miybndMobile.services',  'miybndMobile.controllers',  'miybndMobile.directives'])

.constant('SERVER', {
  //API_URL:'http://miada.com.br:3000/v1/api',
  API_URL:'http://130.200.224.29:3000/v1/api',
  API_AUTH_FACEBOOK :  '/auth/facebook',
  API_FACEBOOK_CLIENT_ID: '162506894117176',
  API_SPOTIFY_CLIENT_ID: '5063d7fc578d4b928e96e050790860c9',
  API_SPOTIFY_CONNECT: '/connectspotify',
  API_OAUTH_CALLBACK: '/localhost/callback',
  API_AUTHENTICATE :  '/authenticate',
  API_SUGGESTIONS :  '/suggestions' ,
  API_SONGS :  '/songs',
  API_USERS: '/users',
  API_USER_PICTURE: '/picture',
  API_FEEDS: '/feeds',
  API_FEED_COMMENT: '/comments',
  API_CURRENT_BAND : '/currentband',
  API_SEARCH_NEW_TRACK: '/searchtrack',
  API_ADD_MUSIXMATCH_TRACK:'/addmusicxmatch'
})


//.run(function($ionicPlatform, PushProcessingService, $ionicPopup, $rootScope, $ionicLoading, $cordovaStatusbar) {
.run(function($ionicPlatform, PushProcessingService, $ionicPopup, $rootScope, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
   //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //  cordova.plugins.Keyboard.disableScroll(true);

    }
    
    if(window.StatusBar) {
      //$cordovaStatusBar.overlaysWebView(true);
      //$cordovaStatusBar.style(2);
     
     // $cordovaStatusbar.overlaysWebView(true);
      //$cordovaStatusbar.style(2);

      //StatusBar.styleBlackTranslucent();
      //StatusBar.styleLightContent();
     // $cordovaStatusBar.backgroundColorByHexString('#fff');
    }

    //function to show/hide loadding animation called by interceptor config    
    /*$rootScope.$on('loading:show', function() {
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
*/
   
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

/*
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
*/
/*
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  //login screen if already logged go to main screen -- on main screen ctrl remove the navigate option to exit w/back button
  .state('app',{
    url: '/',
    onEnter: 
      function($state, User){
        User.checkSession().then(function(hasSession) {
         if (hasSession){ 
             $state.go('app.home');
         }else{
            $state.go('login')
         }
       
       });
      }
  })
  
  .state('login',{
    cache: false,
    url: '/login',
    templateUrl: 'users/templates/login.html',
    controller: 'LoginCtrl' /*,
    onEnter: 
      function($state, User){
        User.checkSession().then(function(hasSession) {
         if (hasSession) 
             $state.go('app.home');
          });
      }
  })
  
  
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'core/templates/menu.html'      
  })

  .state('app.home', {
      cache: true,
      url: '/home',
      views: {
        'home': {
          templateUrl: 'core/templates/home.html',
          controller: 'AppCtrl'
        }
      },
      
      resolve: {
        xyz: function(Suggestions) {
          Suggestions.initialize()
          .then(function(){
            return true;
          });   
        }
      }
      
    });
    /*
  .state('app.songadd', {
    cache:false,
    url: '/songadd',
    views: {
      'songadd': {
        templateUrl: 'songs/templates/song.add.html',
        controller: 'SongAddCtrl'
      }
    }
  })
    
  .state('app.songs', {
    cache:true,
    url: '/songs?status',
    views: {
      'songs': {
        templateUrl: 'songs/templates/songs.list.html',
        controller: 'SongsCtrl'
      }
    },
       resolve: {
        song: function() {
          return true;
        }
      }
  })

 
  
  .state('app.song', {
    cache:true,
    url: '/song/:songId',
    views: {
      'songs': {
        templateUrl: 'songs/templates/song.view.html',
        controller: 'SongsCtrl'
      }
    },
      resolve: {
        song: function(Songs, $stateParams) {
          var selectedSong = $stateParams.songId;  
          console.log('selected song', selectedSong);
          return Songs.findByID(selectedSong)
            .then(function(){
                return  Songs.currentSong;    
          });
          
        }
      }
  })


  
  .state('app.songlyrics', {
    cache:true,
    url: '/song/lyrics',
    views: {
      'songs': {
        templateUrl: 'songs/templates/song.lyrics.view.html',
        controller: 'SongLyricsCtrl'
      },
        resolve: {
        song: function(Songs, $stateParams) {
           var selectedSong = $stateParams.songId;  
            return Songs.findByID(selectedSong)
              .then(function(){
                return true; 
            });
        }
      }
    }
  })
  
  .state('app.songproperties', {
    cache:true,
    url: '/song/properties',
    views: {
      'songs': {
        templateUrl: 'songs/templates/song.properties.view.html',
        controller: 'SongLyricsCtrl'
      },
        resolve: {
        song: function(Songs, $stateParams) {
           var selectedSong = $stateParams.songId;  
            return Songs.findByID(selectedSong)
              .then(function(){
                return true; 
            });
        }
      }
    }
  })
  
    .state('app.songtab', {
    cache:true,
    url: '/song/tablature',
    views: {
      'songs': {
        templateUrl: 'songs/templates/song.tab.view.html',
         controller: 'SongLyricsCtrl'
      },
        resolve: {
        song: function(Songs, $stateParams) {
           var selectedSong = $stateParams.songId;  
            return Songs.findByID(selectedSong)
              .then(function(){
                return true; 
            });
        }
      }
    }
  });
  
   // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});*/

