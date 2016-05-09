/**
*  loginCacheService Service 
*
* Description: Provides Methods for saving, getting and deleting login Tokens
*/
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.factory('loginCacheService', loginCacheService);
	
	function loginCacheService(){
		var loginCacheService = {
			saveLoginToken : saveLoginToken,
			getLoginToken : getLoginToken,
			deleteTokens : deleteTokens
		};
		
		/**
		 *   function save login Tokens
		 *   @param cookie 
		 *   @param sessionId 
		 *   @param emailAddress 
		 */
		function saveLoginToken(cookie, sessionId, emailAddress){
			localStorage.setItem("cookie", cookie);
			localStorage.setItem("sessionId", sessionId);
			localStorage.setItem("emailAddress", emailAddress);
		}
		
		/**
		 *   function get login Tokens
		 */
		function getLoginToken(){
			var cookie = (localStorage.getItem("pdhSessionId")||"")+','+(localStorage.getItem("pdId")||"")+','+(localStorage.getItem("bigIpCookie")||"");
			return {
				"cookie" : cookie,
				"sessionId" : localStorage.getItem("sessionId"),
				"emailAddress" : localStorage.getItem("emailAddress")
			};
		}
		
		/**
		 *   function delete login Tokens
		 */
		function deleteTokens(){
			localStorage.removeItem("cookie");
			localStorage.removeItem("sessionId");
			localStorage.removeItem("emailAddress");
		}
		
		return loginCacheService;
	}
})();