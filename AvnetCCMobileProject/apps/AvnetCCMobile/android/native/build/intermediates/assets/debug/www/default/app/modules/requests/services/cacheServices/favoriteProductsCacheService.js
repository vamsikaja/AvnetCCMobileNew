
/* JavaScript content from app/modules/requests/services/cacheServices/favoriteProductsCacheService.js in folder common */
/**
*  favoriteProducts Service 
*
* Description: Provides Metods for adding, removing and getting the favorite products of Loggedin user
*/

(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
	.factory('favoriteProducts', favoriteProducts);
	
	favoriteProducts.$inject = ['$q'];
	function favoriteProducts($q){

		var favoriteProducts = {
			"addProduct" : addProduct,
			"removeProduct" : removeProduct,
			"getFavoriteProducts" : getFavoriteProducts
		};
		
		/**
		 *   function to add product as favorite
		 *   @param product - product to be added to favorites list
		 */
		function addProduct(product){
			var defered = $q.defer();
			
			product.loginId = localStorage.getItem("LoginId")+"";
			
			getProduct(parseInt(product.EntityTemplateSk))
			.then(function(products){
				if(products.length == 0){
					WL.JSONStore.get("favoriteProduct").add(product)
					.then(function(){
						defered.resolve();
					}, function(){
						defered.resolve();
					});
				}
				else{
					console.log('cacheService product already present')
				}
			}, function(){
				WL.JSONStore.get("favoriteProduct").add(product)
				.then(function(){
					defered.resolve();
				}, function(){
					defered.resolve();
				});
			});
			return defered.promise;
		}
		
		/**
		 * 	function to get product
		 *	@param EntityTemplateSk - product with given EntityTemplateSk is returned
		 */
		function getProduct(EntityTemplateSk){
			var defered = $q.defer();
			
			var collectionName = 'favoriteProduct';
			var loginId = localStorage.getItem("LoginId")+"";
			
			WL.JSONStore.get(collectionName)
			.find({'EntityTemplateSk':EntityTemplateSk, "loginId" :loginId}, {exact:true})
			.then(function (results) {
				defered.resolve(results);
			})
			.fail(function (errorObject) {
				defered.reject();
			});
			
			return defered.promise;
		}
		
		/**
		 * Removes provided product from favorite products
		 *	@param product - product to be removed from favorites list
		 */
		function removeProduct(product){
			var defered = $q.defer();

			getProduct(parseInt(product.EntityTemplateSk))
			.then(function(products){
				if(products.length != 0){
					WL.JSONStore.get("favoriteProduct").remove(products)
					.then(function(){
						defered.resolve();
					}, function(){
						defered.resolve();
					});
				}else{
					defered.resolve();
				}
			}, function(){
				defered.resolve();
			});
			return defered.promise;
		}
		
		/**
		 *   Returns all the stored favorite products of the loggedin User
		 *   @parma allProducts - allProducts list
		 */
		function getFavoriteProducts(allProducts){
			var defered = $q.defer();
			
			var allProductsIds = allProducts.map(function(e){ return e.EntityTemplateSk;});
			var loginId = localStorage.getItem("LoginId")+"";
			WL.JSONStore.get("favoriteProduct")
			.find({'loginId':loginId}, {exact:true})
			.then(function (results) {
				var validProducts = results.filter(function(product){
					return allProductsIds.indexOf(product.json.EntityTemplateSk) != -1;
				});
				defered.resolve(validProducts.map(function(e){ return e.json;}));
			})
			.fail(function (errorObject) {
				defered.reject();
			});
			return defered.promise;
		}
		
		return favoriteProducts;
	}

})();