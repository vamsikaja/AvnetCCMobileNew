
/* JavaScript content from app/modules/requests/directives/r2oWebViewUtils.js in folder common */
/** Contains r2o-webview-back, r2o-webview-forward, r2o-webview-close and r2o-webview-open directives */
(function(){
	"use strict";
	
	angular.module("ccMobile.requests")
		.directive('r2oWebviewBack', r2oWebviewBack)
		.directive('r2oWebviewForward', r2oWebviewForward)
		.directive('r2oWebviewClose', r2oWebviewClose)
		.directive('r2oWebviewOpen', r2oWebviewOpen);
		
		/**
		 * r2o-webview-back Directive 
		 * Its an attribute directive. When this directive is used as an attribute to an element, the click on 
		 * the element makes the webview go back
		 */
		function r2oWebviewBack(){
			return {
				restrict : "A",
				link: function(scope, element, attrs){
						element.on('click', function(){
							window.shopWebViewOverlay.goBack();
		                });
	            	}
			};
		}
		
		/**
		 * r2o-webview-forward Directive 
		 * Its an attribute directive. When this directive is used as an attribute to an element, the click on 
		 * the element makes the webview go forward
		 */
		function r2oWebviewForward(){
			return {
				restrict : "A",
				link: function(scope, element, attrs){
						element.on('click', function(){
							window.shopWebViewOverlay.goForward();
		                });
	            	}
			};
		}
		
		/**
		 * r2o-webview-close Directive 
		 * Its an attribute directive. When this directive is used as an attribute to an element, the click on 
		 * the element will close the webview overlay
		 */
		function r2oWebviewClose(){
			return {
				restrict : "A",
				link: function(scope, element, attrs){
						element.on('click', function(){
							window.shopWebViewOverlay.close();
		                });
	            	}
			};
		}
		
		/**
		 * r2o-webview-open Directive 
		 * Opens webview with the provided URL
		 */
		function r2oWebviewOpen(){
			return {
				restrict : "A",
				link: function(scope, element, attrs){
						element.on('click', function(){
							setTimeout(function(){
								window.shopWebViewOverlay.goToPage(attrs.url);
							}, 200);
		                });
	            	}
			};
		}
})();