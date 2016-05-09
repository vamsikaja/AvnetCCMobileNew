var newScope, newFact;
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('reviseQuoteController', reviseQuoteController);


	/**
	 * function that controls the revise quote functionality
	 */
	function reviseQuoteController($scope, $rootScope, newRequestFactory, $state, $timeout){
		
		$scope.submitReviseRequest = submitReviseRequest;
		$scope.isSubmitButtonClicked=newRequestFactory.isSubmitButtonClicked;		
		$scope.refreshRequest=refreshRequest;		
		$scope.showInstructionsInView=showInstructionsInView;
		$scope.blurElementWithId=blurElementWithId;
		$scope.handleBackButton = handleBackButton;
		$scope.cancelRevise = cancelRevise;


		$scope.isReviseConfig = newRequestFactory.isReviseConfig;
		$scope.title = $scope.isReviseConfig? 'Revise Config' : 'Revise Quote';
		$scope.selectedReviseConfig = newRequestFactory.selectedReviseConfig;

		$scope.selectedReviseQuote = newRequestFactory.selectedReviseQuote;

		$scope.productSpecificQuestions = newRequestFactory.productSpecificQuestions || [];

		
		WL.App.overrideBackButton(function(e){
			e.preventDefault();
			handleBackButton();
		});

		if(newRequestFactory.getRequest() == undefined){
			newRequestFactory.getNewRequest("modify")
			.then(function(request){

				$scope.request = request;
				$scope.notificationListCount=0;
				$scope.notificationListString="Please select notifications";				
				$scope.productsListString="Please Specify a Product";
				$scope.disableSubmitButton=true;


				if($scope.isReviseConfig){
					//$scope.request.reviseQuoteName = 'Revise Config';	
				} else if($scope.selectedReviseQuote) {					
					$scope.request.reviseQuoteName = $scope.selectedReviseQuote.quoteNumber + '-' + $scope.selectedReviseQuote.quoteRevisionNumber;
				}
				validateForm();			
			},function(){
				//Error Callback
				console.log("reviseQuoteController: error retrieving newRequest");
				WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
				  text : "OK",
				  handler: function(){
				  	handleBackButton();
				  }
				}]);
			});
		} else {
			$scope.request = newRequestFactory.getRequest();
			if($scope.isReviseConfig){
				//$scope.request.reviseQuoteName = 'Revise Config';	
			} else if($scope.selectedReviseQuote) {					
				$scope.request.reviseQuoteName = $scope.selectedReviseQuote.quoteNumber + '-' + $scope.selectedReviseQuote.quoteRevisionNumber;
			}
			validateForm();
		}


		/**
		 * function to submit the revise request
		 * @param revise action name 
		 * @param reviseAction - Action to be performed
		 * @param revieseNotes - Notes
		 */
		function submitReviseRequest(reviseActionName,reviseAction,reviseNotes){
			console.log("going to submit request", newRequestFactory.request,reviseActionName,reviseAction,reviseNotes);

			$scope.isSubmitButtonClicked=true;
			newRequestFactory.isSubmitButtonClicked=true;

			
			validateForm();
			if(!$scope.disableSubmitButton){
				console.log('reviseQuoteController: Form is valid going to submit');

				
				newRequestFactory.submitReviseRequest(reviseActionName,reviseAction,reviseNotes)
					.then(function(){
							resetFields();
							$state.go('^.reviseSubmissionSuccessful');
					}, function(error){
						console.log('reviseQuoteController: Error revising quote', error);
						WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
							  text : "OK",
							  handler: function(){
							  	resetFields();
							  	$state.go('^.quotes');
							  }
							}]);
					});
			}

		}

		function showInstructionsInView(){
			console.log('in textarea focus method');
			$timeout(function() { 
				document.getElementsByClassName('instructions')[0].scrollIntoView(true);
			},1000);
		}

		/**
		 * function to blur html element
		 * @param id
		 */
		function blurElementWithId(id){
			$timeout(function() { 
				document.getElementById(id).blur();
			});
		}

		

		/**
		 * function to refresh the request page
		 */
		function refreshRequest(){
			console.log('in refreshRequest method');
			newRequestFactory.setRequest($scope.request);
			validateForm();
		}


		/**
		 * function to validate the revise request form
		 */
		function validateForm(){
			console.log('in validateForm method');
			$scope.disableSubmitButton=false;
			console.log('checking notifications');

			if(!(($scope.request.notificationEmails==undefined) || ($scope.request.notificationEmails.length==0))){
				
				$scope.correctlyFilledNotificationsList=true;
				var selectedAddedEmails=$scope.request.notificationEmails.filter(function(e){ return !angular.isObject(e) }).map(function(e){ return e})
				$scope.notificationListCount=selectedAddedEmails.length;
				$scope.notificationListString=selectedAddedEmails.join(', ');

				var selectedReceivedEmails=$scope.request.notificationEmails.filter(function(e){ return angular.isObject(e) }).map(function(e){ return e.EmailAddress});
				if(selectedReceivedEmails.length!=0 && selectedAddedEmails.length!=0)
					$scope.notificationListString=$scope.notificationListString+', ';
				$scope.notificationListCount=$scope.notificationListCount+selectedReceivedEmails.length;
				$scope.notificationListString=$scope.notificationListString+selectedReceivedEmails.join(', ');


				//Set the notification email list
				$scope.request.selectedNotificationEmails = selectedAddedEmails.concat(selectedReceivedEmails);
			}
			else{

				//Set the notification email list
				$scope.request.selectedNotificationEmails = [];

				$scope.notificationListCount=0;
				$scope.notificationListString="Select People to Notify";
				console.log('no notifications list');				
			}


			console.log('checking products');
			if(!(($scope.request.Products == undefined) || ($scope.request.Products.length==0))){
				$scope.correctlyFilledProducts=true;
				$scope.productListCount = $scope.request.Products.length;
				$scope.productsListString=$scope.request.Products.map(function(item){
					if(item.productIndexCount>1)
						return item.EntityTemplateName+" "+item.productIndexCount;
					else
						return item.EntityTemplateName;
				}).join(', ');
			} else {
				$scope.productListCount = 0;
				$scope.productsListString="Select Products to Add";
				console.log('no products list');
			}
			
			console.log('checking validateProductOptions');
			(function(){
				var products = newRequestFactory.productSpecificQuestions || [];
				var prodCount=0;
				for (var i = products.length - 1; i >= 0; i--) {
					var questions=products[i].questions || [];
					var j = questions.length - 1
					for (; j >= 0; j--) {
						if((questions[j].answer == undefined || questions[j].answer == null || questions[j].answer.length==0) && questions[j].isMandatory){
							console.log('no answer Specified');
							break;
						}
					};
					console.log(j);
					if(j!=-1){
						prodCount=prodCount+1;
					}
					console.log('prodCount :'+prodCount);
				};
				if(prodCount >1){
					$scope.productOptionsString=prodCount+' Products Require More Info';
				}
				else if(prodCount == 1){
					$scope.productOptionsString=prodCount+' Product Requires More Info';
				}
				else{
					if(products.length>1)
						$scope.productOptionsString=products.length+' Products Ready';
					else
						$scope.productOptionsString=products.length+' Product Ready';
				}
			})();

			if(validateProductOptions()){
				console.log('productOptions is valid');
				$scope.correctlyFilledProductOptions=true;
			} else {
				console.log('productOptions is Invalid');
				$scope.disableSubmitButton=true;
				if($scope.isSubmitButtonClicked){
					$scope.productOptionsError=true;
				}
			}


			if($scope.request.reviseQuoteName==undefined || $scope.request.reviseQuoteName==""){
				if($scope.isSubmitButtonClicked){
					$scope.reviseQuoteNameError=true;
				}
				$scope.disableSubmitButton=true;
			} else {
				$scope.reviseQuoteNameError=false;
			}

			if($scope.request.reviseAction == undefined || $scope.request.reviseAction == ""){
				if($scope.isSubmitButtonClicked){
					$scope.reviseActionError=true;
				}
				$scope.disableSubmitButton=true;
			} else {
				$scope.reviseActionError=false;
			}

			if($scope.request.requestInstructions==undefined || $scope.request.requestInstructions=="" || !testAlphaNumeric($scope.request.requestInstructions)){
				if($scope.isSubmitButtonClicked){
					console.log('addRequestInstructionsError found');
					$scope.requestInstructionsError=true;					
				}
				$scope.disableSubmitButton=true;
			} else {
				$scope.requestInstructionsError=false;
			}
			
			console.log('$scope.disableSubmitButton :'+$scope.disableSubmitButton);
			return $scope.disableSubmitButton;
		}

		/**
		 * function to validate the product options
		 */
		function validateProductOptions(){
			var products = newRequestFactory.productSpecificQuestions || [];

			for (var i = products.length - 1; i >= 0; i--) {
				var questions=products[i].questions || [];
				for (var j = questions.length - 1; j >= 0; j--) {
					if((questions[j].answer == undefined || questions[j].answer.length==0) && questions[j].isMandatory)
						return false;
				};
			};
			return true;
		}


		/**
		 * function to validate the alphanumeric character in the request name
		 * @param request name
		 */
		function testAlphaNumeric(requestName){
			var regex = new RegExp("^[a-zA-Z0-9\\s]+$");
			console.log('testAlphaNumeric response :'+regex.test(requestName));
		    if(regex.test(requestName)){
		    	return true;
		    }
		    return false;
		}

		/**
		 * function to cancel the revise request 
		 */
		function cancelRevise(){
			WL.SimpleDialog.show("Cancel Revise", "Do you want to cancel this revision without finalizing your changes ?", [{
				text: "Continue",
				handler: function(){
					handleBackButton();
				}
			},{
			  text : "Cancel"
			}]);	
		}

		/**
		 * function to handle the back button
		 */
		function handleBackButton(){			
			resetFields();
			broadCastHandleBack();			
		}
		
		/**
		 * function to broadcast the back button action
		 */
		function broadCastHandleBack(){
			$rootScope.$broadcast("handleBack", {'RequestRevisionSK':newRequestFactory.selectedRequestQuote.RequestRevisionSK});
		}

		/**
		 * function to reset the revise request fields
		 */
		function resetFields(){
			newRequestFactory.setRequest(undefined);
			newRequestFactory.isSubmitButtonClicked=false;
			newRequestFactory.questionsSaveClicked=false;
			newRequestFactory.temporaryNotificationEmails=[];
			newRequestFactory.temporarySelectedContacts=[];
			newRequestFactory.productSpecificQuestions=[];
		}

	}
})();