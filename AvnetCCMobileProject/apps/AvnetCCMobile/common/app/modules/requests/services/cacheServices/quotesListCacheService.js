/**
*  quoteListCacheService Service 
*
* Description: Provides methods for getting cached RequestsList and updating the cached RequestsList
*/
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.factory('quoteListCacheService',quoteListCacheService);
	
	quoteListCacheService.$inject = ['$q'];
	
	function quoteListCacheService($q){
		var quoteListCacheService = {
				'getQuotes' : getQuotes,
				'updateQuotes' : updateQuotes
		};
		
		/**
		 *   function to get RequestsList
		 */

		function getQuotes(){
			var defered = $q.defer();

			WL.JSONStore.get("quotes")
			.findAll()
			.then(function (results) {
				defered.resolve(results);
			})
			.fail(function (errorObject) {
				defered.reject();
			});
			return defered.promise;
		}
		
		/**
		 *   function to update cached RequestsList
		 *   @param data - updated data of the RequestsList
		 */
		function updateQuotes(data){
			var defered = $q.defer();
			for(var i=0; i < data.length; i++){
				if(data[i].ApplCreateDT != null){
					data[i].ApplCreateDT = (new Date(data[i].ApplCreateDT.split("T")[0])).getTime();
				}	
				if(data[i].ApplUpdateDT != null){
					data[i].ApplUpdateDT = (new Date(data[i].ApplUpdateDT.split("T")[0])).getTime();
				}
				if(data[i].WorkflowStatusTX != null){
					//data[i].WorkflowStatusTX = data[i].WorkflowStatusTX.split("/")[1] || data[i].WorkflowStatusTX;
				}else{
					data[i].WorkflowStatusTX = undefined;
				}
			}
			var changeOptions = {
				    'replaceCriteria' : ['RequestNO'],
				    'addNew' : true,
				    'markDirty' : false
				  };
			
			WL.JSONStore.get("quotes")
			.clear()
			.then(function(){
				addData();
			})
			.fail(function (errorObject) {
				addData();
			});
			
			function addData(){
				WL.JSONStore.get("quotes").change(data, changeOptions)
				.then(function () {
					defered.resolve();
				})
				.fail(function (errorObject) {
					defered.reject("offline data failed");
				});
			}
			
			return defered.promise;
		}
		
		return quoteListCacheService;
	}
})();