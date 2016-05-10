
/* JavaScript content from app/modules/requests/directives/r2oSlideBox.js in folder common */
/** Contains r2o-slide-box and r2o-slide directives */
(function(){
	'use strict';
	
	angular.module("ccMobile.requests")	
	.controller('r2oSlideBoxController', r2oSlideBoxController)
	.directive('r2oSlideBox', r2oSlideBox)
	.controller('r2oSlideController',r2oSlideController)
	.directive('r2oSlide', r2oSlide);
	
	r2oSlideBoxController.$inject = ['$scope'];

	/** r2o-slide-box directive's controller */
	function r2oSlideBoxController($scope){
		$scope.windowWidth = window.innerWidth;
		$scope.slideBoxWidth = parseInt($scope.items) * window.innerWidth;
		$scope.goLeft = goLeft;
		$scope.goRight = goRight;
		window.onresize = resize;
		
		$scope.$watch('items', function(old, n){
			$scope.slideBoxWidth = parseInt($scope.items) * window.innerWidth;
		});
		
		function resize(){
			console.log("window resized");
			$scope.$apply(function(){
				$scope.windowWidth = window.innerWidth;
				$scope.slideBoxWidth = parseInt($scope.items) * window.innerWidth;
			});
		}
		
		function goLeft(){
			if($scope.swipe == "true"){
				if($scope.index.index < $scope.items){
					$scope.index.index = parseInt($scope.index.index)+1;				
				}
			}
		}
		
		function goRight(){
			if($scope.swipe == "true"){
				if($scope.index.index > 1){
					$scope.index.index = parseInt($scope.index.index)-1;
				}
			}
		}
	}
	
	/**
	 * r2o-slide-box Directive 
	 * Contains r2o-slide elements and provides methods to goLeft and goRight to move between r2o-slide elements 
	 */
	function r2oSlideBox(){
		return {
			transclude: true,
			controller : 'r2oSlideBoxController',
			restrict : "E",
			scope : {
				items : "=",
				index : "=",
				swipe : "@"
			},
			link : function(scope, element, attrs){
				scope.ele = document.getElementsByTagName("r2o-content")[0].children[0];
			},
			template : "<div ng-transclude class='slideBox' style='width:{{slideBoxWidth}}px; height:{{ele.clientHeight}}px; -webkit-transform:translateX(-{{(index.index-1)*windowWidth}}px); -ms-transform:translateX(-{{(index.index-1)*windowWidth}}px); transform:translateX(-{{(index.index-1)*windowWidth}}px);' ng-swipe-left='goLeft()' ng-swipe-right='goRight()'>" +  
				       "</div>"
		};
	}
	
	r2oSlideController.$inject = ['$scope'];

	/** r2o-slide directive's controller */
	function r2oSlideController($scope){
		$scope.windowWidth = window.innerWidth;
	}
	
	/**
	 * r2o-slide Directive 
	 * Has styles of taking entire height of enclosed r2o-slide-box and screen width of the 
	 */
	function r2oSlide(){
		return {
			transclude: true,
			link : function(scope, element, attrs){
				scope.ele = document.getElementsByTagName("r2o-content")[0].children[0];
			},
			controller : 'r2oSlideController',
			restrict : "E",
			template : "<div ng-transclude class='slide' style='width:{{windowWidth}}px; max-height: {{ele.clientHeight}}; min-height: {{ele.clientHeight}};'>" +  
				       "</div>"
		};
	}
})();