(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('selectProductToReviseController', selectProductToReviseController);


	/**
	 * main function that controls the select products to revise page
	 */
	function selectProductToReviseController($scope, $rootScope, newRequestFactory, $state, $stateParams){
		console.log("came inside selectProductToReviseController",$stateParams.RequestRevisionSK);	
		
		$scope.handleBackButton = handleBackButton;
		$scope.goToReviseQuoteItems = goToReviseQuoteItems;
		$scope.getCustomProductName = getCustomProductName;
		
		WL.App.overrideBackButton(function(e){
			e.preventDefault();
			handleBackButton();
		});
		

		/**
		 * function that loads the products from the selected quote
		 */
		function loadLocalQuote(){
			console.log('selectProductToReviseController: Goin to load quote');
			$scope.products = newRequestFactory.selectedRequestQuote.products;
		}

		/**
		 * function to navigate to the selectItem to revise page
		 */
		function goToReviseQuoteItems(product){
			newRequestFactory.selectedReviseProduct = product;
			console.log("going to reviseQuoteItems",$stateParams.RequestRevisionSK);
			$state.go('selectItemtoRevise',{'RequestRevisionSK':$stateParams.RequestRevisionSK});
		}

		/**
		 * function to return the custom product name
		 * @param product object
		 */
		function getCustomProductName(product){
			console.log('in getCustomProductName method');
			console.log(product);
			if(product.ProductName != product.SupplierName + " - " + product.EntityTemplateName)
				return product.ProductName;

			var productName = product.EntityTemplateName;
			
			if(product.productIndexCount > 0){
				if(product.productIndexCount != 1) {
					productName = productName + ' ' + product.productIndexCount;
				}
			} 

			return productName;			
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
			$rootScope.$broadcast("handleBack", {'RequestRevisionSK':$stateParams.RequestRevisionSK});
			//history.back();
		}

		/**
		 * function to reset the fields in the page
		 */
		function resetFields(){			
			newRequestFactory.selectedReviseProduct = undefined;
		}
		
		loadLocalQuote();

}

})();