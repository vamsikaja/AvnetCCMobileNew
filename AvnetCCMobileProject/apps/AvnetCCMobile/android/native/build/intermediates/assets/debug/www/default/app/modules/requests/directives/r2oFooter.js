
/* JavaScript content from app/modules/requests/directives/r2oFooter.js in folder common */
/**
 * r2o-footer Directive 
 * Adds styled footer to the view
 */
(function(){
	'use strict';
	
	angular.module("ccMobile.requests")
		.directive('r2oFooter', r2oFooter);
	
	function r2oFooter(){
		return {
			transclude: true,
			restrict : "E", 
			template : "        <div ng-transclude>" +  
				       "        </div>"
		};
	}
})();