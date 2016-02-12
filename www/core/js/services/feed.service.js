angular.module('miybndMobile.services')
.factory('Feed', function($http,$q, $localstorage, SERVER, User){
	
	var o = {
			id: false
	}
	
	//GET GENERAL FEEDS
	o.getBandFeeds = function(){	
		var url = User.bandId + SERVER.API_FEEDS;

		return $http.get(SERVER.API_URL + '/' + url)
			.success(function(response){
				return response;
			})
			.error(function (err){
				return err;
			});
	};
	
	
	//ADD FEED COMMENTS
	o.addFeedComments = function(feedID, userComments){	
		console.log(userComments);
		
		var url = User.bandId + SERVER.API_FEEDS + '/' + feedID + SERVER.API_FEED_COMMENT;

		return $http.post(SERVER.API_URL + '/' + url, {comments: userComments})
			.success(function(response){
				return response;
			})
			.error(function (err){
				return err;
			});
	};
	
	return o;	
});