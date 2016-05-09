/**
*  favoriteEndUsers Service 
*
* Description: Provides Metods for adding, removing and getting the favorite Endusers of Loggedin user
*/

(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
	.factory('favoriteEndUsers', favoriteEndUsers);
	
	favoriteEndUsers.$inject = ['$q'];
	function favoriteEndUsers($q){

		var favoriteEndUsers = {
			"addEndUser" : addEndUser,
			"removeEndUser" : removeEndUser,
			"getFavoriteEndUsers" : getFavoriteEndUsers
		};
		
		/**
		 *   function to add end user as favorite
		 *	 @param user - End user to be added to favorite endusers list
		 */
		function addEndUser(user){
			var defered = $q.defer();

			user.loginId = localStorage.getItem("LoginId")+"";
			getEndUser(parseInt(user.PartnerId))
			.then(function(users){
				if(users.length == 0){
					WL.JSONStore.get("favoriteEndUser").add(user)
					.then(function(){
						defered.resolve();
					}, function(){
						defered.resolve();
					});
				}
			}, function(){
				WL.JSONStore.get("favoriteEndUser").add(user)
				.then(function(){
					defered.resolve();
				}, function(){
					defered.resolve();
				});
			});
			return defered.promise;
		}
		
		/**
		 * 	function to get EndUser
		 *	@param PartnerId - End user with given PartnerId is returned
		 */
		function getEndUser(PartnerId){
			var defered = $q.defer();
			
			var collectionName = 'favoriteEndUser';
			var loginId = localStorage.getItem("LoginId")+"";
			
			WL.JSONStore.get(collectionName)
			.find({'PartnerId':PartnerId, "loginId" :loginId}, {})
			.then(function (results) {
				defered.resolve(results);
			})
			.fail(function (errorObject) {
				defered.reject();
			});
			
			return defered.promise;
		}
		
		/**
		 *  Removes provided end user from favorite end users list
		 *	@param user - End user to be removed from favorites list
		 */
		function removeEndUser(user){
			var defered = $q.defer();

			getEndUser(parseInt(user.PartnerId))
			.then(function(users){
				if(users.length != 0){
					WL.JSONStore.get("favoriteEndUser").remove(users)
					.then(function(){
						defered.resolve();
					}, function(){
						defered.resolve();
					});
				}else{
					defered.resolve();
				}
			}, function(){
				defered.resolve();
			});
			return defered.promise;
		}
		
		/**
		 *  Returns all the stored favorite end users of the loggedin User
		 */
		function getFavoriteEndUsers(){
			var defered = $q.defer();
			
			var loginId = localStorage.getItem("LoginId")+"";
			WL.JSONStore.get("favoriteEndUser")
			.find({'loginId':loginId}, {})
			.then(function (results) {
				defered.resolve(results.map(function(e){ return e.json;}));
			})
			.fail(function (errorObject) {
				defered.reject();
			});
			return defered.promise;
		}
		
		return favoriteEndUsers;
	}

})();