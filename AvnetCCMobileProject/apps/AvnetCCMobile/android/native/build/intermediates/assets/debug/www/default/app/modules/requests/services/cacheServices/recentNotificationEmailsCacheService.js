
/* JavaScript content from app/modules/requests/services/cacheServices/recentNotificationEmailsCacheService.js in folder common */
/**
*  recentNotificationEmails Service 
* 
* Description: Provides methods for getting Recent Notification emails List and adding Emails to it
*/
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
	.factory('recentNotificationEmails', recentNotificationEmails);
	
	recentNotificationEmails.$inject = ['$q'];
	function recentNotificationEmails($q){

		var recentNotificationEmails = {
			"addEmail" : addEmail,
			"getRecentEmails" : getRecentEmails
		};
		
		/**
		 *   function to add email to Recent Notification Emails List
		 *   @param emailId - emailId to be added to Recent Notification Emails List
		 */
		function addEmail(emailId){
			var defered = $q.defer();
			var email = {
				"email" : emailId,
				"loginId" : localStorage.getItem("LoginId")+""
			};
						
			getEmail(emailId)
			.then(function(emails){
				if(emails.length == 0){
					WL.JSONStore.get("recentNotificationEmails").add(email)
					.then(function(){
						defered.resolve();
					}, function(){
						defered.resolve();
					});
				}
			}, function(){
				WL.JSONStore.get("recentNotificationEmails").add(email)
				.then(function(){
					defered.resolve();
				}, function(){
					defered.resolve();
				});
			});
			return defered.promise;
		}
		
		/**
		 *   function to get email from Recent Notification Emails List
		 *   @param emailId - emailId to get from Recent Notification Emails List
		 */
		function getEmail(emailId){
			var defered = $q.defer();
			
			var collectionName = 'recentNotificationEmails';
			var loginId = localStorage.getItem("LoginId")+"";
			
			WL.JSONStore.get(collectionName)
			.find({'email':emailId, "loginId" :loginId}, {exact:true})
			.then(function (results) {
				defered.resolve(results);
			})
			.fail(function (errorObject) {
				defered.reject();
			});
			
			return defered.promise;
		}
		
		
		/**
		 *   function to get Recent Notification Emails List
		 */
		function getRecentEmails(){
			var defered = $q.defer();
			
			var loginId = localStorage.getItem("LoginId")+"";
			
			WL.JSONStore.get("recentNotificationEmails")
			.find({'loginId':loginId}, {exact:true})
			.then(function (results) {
				defered.resolve(results.map(function(e){ return e.json;}));
			})
			.fail(function (errorObject) {
				defered.reject();
			});
			return defered.promise;
		}
		
		return recentNotificationEmails;
	}

})();