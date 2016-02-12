angular.module('miybndMobile.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Learn more here: https://github.com/angular-ui/ui-router
  $stateProvider
 
 //login screen if already logged go to main screen -- on main screen ctrl remove the navigate option to exit w/back button
 /* .state('home',{
    url: '/',
    onEnter: 
      function($state, User){
        User.checkSession().then(function(hasSession) {
         if (hasSession){ 
             console.log( 'has session');
             $state.go('app.home');
         }else{
             console.log( 'dont have  session');
            $state.go('login')
         }
       });
      }
  })
 */
   .state('login', {
      url: '/login',
      templateUrl: 'users/templates/login.html',
      controller: 'LoginCtrl'
    })
 
    .state('app', {
      url: '/app',
      abstract:true,
      templateUrl: 'core/templates/hometab.html'
    })
      
      
    .state('app.home', {
     // cache: true,
      url: '/home',
      views: {
        'home': {
          templateUrl: 'core/templates/home.html',
          controller: 'HomeCtrl'
        }
      },
    onEnter: 
      function($state, User, $ionicHistory){
          console.log( 'aqui');
        User.checkSession().then(function(hasSession) {
         if (!hasSession){ 
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            console.log( 'dont have  session');
            $state.go('login')
         }
       });
      }
       /*,
      
      resolve: {
        xyz: function(Suggestions) {
          Suggestions.initialize()
          .then(function(){
            return true;
          });   
        }
      }*/
      
    })
    
    .state('app.profile', {
     // cache: true,
        url: '/profile',
        views: {
        'profile': {
          templateUrl: 'users/templates/profile.html',
          controller: 'UserCtrl'
        }
      }
    });
 
        
    
  
        
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});