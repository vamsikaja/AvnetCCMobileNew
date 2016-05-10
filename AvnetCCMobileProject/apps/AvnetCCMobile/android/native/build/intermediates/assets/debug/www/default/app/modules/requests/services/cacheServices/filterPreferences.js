
/* JavaScript content from app/modules/requests/services/cacheServices/filterPreferences.js in folder common */
/**
*  filterPreferences Service 
*
* Description: Contains initial filter preferences of Quotes
*/

(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
	.factory('filterPreferences', filterPreferences);
	
	function filterPreferences(){
		var filterPreferences = {
			filters : ['-json.ApplUpdateDT'],
			limitTo : 20
		};
		
		return filterPreferences;
	}

})();