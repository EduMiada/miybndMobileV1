angular.module('miybndMobile.services')
.factory('Util', function(){
	
	var o = {
			instrumentList: [{code:'GUITAR',name:'Guitar'}, {code:'BASS',name:'Bass'}],
            channelList: [{code:'YOUTUBE', name:'YouTube'}, {code:'SUNDCLOUD', name: 'SoundCloud'}]
	}
	
	return o;	
    
});