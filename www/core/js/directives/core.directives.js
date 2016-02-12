angular.module('miybndMobile.directives', []);

angular.module('miybndMobile.directives').directive('backImg', function(){
     return function(scope, element, attrs){

        attrs.$observe('backImg', function(value) {
     
            element.css({
                'background': 'url(' + value +') no-repeat center center fixed',
                 '-webkit-background-size': 'cover',
                    '-moz-background-size': 'cover',
                     '-o-background-size': 'cover',
                    'background-size': 'cover',
                    'background-color': '#000',
                    'filter': 'grayscale(90%)',
              });
        });
    };
})

angular.module('miybndMobile.directives').directive('hideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function($scope, $el) {
      $scope.$on("$ionicView.beforeEnter", function () {
        $rootScope.hideTabs = true;
      });
      $scope.$on("$ionicView.beforeLeave", function () {
        $rootScope.hideTabs = false;
      });
    }
  };
})


angular.module('miybndMobile.directives').directive('youtube', function($window) {

  return {
    restrict: "E",

    scope: {
      height: "@",
      width: "@",
      videoid: "@"
    },

    template: '<div></div>',

    link: function(scope, element) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;

      $window.onYouTubeIframeAPIReady = function() {

        player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 0,
            html5: 1,
            theme: "light",
            modesbranding: 0,
            color: "white",
            iv_load_policy: 3,
            showinfo: 1,
            controls: 1
          },

          height: scope.height,
          width: scope.width,
          videoId: scope.videoid, 
        });
      }

      scope.$watch('videoid', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }

        player.cueVideoById(scope.videoid);

      }); 

      scope.$watch('height + width', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }

        player.setSize(scope.width, scope.height);

      });
    }  
  };
});