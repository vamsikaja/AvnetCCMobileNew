/**
 * r2o-content Directive 
 * Content of the view should be added in this directive
 */
(function(){
	'use strict';
	
	angular.module("ccMobile.requests")		
		.directive('r2oContent', r2oContent);
	
	function r2oContent(){
		return {
			transclude: true,
			restrict : "E", 
			template : "        <div ng-transclude class='grid-block vertical'>" +  
				      "        </div>"
		};
	}
})();