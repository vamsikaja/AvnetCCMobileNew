
/* JavaScript content from app/modules/requests/directives/r2oFilterItem.js in folder common */
/**
 * r2o-filter-item Directive 
 * Adds styled filter item
 */
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
	.directive('r2oFilterItem', r2oFilterItem);
	
	function r2oFilterItem(){
		return {
			restrict : "E", 
			scope : {
				title : "@"
			},
			template : "        <div>" + 
					   "           <div class='filterCheck'></div>" +
					   "            <h1 class='filterTitle'>{{title}}</h1>" +
				       "        </div>"
		};
	}
})();