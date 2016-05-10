
/* JavaScript content from app/modules/requests/controllers/newRequestController.js in folder common */
var newScope, newFact;
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('newRequestController', newRequestController);
	
	/**
	 * main method for the new request
	 */
	function newRequestController($scope, $rootScope, newRequestFactory, $state, $timeout, $stateParams){
		console.log('newRequestController: load');

		$scope.isSubmitButtonClicked=newRequestFactory.isSubmitButtonClicked;
		$scope.disclaimer = {
				isSelected : false
		};
		newScope = $scope;
		newFact = newRequestFactory;

		$scope.productSpecificQuestions = newRequestFactory.productSpecificQuestions || [];
		$scope.notificationListString="Select People to Notify";
		$scope.endUsersListString="Select End User";
		$scope.productsListString="Select Products";
		$scope.requiredResponseString="Select Response";
		$scope.disclaimer = {
				isSelected : false
		};

		$scope.validateRequiredResponse = validateRequiredResponse;
		$scope.validateProductOptions=validateProductOptions;
		$scope.addRequestName=addRequestName;
		$scope.addRequestInstructions=addRequestInstructions;
		$scope.submitRequest=submitRequest;
		$scope.showInstructionsInView=showInstructionsInView;
		$scope.blurElementWithId=blurElementWithId;

		if(newRequestFactory.getRequest() == undefined){
			newRequestFactory.getNewRequest($stateParams.type, $stateParams.requestNo)
			.then(function(request){
				console.log('newRequestController: This is the retrieved request', request);
				$scope.request = request;
				$scope.notificationListCount=0;
				$scope.notificationListString="Select People to Notify";
				$scope.endUsersListString="Select End User";
				$scope.productsListString="Select Products";
				$scope.requiredResponseString="Select Response";
				$scope.disableSubmitButton=true;
				$scope.productSpecificQuestions = newRequestFactory.productSpecificQuestions || [];

				/*if($stateParams.type == "copy"){
					populateProducts();
				}*/

				if($stateParams.type == "copy"){
					console.log('newRequestController: Its a copy request');
					$scope.request.isCopy = true;
				} else { 
					$scope.request.isCopy = false;
				}

				newRequestFactory.setRequest($scope.request);

				validateForm();
			},function(){
				//Error Callback
				WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
				  text : "OK",
				  handler: function(){
				  	$state.go('quotes');	
				  }
				}]);
			});
		}else{
			$scope.request = newRequestFactory.getRequest();
			validateForm();
		}
		
		$rootScope.$on("$stateChangeStart", stateChangeStart);
		function stateChangeStart(event, toState, toParams, fromState, fromParams){
			if($rootScope.menuItems.indexOf(toState.name) != -1 && fromState.name == "newRequest"){
				newRequestFactory.resetNewRequest();
			}
		}
		/**
		 * function to populate the productlist
		 */
		function populateProducts(){
			//populate product index suffix property for repeated properties
			var allProducts = $scope.request.Products;
			var updatedProducts = [];

			var i = 0
			for (; i < allProducts.length; i++) {
				var product = allProducts[i];
				if(!product.productIndexCount){
					product.productIndexCount = 1;
					var j = i + 1;
					var productCountTracker = 1;
					for (; j < allProducts.length; j++) {
						var anotherProduct = allProducts[j];
						if(anotherProduct.EntityTemplateSk == product.EntityTemplateSk){
							//increment the index count
							anotherProduct.productIndexCount = ++productCountTracker;							
						}
					}
				}
				updatedProducts.push(product);
			};

			$scope.request.Products = updatedProducts;
			newRequestFactory.setRequest($scope.request);

			console.log("newRequestController: After populating products", allProducts, updatedProducts, $scope.request);

		}
		

		function showInstructionsInView(){
			$timeout(function() { 
				document.getElementsByClassName('instructions')[0].scrollIntoView(true);
			},1000);
		}
		/**
		 * function to blur a particular element with id
		 * @param id - id of the html element
		 */
		function blurElementWithId(id){
			$timeout(function() { 
				document.getElementById(id).blur();
			});
		}
		
		/**
		 * function to validate the product specific questions
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
		 * function to validate the required response
		 */
		function validateRequiredResponse(){ 
			//check if required response is given
			var givenResponse = newRequestFactory.requiredResponse.filter(function(response){
				return response.id == $scope.request.ResponseTypeSk;
			});
			
			if(givenResponse.length == 0){				
				return false;
			}
			return true;
		}

		/**
		 * function to add the Request Name
		 */
		function addRequestName(){
			newRequestFactory.setRequest($scope.request);
			validateForm();
		}

		/**
		 * function to add the Request Instructions
		 */
		function addRequestInstructions(){
			newRequestFactory.setRequest($scope.request);
			validateForm();
		}


		/**
		 * function to Submit the Request
		 */
		function submitRequest(requestName){
			$scope.isSubmitButtonClicked=true;
			newRequestFactory.isSubmitButtonClicked=true;
			var errorOccured;
			/*if($scope.request.notificationEmails==undefined || $scope.request.notificationEmails.length==0 )
			{
				console.log('notificationError found');
				$scope.notificationError=true;
				$scope.disableSubmitButton=true;
			}*/

			if(newRequestFactory.isEndUserNotRequired){
				if(hasUS33SalesOrgPartner($scope.request.Partners)){
					if(($scope.request.businessSector==undefined) || ($scope.request.businessSector=="")){
						$scope.endUsersError=true;
						$scope.disableSubmitButton=true;
					}
				}
			}
			else{
				if($scope.request.addedEndUsers==undefined || $scope.request.addedEndUsers.length==0){
					$scope.endUsersError=true;
					$scope.disableSubmitButton=true;
				}
			}

			if($scope.request.Products==undefined || $scope.request.Products.length==0){
				$scope.productsError=true;
				$scope.disableSubmitButton=true;
			}

			if(!validateProductOptions()){
				$scope.productOptionsError=true;
				$scope.disableSubmitButton=true;
			}

			if(!validateRequiredResponse()){
				$scope.requiredResponseError=true;
				$scope.disableSubmitButton=true;
			}

			if($scope.request.RequestName==undefined || $scope.request.RequestName==""){
				$scope.requestNameError=true;
				$scope.disableSubmitButton=true;
			}

			/*console.log('$scope.request.requestInstructions :'+$scope.request.requestInstructions);
			if($scope.request.requestInstructions!=undefined && $scope.request.requestInstructions!=""){
				if(!testAlphaNumeric($scope.request.requestInstructions)){
					console.log('addRequestInstructionsError found');
					$scope.requestInstructionsError=true;
					$scope.disableSubmitButton=true;
				}
			}*/

			if(!$scope.disableSubmitButton){
				newRequestFactory.getDisclaimer()
				.then(function(results){
					newRequestFactory.disclaimers = results;
					if(results.length > 0){
						$state.go('^.disclaimer');
					}else{
						if(newRequestFactory.isEndUserNotRequired){
							var request = newRequestFactory.getRequest();
							request.addedEndUsers.length = 0;
							newRequestFactory.setRequest(request);
						}
						newRequestFactory.submitRequest()
						.then(function(){
							newRequestFactory.setRequest(undefined);
							newRequestFactory.isSubmitButtonClicked=false;
							newRequestFactory.questionsSaveClicked=false;
							newRequestFactory.temporaryNotificationEmails=[];
							newRequestFactory.temporarySelectedContacts=[];	
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
				},function(){
					WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
					  text : "OK"
					}]);
				});
			}
		}

		/**
		 * function to validate the new Request form
		 */
		function validateForm(){
			$scope.disableSubmitButton=false;

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
			}
			else{
				$scope.notificationListCount=0;
				$scope.notificationListString="Select People to Notify";
				/*$scope.disableSubmitButton=true;
				if($scope.isSubmitButtonClicked){
					$scope.notificationError=true;
				}*/
			}

			if(newRequestFactory.isEndUserNotRequired){
				$scope.endUsersListString="No End User";
				if(hasUS33SalesOrgPartner($scope.request.Partners)){
					if(!(($scope.request.businessSector==undefined) || ($scope.request.businessSector==""))){
						$scope.correctlyFilledEndUsers=true;
						//$scope.endUsersListString=$scope.request.businessSector;
					}
					else{
						//$scope.endUsersListString="No End User for this Request";
						$scope.disableSubmitButton=true;
						if($scope.isSubmitButtonClicked){
							$scope.endUsersError=true;
						}
					}
				}
				else{
					$scope.correctlyFilledEndUsers=true;
				}
			}
			else{
				if(!(($scope.request.addedEndUsers==undefined) || ($scope.request.addedEndUsers.length==0))){
					$scope.correctlyFilledEndUsers=true;
					$scope.endUsersListString=$scope.request.addedEndUsers.map(function(item){return item.PartnerName;}).join(', ');
				}
				else{
					$scope.endUsersListString="Select End User";
					$scope.disableSubmitButton=true;
					if($scope.isSubmitButtonClicked){
						$scope.endUsersError=true;
					}
				}
			}

			if(!(($scope.request.Products == undefined) || ($scope.request.Products.length==0))){
				$scope.correctlyFilledProducts=true;
				$scope.productsListString=$scope.request.Products.map(function(item){
					if(item.productIndexCount>1)
						return item.EntityTemplateName+" "+item.productIndexCount;
					else
						return item.EntityTemplateName;
				}).join(', ');
			}
			else{
				$scope.productsListString="Select Products";
				$scope.disableSubmitButton=true;
				if($scope.isSubmitButtonClicked){
					$scope.productsError=true;
				}
			}

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
				$scope.correctlyFilledProductOptions=true;
			}
			else{
				$scope.disableSubmitButton=true;
				if($scope.isSubmitButtonClicked){
					$scope.productOptionsError=true;
				}
			}

			if(validateRequiredResponse()){
				$scope.correctlyFilledRequiredResponse=true;
				$scope.requiredResponseString=newRequestFactory.requiredResponse.filter(function(response){return response.id == $scope.request.ResponseTypeSk;}).map(function(e){return e.response})[0];
			}
			else{
				$scope.disableSubmitButton=true;
				$scope.requiredResponseString="Select Response";
				if($scope.isSubmitButtonClicked){
					$scope.requiredResponseError=true;
				}
			}

			if($scope.request.RequestName==undefined || $scope.request.RequestName==""){
				if($scope.isSubmitButtonClicked){
					$scope.requestNameError=true;
				}
				$scope.disableSubmitButton=true;
			}
			else{
				$scope.requestNameError=false;
			}

			/*console.log('$scope.request.requestInstructions :'+$scope.request.requestInstructions);
			if($scope.request.requestInstructions==undefined || $scope.request.requestInstructions==""){
				$scope.requestInstructionsError=false;
			}
			else{
				if(!testAlphaNumeric($scope.request.requestInstructions)){
					console.log('addRequestInstructionsError found');
					$scope.disableSubmitButton=true;
					if($scope.isSubmitButtonClicked){
						$scope.requestInstructionsError=true;
					}
				}
			}*/
			return $scope.disableSubmitButton;
		}

		/**
		 * function to check the sales organization code
		 * @param partners - list of partners
		 */
		function hasUS33SalesOrgPartner(partners){
			for(var i=0;i<(partners || []).length;i++){
				if(partners[i].SalesOrganizations.map(function(item){return item.SalesOrgCode;}).indexOf('US33') != -1){
					return true;
				}
			}
			return false;
		}

		/**
		 * function to validate the requestname.
		 * @param requestName - name of the request
		 */
		function testAlphaNumeric(requestName){
			var regex = new RegExp("^[a-zA-Z0-9\\s]+$");
			if(regex.test(requestName)){
		    	return true;
		    }
		    return false;
		}
	}
})();