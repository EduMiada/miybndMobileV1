angular.module('miybndMobile.services', [])

.factory('Camera', ['$q', function($q) {

    return {
        getPicture: function(options) {
            var q = $q.defer();
            
            if (!options){


    
    

                options = {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: navigator.camera.EncodingType.JPEG,
                    //targetWidth: 100,
                    //targetHeight: 100,
                    saveToPhotoAlbum: false,
                    correctOrientation:true
                };                
                
            }

            navigator.camera.getPicture(function(result) {
            // Do any magic you need
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);

            return q.promise;
    },
    
        getGalery: function(options) {
            var q = $q.defer();
            
            if (!options){

                options = {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: navigator.camera.EncodingType.JPEG,
                    //targetWidth: 100,
                    //targetHeight: 100,
                    saveToPhotoAlbum: false,
                    correctOrientation:true
                };                
                
            }

            navigator.camera.getPicture(function(result) {
            // Do any magic you need
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);

            return q.promise;
    }
  }
  
}]);

/*



    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });*/