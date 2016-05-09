(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('selectProductController', selectProductController);


	/**
	 * controller for the product selelction page
	 */
	function selectProductController($scope, $rootScope, $timeout, favoriteProducts, newRequestFactory){
		//variables
		$scope.tabIndex = {index:1};
		$scope.addedProducts = newRequestFactory.getRequest().Products || [];
		$scope.recentProducts = newRequestFactory.getRequest().RecentProducts || [];
		$scope.allProducts = newRequestFactory.getRequest().LookupLists || [];
		$scope.favoriteProducts = [];
		$scope.tempProductsToBeRemoved = [];	
		$scope.filteredProducts = [];	
		$scope.removedProductIndexes = newRequestFactory.removedProductIndexes;
		//methods
		$scope.changeTabContentTo=changeTabContentTo;
		$scope.handleBackButton = handleBackButton;
		$scope.isProductAdded = isProductAdded;
		$scope.isProductFavorite = isProductFavorite;
		$scope.addOrRemoveProduct = addOrRemoveProduct;
		$scope.addProductAgain = addProductAgain;
		$scope.addOrRemoveProductTemporarily = addOrRemoveProductTemporarily;
		$scope.toggleAllProductSelection = toggleAllProductSelection;
		$scope.areAllProductsSelected = areAllProductsSelected;
		$scope.getCustomProductName = getCustomProductName;
		$scope.isProductToBeRemoved = isProductToBeRemoved;
		$scope.showRemoveAllProductsModal = showRemoveAllProductsModal;
		$scope.cancelRemoveAllProductsModal = cancelRemoveAllProductsModal;
		$scope.removeSelectedProducts = removeSelectedProducts;
		$scope.addOrRemoveFavoriteProduct = addOrRemoveFavoriteProduct;
		$scope.removeProduct = removeProduct;
		$scope.blurElementWithId=blurElementWithId;
		var productsHavingQuestions = [21, 22, 23, 24, 26, 45, 46, 47, 69, 374];

		//method implementation
		function changeTabContentTo(index){
			$timeout(function(){
				$scope.tabIndex.index = index;
			},0);
		}
		
		/**
		 * function that returns favorite products
		 */
		function getFavoriteProducts(){
			favoriteProducts.getFavoriteProducts(angular.copy($scope.allProducts))
			.then(function(favoriteProducts){
				$scope.favoriteProducts = favoriteProducts;
			},function(){
				
			});
		}
		getFavoriteProducts();
		
		/**
		 * function to check if the product is added
		 */
		function isProductAdded(product){
			var prod = $scope.addedProducts.filter(function(a){
				return product.EntityTemplateSk == a.EntityTemplateSk;
			});
			return prod.length;
		}
		
		/**
		 * function to check if added product is favorite product
		 */
		function isProductFavorite(product){
			var user = $scope.favoriteProducts.filter(function(a){
				return parseInt(product.EntityTemplateSk) == a.EntityTemplateSk;
			});
			return user.length!=0;
		}
		
		/**
		 * function to add or remove a product
		 */
		function addOrRemoveProduct(product){
			var productsChanged=true;
			/*
			product = $scope.allProducts.filter(function(e){ 
				return (e.EntityTemplateSk == product.EntityTemplateSk) && (e.suffix) ;
			});*/


			var sameProductCount = isProductAdded(product);
			if(sameProductCount == 0){
				//add the product
				product.productIndexCount = 1;
				addProduct(product);
				//reset the already removed indexes
				var alreadyRemovedIndexes =  $scope.removedProductIndexes[product.EntityTemplateSk.toString()];
				alreadyRemovedIndexes.length = 0;
			} else {
				//var index = $scope.addedProducts.map(function(e){return e.EntityTemplateSk;}).indexOf(product.EntityTemplateSk);
				//$scope.productToRemove = index;
				$scope.selectedProduct = product;
				$rootScope.$broadcast("toggle-removeProductModal");
			}
			
			/*
		   if(isProductAdded(product)){
				var index = $scope.addedProducts.map(function(e){return e.EntityTemplateSk;}).indexOf(product.EntityTemplateSk);
				$scope.productToRemove = index;
				$rootScope.$broadcast("toggle-removeProductModal");
			}else{
				
			}*/
		}

		
		function addProductAgain(){
			if($scope.selectedProduct){
				var newProduct = angular.copy($scope.selectedProduct);
				var sameProductCount = isProductAdded($scope.selectedProduct);
				var selectedProductSk = $scope.selectedProduct.EntityTemplateSk.toString();
				var nextProductCount;
				var alreadyRemovedIndexes = $scope.removedProductIndexes[selectedProductSk];


				console.log('selectProductController: addProductAgain: ', selectedProductSk, $scope.removedProductIndexes,$scope.selectedProduct);

				if(alreadyRemovedIndexes && alreadyRemovedIndexes.length > 0) {
					nextProductCount = Math.min.apply(null, alreadyRemovedIndexes);
					alreadyRemovedIndexes.splice(alreadyRemovedIndexes.indexOf(nextProductCount),1);
				}

				if (nextProductCount) {
					newProduct.productIndexCount = nextProductCount;
				} else {
					newProduct.productIndexCount = sameProductCount + 1;	
				}
				addProduct(newProduct);
				$rootScope.$broadcast("toggle-removeProductModal");
			}
		}

		/**
		 * function to add or remove the product
		 * @param product
		 */
		function addOrRemoveProductTemporarily(product){
			var index = $scope.tempProductsToBeRemoved.indexOf(product);
			if(index == -1){
				console.log('selectProductController: Goin to add product to remove list', product, $scope.tempProductsToBeRemoved);
				$scope.tempProductsToBeRemoved.push(product);
			} else {
				console.log('selectProductController: Going to remove product from remove list', product);
				$scope.tempProductsToBeRemoved.splice(index,1);				
			}
		}

		/**
		 * function to toggle product selection
		 */
		function toggleAllProductSelection(){
			console.log("selectProductController: filteredProducts", $scope.filteredProducts, $scope.tempProductsToBeRemoved);
			if(areAllProductsSelected()){
				//deselectall
				console.log("Deselecting all");
				$scope.tempProductsToBeRemoved.length=0;
			} else {
				console.log("Selecting all");
				$scope.tempProductsToBeRemoved.length =0;
				$scope.tempProductsToBeRemoved.push.apply($scope.tempProductsToBeRemoved, $scope.filteredProducts);
			}
		}

		/**
		 * function to check if all products are selected
		 */
		function areAllProductsSelected(){
			/*console.log("filteredProducts: ", $scope.filteredProducts);*/
			return $scope.tempProductsToBeRemoved && $scope.filteredProducts && ($scope.tempProductsToBeRemoved.length == $scope.filteredProducts.length);
		}

		/**
		 * function to get the product name 
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

		/**
		 * function to check if the product is to be removed
		 * @param product
		 */
		function isProductToBeRemoved(product){
			return $scope.tempProductsToBeRemoved.indexOf(product) != -1;
		}

		/**
		 * function to show the remove all product modal dialog
		 */
		function showRemoveAllProductsModal(){
			
			if(isProductAdded($scope.selectedProduct) > 1){
				$rootScope.$broadcast("close-removeProductModal");
				$scope.filteredProducts = $scope.addedProducts.filter(function(item){
					return item.EntityTemplateSk == $scope.selectedProduct.EntityTemplateSk;
				});
				$rootScope.$broadcast("toggle-removeAllProductsModal");
			} else {
				//sometimes productIndexCount wont be set if its from recentProducts or any other list
				$scope.selectedProduct.productIndexCount = 1;
				//$scope.addedProducts.splice($scope.addedProducts.indexOf($scope.selectedProduct),1);
				$scope.addedProducts.splice($scope.addedProducts.map(function(elem) {
					return elem.EntityTemplateSk;
				}).indexOf($scope.selectedProduct.EntityTemplateSk),1);
				newRequestFactory.removeProductSpecificQuestions($scope.selectedProduct);
				var request = newRequestFactory.getRequest();
				request.ResponseTypeSk = null;
				newRequestFactory.setRequest(request);
				$rootScope.$broadcast("close-removeProductModal");
			}
		}

		/**
		 * function to hide the remove all product modal dialog
		 */
		function cancelRemoveAllProductsModal(){
			$rootScope.$broadcast("toggle-removeAllProductsModal");
			$scope.tempProductsToBeRemoved.splice(0,$scope.tempProductsToBeRemoved.length);
		}

		/**
		 * function to remove the selected products
		 */
		function removeSelectedProducts(){
			var newProducts = $scope.addedProducts.filter(function(item){

				var indexToRemove = $scope.tempProductsToBeRemoved.indexOf(item);

				if(indexToRemove == -1){
					return true;
				} else {
					//the item is to be removed
					console.log("selectProductController: going to remove item", item, $scope.removedProductIndexes);
					if(item && item.productIndexCount){
						if(! $scope.removedProductIndexes[item.EntityTemplateSk.toString()]){
							$scope.removedProductIndexes[item.EntityTemplateSk.toString()] = [];
						}
						var alreadyRemovedIndexes =  $scope.removedProductIndexes[item.EntityTemplateSk.toString()];
						alreadyRemovedIndexes.push(item.productIndexCount);
					}
					newRequestFactory.removeProductSpecificQuestions(item);
					return false;
				}			
			});

			$scope.addedProducts.length = 0;
			$scope.addedProducts.push.apply($scope.addedProducts, newProducts);
			var request = newRequestFactory.getRequest();
			request.ResponseTypeSk = null;
			newRequestFactory.setRequest(request);
			console.log('selectProductController: after removing items', $scope.addedProducts,$scope.tempProductsToBeRemoved);
			cancelRemoveAllProductsModal();
		}

		/**
		 * function to add a product 
		 * @param product
		 */
		function addProduct(product){
			$scope.addedProducts.push(product);
			newRequestFactory.addProductSpecificQuestions(product);
			//var request = newRequestFactory.getRequest();
			//request.ResponseTypeSk = null;
			//newRequestFactory.setRequest(request);
		}
		/**
		 * function to remove a product 
		 * @param product
		 */
		function removeProduct(){
			var tempProdToRemove=$scope.addedProducts[$scope.productToRemove];
			$scope.addedProducts.splice($scope.productToRemove, 1);
			newRequestFactory.removeProductSpecificQuestions(tempProdToRemove);
			$scope.productToRemove = -1;
			//var request = newRequestFactory.getRequest();
			//request.ResponseTypeSk = null;
			//newRequestFactory.setRequest(request);
		}
		
		/**
		 * function to add or remove a fav product 
		 * @param product
		 * @param event
		 */
		function addOrRemoveFavoriteProduct(product,event){
			product = $scope.allProducts.filter(function(e){ 
				return e.EntityTemplateSk == product.EntityTemplateSk;
			})[0];
				if(isProductAdded(product) == 0){	
					event.preventDefault();
					event.stopPropagation();
					if(isProductFavorite(product)){
						favoriteProducts.removeProduct(product)
						.then(function(){
							getFavoriteProducts();
						});
					}else{
						favoriteProducts.addProduct(product)
						.then(function(){
							getFavoriteProducts();
						});
					}
				}else{
					
				}
		}

		function blurElementWithId(id){
			$timeout(function() { 
				document.getElementById(id).blur();
			});
		} 
		
		function handleBackButton(){
			var request = newRequestFactory.getRequest();
			request.Products = angular.copy($scope.addedProducts);
			newRequestFactory.setRequest(request);
			//newRequestFactory.updateProductSpecificQuestions();
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