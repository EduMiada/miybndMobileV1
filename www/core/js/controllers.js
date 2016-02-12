/*angular.module('miybndM.controllers').controller('PlaylistsCtrl', ['$scope', function($scope) {
    
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
}]);

angular.module('miybndM.controllers').controller('PlaylistCtrl', ['$scope','$state', '$stateParams', 'User' , function($scope, $state, $stateParams, User) {
  
   $scope.logout = function() {
  
  
    User.destroySession();

    // instead of using $state.go, we're going to redirect.
    // reason: we need to ensure views aren't cached.
      $state.go('splash');
  }
  
  
}]);
*/