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

.controller('UserCtrl', ['$scope', '$ionicHistory', '$state', 'User', '$q', '$ionicLoading',  '$ionicActionSheet',  '$timeout', 'Camera',  
function($scope,$ionicHistory, $state, User, $q, $ionicLoading, $ionicActionSheet, $timeout, Camera ){
    $scope.user = User;
  //$ionicHistory.clearHistory();
  
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
                        
                            User.setProfilePicture($scope.picture)
                            .then(function(response){
                                    $scope.user.picture = $scope.picture;                                   
                                    return true;                              
                            });
                            
                        }, function(err) {
                                console.err(err);
                          
                        });

                        break;

                    case 1:
                        Camera.getPicture().then(function(imageData) {
                            $scope.picture = "data:image/jpeg;base64," + imageData;

                            User.setProfilePicture($scope.picture)
                            .then(function(response){
                                $scope.user.picture = $scope.picture;
                                return true;
                            });

                        }, function(err) {
                            console.err(err);
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