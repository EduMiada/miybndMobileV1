angular.module('miybndMobile.services')

.factory('User', function($http,$q, $localstorage, SERVER, $ionicLoading, $cordovaOauth, Spotify){
	
	var o = {
			id: false,
			token: false,
			picture:false,
            pictureSmall:false,
			username: false,
			displayName: false,
			bandId:false,
			bandName:false,
			deviceId:false,
			bands: [],
            fb:false,
            facebookToken:false,
            spotifyToken:false,
            profile: {about:'', instrument:'', experience:'', styles:[], influencies:[]},
            contact: {bio:'', city:'', area:'', zip:''},
            channels: [{channel:'', name:'', url:''}]
	}
	
	// attempt login or signup
	o.authenticate = function(credentials) {
		return $http.post(SERVER.API_URL + SERVER.API_AUTHENTICATE, credentials )
			.success(function(response){
				console.log('autenticado', response);
				o.setSessionAPI(response);			
                console.log('setsession fim');		
		});
	};
    
    o.authenticateFacebook = function(){
  
  
  var defer = $q.defer();

  //This method is executed when the user press the "Login with facebook" button
 
    facebookConnectPlugin.getLoginStatus(function(success){
     if(success.status === 'connected'){
        // the user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        var ret =  $http.post(SERVER.API_URL + SERVER.API_AUTH_FACEBOOK, {token: success.authResponse.accessToken} )
			.success(function(response){
                $ionicLoading.hide();
				o.setSessionAPI(response);			
                defer.resolve(true);
                return defer.promise;
		});
        

     } else {
        //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
        //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
        $ionicLoading.show({template: 'Logging in...'});

        //ask the permissions you need. You can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], 
            //This is the success callback from the login method
            function(response){
             
                if (!response.authResponse){
                    alert("Cannot find the authResponse");
                    $ionicLoading.hide();
                    defer.resolve(false);
                    return defer.promise;
                }
                
                var ret = $http.post(SERVER.API_URL + SERVER.API_AUTH_FACEBOOK, {token: response.authResponse.accessToken} )
                    .success(function(response){
                        o.setSessionAPI(response);			
                        $ionicLoading.hide();
                        defer.resolve(true);
                        return defer.promise;
                });

                
                $ionicLoading.hide();
                return defer.promise;
            }, 

              //This is the fail callback from the login method
            function(error){       
                console.log('fbLoginError', error);
                $ionicLoading.hide();
                defer.resolve(false);
            });
     }
    });
    
    return defer.promise;
  };
 
 
    //connect with spotify account and save to the user profile
    o.connectSpotify = function(){
      return $cordovaOauth.spotify(SERVER.API_SPOTIFY_CLIENT_ID, ['user-read-email', 'user-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private'],{response_type:'code'} )
      .then(function(result) {
      
        //send code to server to create token and save to user profile
        $http.post(SERVER.API_URL  + SERVER.API_USERS + '/' + o.id + SERVER.API_SPOTIFY_CONNECT, {spotifyprofile:result } )
            .success(function(response){
            o.setSessionAPI(response);
            Spotify.setAuthToken(o.spotifyToken);
            
            alert('successfuly connected to spotify ');
        });
        
       // $scope.updateInfo();
      }, function(error) {
          alert("Could not connect to spotify" + error);
      });
    
    };
    
    
    o.disconnectSpotify = function(){
        var url = SERVER.API_URL +  SERVER.API_USERS + '/' + o.id + SERVER.API_USERS_ACCOUNTS;
 
        //send code to server to create token and save to user profile
        return $http.delete(url, {params:{provider:'spotify'}})
            .success(function(response){
             
                
                var user = $localstorage.getObject('user');
                
                console.log('user antes', user);
                
                try {
                    if (user.data.additionalProvidersData['spotify']) delete user.data.additionalProvidersData['spotify'];
                } catch (error) {
                    console.log('error', error);
                    o.spotifyToken = false;
                }
                
                console.log('user deis', user);
                
                return o.setSessionAPI(user);
        
             
        });
        
    };
    
     //update profile
	o.loadProfile = function() {
        var url = SERVER.API_URL +  SERVER.API_USERS + '/' + o.id + SERVER.API_USER_PROFILE;
        
        return $http.get(url)
            .success(function(response){
                o.profile = response.data.profile;
                if (!o.profile.styles) o.profile.styles=[];
                if (!o.profile.influencies) o.profile.influencies=[];
             
                o.contact = response.data.contact;
                o.channels = response.data.channels;
            })
            .error(function(err){
                return err;
            });
        
        
        
	};
    
    
    //update profile
	o.updateProfile = function(profile, contact, channels) {
        var defer = $q.defer();
        var url = SERVER.API_URL +  SERVER.API_USERS + '/' + o.id + SERVER.API_USER_PROFILE;
        
        var ret = $http.post(url, {profile:profile, contact:contact, channels:channels} )
			.success(function(response){
                
                alert(response.success);
                //var user = $localstorage.getObject('user');
                        
                //if (user.token) {					
                //    o.picture = picture;
                //    user.picture = picture;     
                //    $localstorage.setObject('user',  user );
                //}		
                
                defer.resolve(true);
                return defer.promise;
            })
            .error(function(err){
            	defer.resolve(false);
                return defer.promise;
            });
        
        
    	return defer.promise;
        
        
        
	};
    
  
  // attempt login or signup
	o.setProfilePicture = function(picture) {
        var defer = $q.defer();
        var url = SERVER.API_URL +  SERVER.API_USERS + '/' + o.id + SERVER.API_USER_PICTURE;
        
        var ret = $http.post(url, {picture: picture} )
			.success(function(response){
                var user = $localstorage.getObject('user');
                        
                if (user.token) {					
                    o.picture = picture;
                    user.picture = picture;     
                    $localstorage.setObject('user',  user );
                }		
                
                defer.resolve(true);
                return defer.promise;
            })
            .error(function(err){
            	defer.resolve(false);
                return defer.promise;
            });
        
        
    	return defer.promise;
        
        
        
	};
	
	//change current band
	o.setCurrentBand = function(bandID) {
		var url = SERVER.API_URL +  SERVER.API_USERS + '/' + o.id + SERVER.API_CURRENT_BAND;
		return $http.put(url, {newCurrentBand:bandID} )
			.success(function(response){
				
				o.setSessionAPI(response);		
							
		});
	};
	
	
	o.setPushDeviceID = function(id) {
		o.deviceId = id;
		var url = SERVER.API_URL +  SERVER.API_USERS + '/' + id;
		return $http.put(url, {pushDeviceId:id} )
			.success(function(response){
		///		o.setSessionAPI(response);					
		});
	};
   
  
	
	// set session data
  	o.setSessionAPI = function(user) {
    	if (user.data._id) o.id = user.data._id;
		if (user.token) o.token = user.token;
		if (user.data.username) o.username = user.data.username;
		if (user.data.displayName) o.displayName = user.data.displayName;
		if (user.data.picture) o.picture = user.data.picture;    	
    	if (user.data.selectedBand) o.bandId = user.data.selectedBand._id;
		if (user.data.selectedBand) o.bandName = user.data.selectedBand.name;
		if (user.data.bands) o.bands = user.data.bands;
        
        // Check if provider is already in use with current user
	//	$scope.isConnectedSocialAccount = function(provider) {
			
			//alert($scope.user.additionalProvidersData[provider]);
	//		return $scope.authentication.user.provider === provider || ($scope.authentication.user.additionalProvidersData && $scope.authentication.user.additionalProvidersData[provider]);
	//	};
	
        
        
        try {
             if (user.data.providerData.accessToken) o.facebookToken = user.data.providerData.accessToken;
        } catch (error) {
            o.facebookToken = false;
        }
       
        try {
           if (user.data.additionalProvidersData['spotify'].accessToken) o.spotifyToken = user.data.additionalProvidersData['spotify'].accessToken;
        } catch (error) {
            o.spotifyToken = false;
        }
        
		
		// Set the token as header for your requests!
    	$http.defaults.headers.common['x-access-token'] = o.token;
		
	    // set data in localstorage object
    	$localstorage.setObject('user',  user );
		
		//console.log('setsession new user', user);
	};
	
	 // check if there's a user session present
  	o.checkSession = function() {
		var defer = $q.defer();
			if (o.token) {
				// if this session is already initialized in the service
				defer.resolve(true);
		
			} else {
				// detect if there's a session in localstorage from previous use.
				// if it is, pull into our service
				var user = $localstorage.getObject('user');
				if (user.token) {					
					o.setSessionAPI(user);
						defer.resolve(true);			
				} else {
					// no user info in localstorage, reject
					defer.resolve(false);
				}
			
			}

    	return defer.promise;
  	}; //check session
	
	// wipe out our session data
	o.destroySession = function() {
		$localstorage.setObject('user', {});
		$http.defaults.headers.common['x-access-token'] = undefined;
		o.id = false;
		o.token= false;
		o.avatar=false;
		o.username= false;
		o.bandId = false;
		o.bandName = false
	};
	
	return o;	
});