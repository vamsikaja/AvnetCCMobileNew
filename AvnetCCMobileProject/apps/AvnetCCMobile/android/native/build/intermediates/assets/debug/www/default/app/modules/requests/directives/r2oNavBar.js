
/* JavaScript content from app/modules/requests/directives/r2oNavBar.js in folder common */
/** Contains r2o-nav-bar and r2o-nav-back directives */
(function(){
	'use strict';
	
	angular.module("ccMobile.requests")
	.directive('r2oNavBar', r2oNavBar)
	.directive('r2oNavBack', r2oNavBack);
	
	/**
	 * r2o-nav-bar Directive 
	 * Add a nav bar
	 */
	function r2oNavBar(){
		return {
			transclude: true,
			restrict : "E",
			template :"            <div class='pageTitle'>" + 
				      "                {{title}}" + 
				      "            </div>"
		};
	}
	
	r2oNavBack.$inject = ['$rootScope'];

	/**
	 * r2o-nav-back Directive 
	 * Its an attribute directive. When this directive is used as an attribute to an element, the click on the element 
	 * will broadcast the handleBack event which handle the back button functionality
	 */
	function r2oNavBack($rootScope){
		return {
			restrict : "A", 
			link: function(scope, element, attrs)
            {
				element.on('click', function(){
                	$rootScope.$broadcast("handleBack");
                });
            }
		};
	}
	
})();