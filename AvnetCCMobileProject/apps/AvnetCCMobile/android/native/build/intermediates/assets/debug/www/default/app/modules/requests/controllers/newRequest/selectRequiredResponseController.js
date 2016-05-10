
/* JavaScript content from app/modules/requests/controllers/newRequest/selectRequiredResponseController.js in folder common */
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('selectRequiredResponseController', selectRequiredResponseController);
	
	/**
	 * controller for the required response questions
	 */
	function selectRequiredResponseController($scope, $rootScope, newRequestFactory){
		//variables
		$scope.questionsRequired = newRequestFactory.areQuestionsRequired;
		$scope.selectedCurrency = newRequestFactory.getRequest().CurrencyCode;
		$scope.requiredResponse = newRequestFactory.requiredResponse;
		$scope.request = newRequestFactory.getRequest();
		var selectedProducts = $scope.request.Products || [];
		var configurableProducts = selectedProducts.filter(function(product){
			return product.IsConfigurable;
		});
		
		$scope.isResponseNeeded = configurableProducts.length != 0; 
		//methods
		$scope.handleBackButton = handleBackButton;
		$scope.changeCurrency = changeCurrency;
		$scope.toggleResponse = toggleResponse;
		
		//implementations
		function handleBackButton(){
			broadCastHandleBack();
		}
		
		/**
		 * function to change the currency
		 * @param currency
		 */
		function changeCurrency(currency){
			$scope.selectedCurrency = currency;
			var request = newRequestFactory.getRequest();
			request.CurrencyCode = currency;
			newRequestFactory.setRequest(request);
		}
		
		/**
		 * function to toggle the response
		 * @param response
		 */
		function toggleResponse(response){
			if($scope.request.ResponseTypeSk == response.id){
				$scope.request.ResponseTypeSk = null;
			}else{
				$scope.request.ResponseTypeSk = response.id;
			}
			newRequestFactory.setRequest($scope.request);
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