
/* JavaScript content from app/modules/requests/services/cacheServices/productSpecificQuestionsCacheService.js in folder common */
/**
*  productSpecificQuestionsCacheService Service 
*
* Description: Provides methods for getting products requiring Questions and are Questions required for given products
*/
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
	.factory('productSpecificQuestionsCacheService', productSpecificQuestionsCacheService);
	
	productSpecificQuestionsCacheService.$inject = ['$q'];

	function productSpecificQuestionsCacheService($q){
		var factory = {
			"getProductsRequiringQuestions" : getProductsRequiringQuestions,
			"areQuestionsRequired" : areQuestionsRequired,	
		};
		
		/**
		 *   function to get Product Requiring QUestions
		 */
		function getProductsRequiringQuestions(){
			var productsRequiringQuestions = localStorage.getItem("productsRequiringQuestions");
			if(productsRequiringQuestions != null){
				return JSON.parse(productsRequiringQuestions);
			}else{
				return [];
			}
		}
		
		/**
		 *   function to get are Questions Required for the given products 
		 *   @param prods - Products for which we want check are Questions Required
		 */
		function areQuestionsRequired(prods){
			var products = (prods || []).map(function(item){ return item.EntityTemplateSk;});
			var productsRequiringQuestions = factory.getProductsRequiringQuestions().map(function(item){return item.EntityTemplateSk;});
			
			var productsMatching = products.filter(function(item){
				return productsRequiringQuestions.indexOf(item) != -1;
			});
			return productsMatching.length != 0;
		}
		
		return factory;
	}
	
})();