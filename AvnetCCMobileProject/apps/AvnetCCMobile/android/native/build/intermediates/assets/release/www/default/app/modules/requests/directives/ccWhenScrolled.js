
/* JavaScript content from app/modules/requests/directives/ccWhenScrolled.js in folder common */

/**
 * 
 */
(function(){
	"use strict";

	angular.module("ccMobile.requests")
		.directive('whenScrolled', function() {
			console.log('scroll running');
		    return function(scope, elm, attr) {
		        var raw = elm[0];
		    	console.log('whenScrolled running');
		        
		        elm.bind('scroll', function() {
		            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
		                scope.$apply(attr.whenScrolled);
		            }
		        });
		    };
		});

})();

