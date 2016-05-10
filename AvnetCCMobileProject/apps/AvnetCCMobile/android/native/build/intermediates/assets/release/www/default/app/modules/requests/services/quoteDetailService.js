
/* JavaScript content from app/modules/requests/services/quoteDetailService.js in folder common */
var quoteDetailResp;
/**
*  Quote Detail Service
*
*  Provides methods for getting Quote Detail Data, editing Request Name, editing End User and Adding Notes
*/
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
	.factory('quoteDetailFactory', quoteDetailFactory);
	quoteDetailFactory.$inject = ['$q', 'loginCacheService', 'quoteDetailCacheService', 'loadingOverlayService'];
	
	function quoteDetailFactory($q, loginCacheService,quoteDetailCacheService,loadingOverlayService){
		
		var quoteDetailFactory={
			loadQuoteDetailData : loadQuoteDetailData,
			getQuoteLineData : getQuoteLineData,
			editRequestName: editRequestName,
			addNote: addNote,
			editEndUser : editEndUser
		};
		
		/** Loads Quote Detail Data for the provided requestRevisionSK 
		* 	@param requestRevisionSK - requestRevisionSK of Request to get the details
		*/
		function loadQuoteDetailData(requestRevisionSK){
			var defered = $q.defer();
			var tryCount = 0;
			function getQuoteDetailSuccessCB(response){
				quoteDetailResp = response;
				if(response.invocationResult.cookie != undefined)
					addCookieValues(response.invocationResult.cookie);
				if(response.invocationResult.isSuccessful == true){
					if(response.invocationResult.data.statusCode != 200){
						if(response.invocationResult.data.statusCode == 403){
							loadingOverlayService.hide();
							defered.reject(response.invocationResult.data.message);
						}else{
							if(tryCount < 3){
								tryCount = tryCount + 1;
								WL.Client.invokeProcedure(invocationData, options);							
							}else{
								loadingOverlayService.hide();
								defered.reject('Service unavailable');
							}
						}
					}else{
						loadingOverlayService.hide();
						console.log('response.invocationResult.data.statusCode == 200');
						/*quoteDetailCacheService.updateQuoteDetail(response.invocationResult.data, requestRevisionSK)
						.then(function(){
							console.log('quoteDetailCacheService.updateQuoteDetail success method');
							loadingOverlayService.hide();
							defered.resolve(response.invocationResult.data);
						}, function(){
							console.log('quoteDetailCacheService.updateQuoteDetail failure method');
							loadingOverlayService.hide();
							defered.reject('Offline error');
						});*/
						defered.resolve(response.invocationResult.data);
					}
				}else{
					loadingOverlayService.hide();
					defered.reject("Service unavailable");
				}
			}
			function getQuoteDetailFailureCB(error){
				loadingOverlayService.hide();
				defered.reject("no network");
			};
			
			var authCredentials = loginCacheService.getLoginToken();
			
			var invocationData = {
			    adapter : 'QuotesAdapter',
			    procedure : 'getQuotesDetails',
			    parameters : [authCredentials.cookie,authCredentials.sessionId, requestRevisionSK, true]
			};
			var options = {
			    onSuccess : getQuoteDetailSuccessCB,
			    onFailure : getQuoteDetailFailureCB,
			    invocationContext: {}
			};
			
			loadingOverlayService.show();
			WL.Client.invokeProcedure(invocationData, options);
			return defered.promise;
		};
		
		/** Gets The Quote Line Data  */
		function getQuoteLineData(quoteNumber, quoteRevisionNumber){
			var defered = $q.defer();
			var authCredentials = loginCacheService.getLoginToken();
			
			var invocationData = {
			    adapter : 'QuotesAdapter',
			    procedure : 'getLineItems',
			    parameters : [authCredentials.cookie,authCredentials.sessionId, quoteNumber, quoteRevisionNumber]
			};
			
			function getLineDataSuccessCB(response){
				if(response.invocationResult.cookie != undefined)
					addCookieValues(response.invocationResult.cookie);
				loadingOverlayService.hide();
				if(response.invocationResult.isSuccessful == true){
					defered.resolve(response.invocationResult.lineItems);
				}else{
					defered.reject("service error");
				}
			}
			
			function getLineDataFailureCB(error){
				loadingOverlayService.hide();
				defered.reject();
			}
			
			var options = {
			    onSuccess : getLineDataSuccessCB,
			    onFailure : getLineDataFailureCB,
			    invocationContext: {}
			};
			
			loadingOverlayService.show();
			WL.Client.invokeProcedure(invocationData, options);
			return defered.promise;
		};
		
		/** Edits Request Name for provided requestSk 
		*	@param requestSk - requestSk of Request
		*	@param newRequestName - newRequestName of Request
		*/
		function editRequestName(requestSk, newRequestName){
			var defered = $q.defer();
			//alert ("in service. sk: " + requestSk + ". New requestnName: " + newRequestName);
			var authCredentials = loginCacheService.getLoginToken();
			
			var invocationData = {
			    adapter : 'QuotesAdapter',
			    procedure : 'editRequestName',
			    parameters : [authCredentials.cookie,authCredentials.sessionId, requestSk, newRequestName]
			};
			
			function editRequestNameSuccessCB(response){
				addCookieValues(response.invocationResult.cookie);
				loadingOverlayService.hide();
				//alert("in success");
				if(response.invocationResult.isSuccessful == true){
					//defered.resolve(response.invocationResult.lineItems);
					defered.resolve(response);
				}else{
					defered.reject("service error");
				}
			}
			
			function editRequestNameFailureCB(error){
				loadingOverlayService.hide();
				//alert("in failure: " + JSON.stringify(error));
				defered.reject();
			}
			
			var options = {
			    onSuccess : editRequestNameSuccessCB,
			    onFailure : editRequestNameFailureCB,
			    invocationContext: {}
			};
			
			loadingOverlayService.show();
			WL.Client.invokeProcedure(invocationData, options);
			return defered.promise;
		};
		
		/** Add Notes for Request 
		*	@param requestSk - requestSk of Request
		*	@param noteText - noteText of note to be added to Request
		*	@param recipients - recipients for which notification should be sent
		*	@param adHocRecipients - adHocRecipients 
		*/
		function addNote(requestSk, noteText, recipients, adHocRecipients){
			var defered = $q.defer();
			//alert ("in addnote service. sk: " + requestSk + ". New note: " + noteText);
			var authCredentials = loginCacheService.getLoginToken();
			
			var invocationData = {
			    adapter : 'QuotesAdapter',
			    procedure : 'addNote',
			    parameters : [authCredentials.cookie,authCredentials.sessionId, requestSk, noteText, JSON.stringify(recipients), JSON.stringify(adHocRecipients)]
			};
			
			function addNoteSuccessCB(response){
				addCookieValues(response.invocationResult.cookie);
				loadingOverlayService.hide();
				if(response.invocationResult.isSuccessful == true){
					defered.resolve(response);
				}else{
					defered.reject("service error");
				}
			}
			
			function addNoteFailureCB(error){
				loadingOverlayService.hide();
				//alert("in failure: " + JSON.stringify(error));
				defered.reject();
			}
			
			var options = {
			    onSuccess : addNoteSuccessCB,
			    onFailure : addNoteFailureCB,
			    invocationContext: {}
			};
			
			loadingOverlayService.show();
			WL.Client.invokeProcedure(invocationData, options);
			return defered.promise;
		}

		/** Edits EndUser of the Request 
		*	requestJson - data containing new end user
		*	requestSk - requestSk of Request
		*/
		function editEndUser(requestJson,requestSk){
			//requestJson=JSON.stringify(requestJson);
			var defered = $q.defer();
			var authCredentials = loginCacheService.getLoginToken();
			
			var invocationData = {
			    adapter : 'QuotesAdapter',
			    procedure : 'editEndUser',
			    parameters : [authCredentials.cookie,authCredentials.sessionId, JSON.stringify(requestJson), requestSk]
			};
			
			function editEndUserSuccessCB(response){
				addCookieValues(response.invocationResult.cookie);
				loadingOverlayService.hide();
				//alert("in success");
				if(response.invocationResult.isSuccessful == true){
					//defered.resolve(response.invocationResult.lineItems);
					defered.resolve(response);
				}else{
					defered.reject("service error");
				}
			}
			
			function editEndUserFailureCB(error){
				loadingOverlayService.hide();
				defered.reject();
			}
			
			var options = {
			    onSuccess : editEndUserSuccessCB,
			    onFailure : editEndUserFailureCB,
			    invocationContext: {}
			};
			
			loadingOverlayService.show();
			WL.Client.invokeProcedure(invocationData, options);
			return defered.promise;
			
		}
		return quoteDetailFactory;
	}
})();