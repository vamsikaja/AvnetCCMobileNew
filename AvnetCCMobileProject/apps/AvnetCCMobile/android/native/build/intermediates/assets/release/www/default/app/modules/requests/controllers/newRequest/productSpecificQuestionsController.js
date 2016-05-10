
/* JavaScript content from app/modules/requests/controllers/newRequest/productSpecificQuestionsController.js in folder common */
var productSpecificQuestionsScope;
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('productSpecificQuestionsController', productSpecificQuestionsController);
	
	/**
	 * controller for product specific questions
	 */
	function productSpecificQuestionsController($scope, $rootScope, newRequestFactory){
		productSpecificQuestionsScope=$scope;
		$scope.product = newRequestFactory.productSpecificQuestions[newRequestFactory.showQuestionsOfProductIndex];
		$scope.productIndex = newRequestFactory.showQuestionsOfProductIndex;
		$scope.addOption=addOption;
		$scope.isOptionAdded=isOptionAdded;
		$scope.getCustomProductName = getCustomProductName;
		$scope.handleBackButton = handleBackButton;

		$scope.title = 'Options for ' + getCustomProductName($scope.product);


		$scope.question=$scope.product.questions.filter(function(e){return e.title=='Is this a current contract'});
		if($scope.question.length>0){
			$scope.question=$scope.question[0];
		}
		/**
		 * function to check if an option is added
		 */
		function isOptionAdded(option,question){
			var matchedOptions = question.answer.filter(function(addedOption){
				if(!angular.isObject(option)){
					return addedOption.option == option;
				}
				else{
					return addedOption.option == option.option;
				}
			});
			return matchedOptions.length != 0;
		}
		
		/**
		 * function to add an option
		 * @param option
		 * @param question
		 */
		function addOption(option,question){
			if(!angular.isObject(option)){
				option=question.options.filter(function(e){ return e.option==option})[0];
			}
			question.answer = [option];
		}

		/**
		 * function to return the custom product name
		 * @param product
		 */
		function getCustomProductName(product){
			var productName = product.EntityTemplateName;

			if(product.productIndexCount > 0){
				if(product.productIndexCount != 1) {
					productName = productName + ' ' + product.productIndexCount;
				}
			} 

			return productName;			
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