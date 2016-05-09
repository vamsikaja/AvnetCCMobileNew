/**
 * r2o-nav-view Directive 
 * Handles Back button functionality, nav-bar title changes
 */
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('r2oNavViewController',r2oNavViewController)
		.directive('r2oNavView', function() {
			return {
				transclude: true,
				restrict : "E",
				controller : 'r2oNavViewController',
				template : "<div ng-transclude class='grid-block vertical'></div>"
			};
		});
		
	r2oNavViewController.$inject = ['$rootScope', '$scope', '$state', '$timeout'];
	
	function r2oNavViewController($rootScope, $scope, $state,$timeout){
			
			$scope.slideReverse='slideForward';
			$scope.title = "";
			$scope.stateStack = [];	
			$scope.goBack = goBack;
			$rootScope.$on("changeNavTitle", changeNavTitle);
			$rootScope.$on("$stateChangeStart", stateChangeStart);
			
			function changeNavTitle(event,title){
				$timeout(function(){
					$scope.title = title;
				},100);// added timeout to change title after page transition 
			}
			$rootScope.menuItems = ["login","quotes","newRequest","submissionSuccessful", "reviseSubmissionSuccessful"];
			
			function stateChangeStart(event, toState, toParams, fromState, fromParams){
				if(toState.name != "login"){
					if($rootScope.menuItems.indexOf(toState.name) == -1){
						//if user navigating to inner states other than menu items
						
						if($scope.stateStack.indexOf(toState.name) == -1){	
							//going to deeper views
							$scope.stateStack.push(toState.name);
						}else{
							//coming out of detail view
							$scope.stateStack.pop();
						}
					}else{
						// if user navigating to state in menu items
						$scope.stateStack.length = 0;
						$scope.stateStack.push(toState.name);
					}
				}else{
					$scope.stateStack.length = 0;
				}
				
				$timeout(function(){
					$scope.slideReverse='slideForward';
				},1000);
			}
			
			$scope.$on("handleBack", handleBack);
			
			function goBack(stateParams){
				$scope.slideReverse='slideReverse';		
				setTimeout(function(){
					$state.go("^."+$scope.stateStack[$scope.stateStack.length - 2], stateParams);
				},100);
			};
			
			function handleBack(event, args){
				console.log('handleBack: ', event, args);
				if($scope.stateStack.length>1){
					goBack(args);
				}else{
					WL.App.close();
				}
			}
			
			document.addEventListener(WL.Events.WORKLIGHT_IS_CONNECTED, connectionDetected, false);
			document.addEventListener(WL.Events.WORKLIGHT_IS_DISCONNECTED, disconnectionDetected, false);

			function connectionDetected(){
				console.log('connected to network');
				//$rootScope.$broadcast('online');
				$rootScope.$apply(function(){
					$rootScope.networkStatus='online';
				});
			}

			function disconnectionDetected(){
				console.log('disconnected from network');
				//$rootScope.$broadcast('offline');
				$rootScope.$apply(function(){
					$rootScope.networkStatus='offline';
				});
			}
			
		}
})();