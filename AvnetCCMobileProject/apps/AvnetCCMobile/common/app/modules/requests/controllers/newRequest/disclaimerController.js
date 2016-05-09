(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('disclaimerController', disclaimerController);
	
	/**
	 * controller for the disclaimer page when the request is submitted
	 */
	function disclaimerController($scope,$state,$rootScope,newRequestFactory,$sce){
		var disclaimers = newRequestFactory.disclaimers.map(function(a){
			return a.Disclaimer;
		}).join("");
		$scope.disclaimer={};
		$scope.disclaimer.content=disclaimers;
		$scope.disclaimer.content = $sce.trustAsHtml($scope.disclaimer.content);
		$scope.disclaimer.isSelected=false;
		$scope.submitRequestDisclaimerPage=submitRequestDisclaimerPage;
		$scope.handleBackButton=handleBackButton;

		function submitRequestDisclaimerPage(){
			if(!$scope.disclaimer.isSelected){
				$scope.disclaimerError=true;
			}
			else{
				if(newRequestFactory.isEndUserNotRequired){
					var request = newRequestFactory.getRequest();
					request.addedEndUsers.length = 0;
					newRequestFactory.setRequest(request);
				}
				newRequestFactory.submitRequest()
				.then(function(){
					/*newRequestFactory.setRequest(undefined);
					newRequestFactory.isSubmitButtonClicked=false;
					newRequestFactory.questionsSaveClicked=false;
					newRequestFactory.temporaryNotificationEmails=[];
					newRequestFactory.temporarySelectedContacts=[];	
					newRequestFactory.productSpecificQuestions=[];*/
					newRequestFactory.resetNewRequest();
					$state.go('^.submissionSuccessful');
				}, function(){
					WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
					  text : "OK",
					  handler: function(){
					  	$state.go('^.newRequest');
					  }
					}]);
				});
			}
		}

		function handleBackButton(){
			broadCastHandleBack();
		}
		
		function broadCastHandleBack(){
			$rootScope.$broadcast("handleBack");
		}
		
		WL.App.overrideBackButton(function(e){
			e.preventDefault();
			handleBackButton();
		});
	}
})();