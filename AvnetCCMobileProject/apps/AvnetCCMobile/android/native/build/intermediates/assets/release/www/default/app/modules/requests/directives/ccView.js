
/* JavaScript content from app/modules/requests/directives/ccView.js in folder common */

/**
 * 
 */
(function(){
	"use strict";
	
	angular.module("ccMobile.requests")
		.controller('ccViewController', ['$rootScope','$scope','$state', function($rootScope,$scope, $state){
			$rootScope.$broadcast("changeNavTitle",$scope.title);

			$scope.$watch('title', function(newValue, oldValue){
				console.log('title changed', newValue, oldValue);
				$rootScope.$broadcast('changeNavTitle',$scope.title);
			});

		}])
		.directive('ccView', function(){
			return {
				transclude: true,
				restrict : "E",
				scope : {
					title : "@"
				},
				template : "<div class='av-custom-title-bar  grid-block'><div class='small-grid-block'></div><div class='grid-block'><h1>{{title}}</h1></div><div class='small-grid-block'></div></div>"+
				"<div ng-transclude class='grid-block vertical'>"+
				"</div>",
				controller : "ccViewController"
			};
		});

	

})();