angular.module('miybndMobile.controllers', [])


.controller('AuthCtrl', function($scope, User, $state) {
  
    

  $scope.logout = function(){
    User.destroySession();
      $state.go('splash');
  }
 
  $scope.selectedBandChange = function(){
    User.setCurrentBand($scope.user.bandId)
      .then(function(){       
        $scope.doRefresh();
         //$scope.$broadcast('scroll.refreshComplete');
       });
  }

})

.controller('HomeCtrl', 
function($scope, User, $state, Camera) {
    
    $scope.user = User;
    
    var promise = new Promise(function(resolve, reject) {
        
        resolve($scope.user.bandName);
    });
  
    promise.then(function(title){
        $scope.homeTitle = title;
    // Still does not work with the below uncommented
         $scope.$apply();
    });
    
    
    $scope.savePicture = function(){
        console.log('Start Pic upload');
            User.setProfilePicture($scope.user.picture)
                .then(function(response){
                    console.log(response);
                });
            
        
    }
                            
    
    
    console.log($scope.user);
  
    $scope.logout = function(){
        User.destroySession();
        $state.go('login');
    };
    
   $scope.connectSpotify = function(){
       User.connectSpotify();
   }

})

.controller('AppCtrl',
  function($scope, $ionicModal, $timeout, User, $state, $http, Suggestions, $ionicHistory,$ionicPopup, $mdToast, $cordovaStatusbar, Feed) {
   
  //set context for current user
  $scope.suggestions = [];
  $scope.currentSong = false;
  $scope.currentSong.loaded = false;
  $scope.feeds = [];
  $scope.user = User;
  
  
  $scope.toggleStatusbar = function() {
    $cordovaStatusbar.isVisible() ? $cordovaStatusbar.hide() : $cordovaStatusbar.show()
  }
 
      
  //get notifications from broadcast and evaluate if theres need to update screen on enter event
  $scope.$on('mybnd.song.added', function(){
    $scope.hasChanges=true;
  });
  
  //if there are song changes reload the page
  $scope.$on('$ionicView.beforeEnter', function(){  
    // Code you want executed every time view is opened
    //$ionicHistory.clearHistory();
  
    if ($scope.hasChanges){
      $scope.hasChanges=false;
      $scope.doRefresh();         
    }
  });
  
    //execute when loaded for the first time
  $scope.$on('$ionicView.loaded', function(){
    $scope.user = User;
    $scope.loadRecommendations();  
    $scope.loadFeeds();        
  });

  
  $scope.getCardColor = function(item){
    
   // console.log(item)
    
    if(item === 'song_reject'){
      //console.log('aqwui');
      return 'card-post-assertive';
    }else{
      return 'card-post-dark';
    }
    
  };
  


 $scope.addFeedComment = function(comment,feedID ){
   
   var self = this;
   
    Feed.addFeedComments(feedID, $scope.feedComment)
      .then(function(response){
          console.log(response);
          $scope.showMessage('Comments added');
      })
      .catch(function(error){
          $scope.feeds = [];
          $scope.showMessage('Error adding comments. ' + error.message);
      })
      .finally(function(){
        self.feedComment = "";
      });       
   
 }

 
  //Go to the song
  $scope.openDetails = function() {
    $state.go('song');
  }
  
  
  $scope.addNewSong = function() {
    $state.go('app.songadd');
  }
  
  
  //when user changes selected band
  $scope.selectedBandChange = function(){
    User.setCurrentBand($scope.user.bandId)
      .then(function(){       
        $scope.doRefresh();
    });
  }
 
  //refresh main screen
  $scope.doRefresh = function() {
    Suggestions.queue = []; // = 0;
    
    while($scope.feeds.length > 0) {
      $scope.feeds.pop();
    }
    
    $scope.currentSong = false;
    $scope.loadRecommendations();  
    $scope.loadFeeds();    
  };

  
  $scope.showMessage = function (message) {
   			$mdToast.show(
		      	$mdToast.simple()
		        .content(message)
		        .position('bottom center')
		        .hideDelay(3000)
	    	);
		};


  //get the song recomendations list
  $scope.loadRecommendations= function(){
         Suggestions.initialize()
          .then(function(){
              // initialize the current song
              if (Suggestions.queue.length > 0){
                  $scope.currentSong = Suggestions.queue[0];
                  $scope.unratedCount = Suggestions.count;
              }
             
          })
          .catch(function(error){
              $scope.showMessage('Can´t connect to the server');
          })
          .finally(function(){
            $scope.currentSong.loaded = true;
            $scope.$broadcast('scroll.refreshComplete');
          });       
  }; 
  
  
   //get the user feeds
  $scope.loadFeeds = function(){
      Feed.getBandFeeds()
        .then(function(response){
            $scope.feeds = response.data;
        })
        .catch(function(error){
            $scope.feeds = [];
        });       
  }; 

  // fired when we favorite / skip a song.
  $scope.sendFeedback = function (bool, rate) {   
      // set variable for the correct animation sequence
      $scope.currentSong.rated = bool;
      $scope.currentSong.hide = true;
  
      if (rate) Suggestions.sendFeedback($scope.currentSong._id, rate);
      
      Suggestions.nextSong();
    
      if (Suggestions.queue.length > 0){
        $timeout(function() {
          // $timeout to allow animation to complete before changing to next song
          // update current song in scope
          $scope.currentSong = Suggestions.queue[0];
          $scope.currentSong.loaded = true;
        }, 250);
                    
      }else{
          $scope.currentSong = false;
      };
  };
  
  
  // A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Don´t wanna play this song!',
     template: 'It will be removed from suggestions and placed in the backlog'
   });
   confirmPopup.then(function(res) {
     if(res) {
       $scope.sendFeedback(false, -1);
     } else {

     }
   });
 };
  
  
	$scope.nextAlbumImg = function(){
		if (Suggestions.queue.length > 1){
      return Suggestions.queue[1].song_image;
    }	
    
    return '';
	};
  

});


