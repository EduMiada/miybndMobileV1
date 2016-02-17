angular.module('miybndMobile.controllers')


 

.controller('LoginCtrl', ['$scope', '$ionicHistory', '$state', 'User', '$q', '$ionicLoading',    
function($scope,$ionicHistory, $state, User, $q, $ionicLoading ){
   
  //$ionicHistory.clearHistory();
        
  $scope.credentials = {username:'', password:''};
   // attempt to signup/login via User.auth
  
  $scope.submitForm = function() {  
    //session is now set, so lets redirect to discover page
    User.authenticate($scope.credentials).then(function(){       
    
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        
        $state.go('app.home');
        
    }, function(err){
      alert(err.data.message);
    });
  }
  
   $scope.facebookSignIn = function() {  
    //session is now set, so lets redirect to discover page
        User.authenticateFacebook().then(function(){
            $state.go('app.home');
        }, function(err){
           alert(err); 
        });
   }
   
  
   
   
   
   
}])

.controller('UserCtrl', ['$scope', '$ionicHistory', '$state', 'User', '$q', '$ionicLoading',  '$ionicActionSheet',  '$timeout', 'Camera',  'Util','$ionicModal', '$ionicPopup', 
function($scope,$ionicHistory, $state, User, $q, $ionicLoading, $ionicActionSheet, $timeout, Camera, Util, $ionicModal, $ionicPopup ){
    $scope.user = User;
    $scope.profile = {
        about: '',
        channel:{},
        url:'',
        name:''
    }
    
    
     $scope.$on('$ionicView.loaded', function () {
        User.loadProfile().then(function(){
            $scope.instrumentList = Util.instrumentList;
            $scope.channelList = Util.channelList;
            $scope.user.profile = User.profile;
        });
    });
    
    
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function(provider) {			
        return ($scope.user.spotifyToken);
    };
    
    $scope.connectSpotify = function(){
       User.connectSpotify();
    }
    
    $scope.disconnectSpotify = function(){
        User.disconnectSpotify().then(function(){});        
    };
    
   
    
    $scope.updateProfile = function(){
        User.updateProfile($scope.user.profile, false, false)
        .then(function(response){
            $scope.closeModal();
        });
    };
  
    //channel popup
    $scope.addChannel = function(){
              
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: 'users/templates/modalAddChannel.html',
            title: 'Add a channel Url',
            //subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
            { text: 'Cancel' },
            {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                if (!$scope.profile.channel || !$scope.profile.url) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                } else {
                    
                    if (!$scope.user.channels) $scope.user.channels = [];
                                        
                    $scope.user.channels.push({channel:$scope.profile.channel, url:$scope.profile.url, name: $scope.profile.name});

                    return User.updateProfile(false, false,  $scope.user.channels)
                    .then(function(response){
                        $scope.profile.channel = '';
                        $scope.profile.url = '';
                        $scope.profile.name= '';
                        $scope.closeModal();
                    });
                                        
                    //return $scope.updateProfile();
                }
                }
            }
            ]
        });
        
    };
    

    $scope.removeChannel = function(index){
                           
        $scope.user.channels.splice(index,1);

        return User.updateProfile(false, false,  $scope.user.channels)
            .then(function(response){});
                     
    }
  
  $scope.showPopup = function() {
      
     $scope.profile.about = $scope.user.profile.about;
      
  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: 'users/templates/modalEditAbout.html',
    title: 'Say something about yourself',
    //subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.profile.about) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {

                if ($scope.profile.about) $scope.user.profile.about = $scope.profile.about;
                $scope.profile.about = ''; 
                return $scope.updateProfile();
          }
        }
      }
    ]
  });
  
  }
   
    $ionicModal.fromTemplateUrl('users/templates/modalEditAbout.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

  
  $scope.openModal = function() {
    $scope.profile.about = $scope.user.profile.about;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
   
   
  
    $scope.openPictureOptions = function() {
        $ionicActionSheet.show({
            buttons: [{ text: 'Galery' },
            { text: 'Camera' }
            ],
            titleText: '<b>Picture Profile</b>',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
                },
            buttonClicked: function(index) {
                switch(index) {
                    case 0:
                        Camera.getGalery().then(function(imageData) {
                            $scope.picture = "data:image/jpeg;base64," + imageData;
                        
                            User.setProfilePicture($scope.picture).then(function(response){
                                $scope.user.picture = $scope.picture;                                                                 
                            }).then(function(){
                                return true;
                            })
                            
                            return true;
                            
                        }, function(err) {
                                console.err(err);
                            return true;
                        });

                        break;

                    case 1:
                        Camera.getPicture().then(function(imageData) {
                            $scope.picture = "data:image/jpeg;base64," + imageData;

                            User.setProfilePicture($scope.picture)
                            .then(function(response){
                                $scope.user.picture = $scope.picture;
                            }).then(function(){
                                return true;
                            })

                        }, function(err) {
                            console.err(err);
                            return true;
                        });
                        
                        break;

                    default:
                        return true;
                } 
                
               
               return true;  
            }
        });

    };
    
    
}]);


 
   // For example's sake, hide the sheet after two seconds
  /// $timeout(function() {
    // hideSheet();
  // }, 2000);

 //};