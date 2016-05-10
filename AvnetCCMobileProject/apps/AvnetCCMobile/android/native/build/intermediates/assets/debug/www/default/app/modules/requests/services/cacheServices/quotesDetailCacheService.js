
/* JavaScript content from app/modules/requests/services/cacheServices/quotesDetailCacheService.js in folder common */
/**
*  quoteDetailCacheService Service 
*
* Description: Provides methods for getting cached QuoteDetail and updating the cached Quote Detail
*/
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.factory('quoteDetailCacheService',quoteDetailCacheService);
	
	quoteDetailCacheService.$inject = ['$q'];
	function quoteDetailCacheService($q){
		var quoteDetailCacheService = {
				'getQuoteDetail' : getQuoteDetail,
				'updateQuoteDetail' : updateQuoteDetail
		};
		
		/**
		 *   function to get cached Quote Detail
		 *   @param requestRevisionSK - requestRevisionSK of the Request
		 */
		function getQuoteDetail(requestRevisionSK){
			var defered = $q.defer();
			var collectionName = 'quoteDetails';
			WL.JSONStore.get(collectionName)
			.find({'RequestRevisionSK':requestRevisionSK}, {exact:true})
			.then(function (results) {
				defered.resolve(results);
			})
			.fail(function (errorObject) {
				defered.reject();
			});
			
			return defered.promise;
		}
		
		/**
		 *   function to get cached Quote Detail
		 *   @param quoteDetail - updated quoteDetail of the Request
		 *   @param requestRevisionSK - requestRevisionSK of the Request
		 */
		function updateQuoteDetail(quoteDetail, requestRevisionSK){
			var defered = $q.defer();
			
			quoteDetail.lastRefreshed = (new Date()).getTime();
			if(quoteDetail.entityFiles != null){
				for(var i=0; i < quoteDetail.entityFiles.length; i++){
					var date = new Date();
					var offset = date.getTimezoneOffset()*60*1000;
					quoteDetail.entityFiles[i].LastUpdate = (new Date(quoteDetail.entityFiles[i].LastUpdate)).getTime() + offset;
				}
			}
			var LoginId = localStorage.LoginId+"";
			var fullName = localStorage.FullName+"";
			if(quoteDetail.notes != null){
				for(var j=0; j < quoteDetail.notes.length; j++){
					var note = quoteDetail.notes[j];
					if(note.isInternalUser){
						if(note.CreateUserId == LoginId){
							quoteDetail.notes[j].CreateUserName = fullName;
						}
					}
				}
			}
			
			quoteDetail.RequestRevisionSK = parseInt(requestRevisionSK);
			if(quoteDetail.status != null){
				//quoteDetail.status = quoteDetail.status.split("/")[1];
			}
			
			
			getQuoteDetail(requestRevisionSK)
			.then(function(results){
				if(results.length > 0){
					console.log("replacing quote");
					results[0].json = quoteDetail;
					WL.JSONStore.get("quoteDetails").replace(results, {});
					defered.resolve();
				}else{
					console.log("adding quote");
					WL.JSONStore.get("quoteDetails").add(quoteDetail);
					defered.resolve();
				}
				
			}, function(){
				WL.JSONStore.get("quoteDetails").add(quoteDetail);
				defered.resolve();
			});
			
			return defered.promise;
		}
		
		return quoteDetailCacheService;
	}
})();