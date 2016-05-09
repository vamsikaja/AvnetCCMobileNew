/**
*  Login Service
*
*  Provides Login and Logout methods
*/
(function(){
	'use strict';
	
	angular.module('ccMobile')
	.factory('loginFactory',loginFactory);
	
	function loginFactory($q, loginCacheService, loadingOverlayService, filterPreferences){
		var loginFactory={
				login : login,
				logout: logout
		};
		
		/**  Login Method 
		*	 @param userName - userName of the login
		*	 @param password - password of the login
		*/
		function login(userName,password){
			var defered = $q.defer();
			var invocationData = {
			    adapter : 'LoginAdapter',
			    procedure : 'login',
			    parameters : [userName,password]
			};
			var options = {
			    onSuccess : success,
			    onFailure : failure,
			    invocationContext: {}
			};
			
			function success(result){
				if(result.invocationResult.isLoggedInUser == true){
					loginCacheService.saveLoginToken(result.invocationResult.cookie, result.invocationResult.sessionId);
					console.log("login service success");
					loadingOverlayService.hide();
					defered.resolve();
				}else{
					console.log("login service password error");
					loadingOverlayService.hide();
					defered.reject("Incorrect username or password..!");
				}
			}
			
			function failure(){
				console.log("login service unavailable");
				loadingOverlayService.hide();
				defered.reject("Service unavailable");
			}
			loadingOverlayService.show();
			WL.Client.invokeProcedure(invocationData, options);
			return defered.promise;
		}

		/** Logout Method */
		function logout(){
			console.debug("inside logout service method");
			loadingOverlayService.show();
			var defered = $q.defer();
			var invocationData = {
			    adapter : 'LoginAdapter',
			    procedure : 'logout',
			    parameters : ["",""]
			};
			var options = {
				    onSuccess : success,
				    onFailure : failure,
				    invocationContext: {}
				};
			
			function success(result){
					console.log("logout service success");
					loadingOverlayService.hide();
					defered.resolve();
					console.debug("inside the logout");
					WL.Client.logout("HeaderAuthRealm",{
						onSuccess: function(){
							var reqURL = '/../../..'+'/pkmslogout';
						    var options = {};
						    HeaderAuthRealmChallengeHandler.submitLoginForm(reqURL, options, HeaderAuthRealmChallengeHandler.handleChallenge);
						    filterPreferences.filters = angular.copy(['-json.ApplUpdateDT']);
						    filterPreferences.limitTo = 20;
						}, 
						onFailure: function(){
							loadingOverlayService.hide();
						}
					});	
			}
			
			function failure(error){
				console.log("logout service unavailable : error :", error);
				loadingOverlayService.hide();
				defered.reject("Service unavailable");
			}
			
			WL.Client.invokeProcedure(invocationData, options);
			return defered.promise;
				
		}
		return loginFactory;
	}
})();