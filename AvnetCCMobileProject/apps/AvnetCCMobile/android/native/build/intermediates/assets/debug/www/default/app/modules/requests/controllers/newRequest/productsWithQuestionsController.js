
/* JavaScript content from app/modules/requests/controllers/newRequest/productsWithQuestionsController.js in folder common */
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('productsWithQuestionsController', productsWithQuestionsController);


	/**
	 * controller to handle the products with questions
	 */
	function productsWithQuestionsController($scope, $rootScope, newRequestFactory,$state){
		$scope.products = newRequestFactory.productSpecificQuestions;
		$scope.redirectToQuestions=redirectToQuestions;
		$scope.areRequiredQuestionsAnswered=areRequiredQuestionsAnswered;
		$scope.getCustomProductName = getCustomProductName;
		$scope.handleBackButton=handleBackButton;


		/**
		 * function to check if all questions are answered
		 * @param index
		 */
		function areRequiredQuestionsAnswered(index){
			var questions=newRequestFactory.productSpecificQuestions[index].questions || [];
			for (var i = questions.length - 1; i >= 0; i--) {
				if((questions[i].answer== null || questions[i].answer==undefined || questions[i].answer.length==0) && questions[i].isMandatory)
					return false;
			}
			return true;
		}

		/**
		 * function to redirect to questions
		 * @param index
		 */
		function redirectToQuestions(index){
			newRequestFactory.showQuestionsOfProductIndex=index;
			$state.go('productQuestions');
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
			//newRequestFactory.showQuestionsOfProductIndex=undefined;
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