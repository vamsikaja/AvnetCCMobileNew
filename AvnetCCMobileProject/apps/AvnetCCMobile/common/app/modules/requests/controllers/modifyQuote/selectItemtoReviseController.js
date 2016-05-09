(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('selectItemtoReviseController', selectItemtoReviseController);
	
	/**
	 * main function that controlls the select item to revise page
	 */
	function selectItemtoReviseController($scope, $rootScope, newRequestFactory, $state, $timeout, $stateParams){
		console.log("came inside selectItemtoReviseController",$stateParams.RequestRevisionSK);	

		$scope.goToReviseQuote = goToReviseQuote;
		$scope.handleBackButton = handleBackButton;
		$scope.changeTabContentTo = changeTabContentTo;
		$scope.onTypeSelected = onTypeSelected;		
		$scope.selectedReviseProduct = newRequestFactory.selectedReviseProduct;
		
		$scope.tabIndex = {
			index:newRequestFactory.selectedReviseTab,
			title: "Select Revise Type"
		};

		WL.App.overrideBackButton(function(e){
			e.preventDefault();
			handleBackButton();
		});

		init();

		/**
		 * initialization function
		 */
		function init(){
			refreshTitle();
			loadLocalQuote();
			loadQuoteConfig();
		}


		/**
		 * function to refresh the title
		 */
		function refreshTitle(){
			console.log('refreshing screen title ', $scope.tabIndex);
			if($scope.tabIndex.index == 1){
				$scope.tabIndex.title = 'Select Revise Type';
			} else if($scope.tabIndex.index == 2){
				$scope.tabIndex.title = 'Select Config To Revise';
			} else {
				$scope.tabIndex.title = 'Select Quote To Revise';
			}	
			//$scope.$apply();
		}

		/**
		 * function to load the quote
		 */
		function loadLocalQuote(){
			console.log('selectItemtoReviseController: Goin to load quote: ', $stateParams.RequestRevisionSK);
			$scope.reviseQuotes = newRequestFactory.selectedRequestQuote.quotes;

			/*
			quoteDetailCacheService.getQuoteDetail($stateParams.RequestRevisionSK)
			.then(function(result){
				
				if(result.length > 0){
					newRequestFactory.selectedRequestQuote = result[0].json;
					$scope.reviseQuotes = result[0].json.quotes;
					
					$scope.reviseQuotes = [];
					if(quotes){
						quotes = quotes.filter(function(e){ return angular.isObject(e) && e.customerViewActivated == 'Y' });
						quotes.forEach(function(quote){
							if(quote.Products && quote.Products.length > 0){
								quote.selectedProduct = quote.Products[0];
								$scope.reviseQuotes.push(angular.copy(quote));
								
								quote.Products.forEach(function(product){
									quote.selectedProduct = product;
									$scope.reviseQuotes.push(angular.copy(quote));
								}); 
								
							}
						});
					}
									
				}else{
					//$rootScope.logout();
				}
			}, function(message){
				console.log('selectItemtoReviseController: Error retrieving quote from local');
			});
			*/
		}

		/**
		 * function to load the quotes config
		 */
		function loadQuoteConfig(){
			newRequestFactory.getNewRequest("modify")
			.then(function(request){

				var allProducts = request.LookupLists || [];

				var filteredProducts = allProducts.filter(function(product){
					return (product.EntityTemplateSk == newRequestFactory.selectedReviseProduct.EntityTemplateSk)
							&& (product.IsSpecialDesign == true);
				});

				$scope.isReviseConfigurable = filteredProducts.length > 0;

				if($scope.isReviseConfigurable){
					var fileTypes = newRequestFactory.selectedRequestQuote.requestTemplateParser
                    	.filter(function(element){ return element.RequestTemplateSk === newRequestFactory.selectedReviseProduct.EntityTemplateSk && element.IsRevisable; })
                    	.map(function (element) { return element.FileExtensionCode.replace('.', '').toUpperCase(); });


                    console.log(newRequestFactory.selectedRequestQuote, newRequestFactory.selectedRequestQuote)
			        $scope.configFiles = newRequestFactory.selectedRequestQuote.entityFiles.filter(function (element) { 
			        	return (element.ActionSk != null) && (element.SourceReferenceID == newRequestFactory.selectedReviseProduct.OldRequestNumber) && (fileTypes.indexOf(element.AttachmentExtension.replace('.', '').toUpperCase()) >= 0 ); 
			        });

		            console.log('selectItemtoReviseController: config loaded',fileTypes,$scope.configFiles,newRequestFactory.selectedRequestQuote,newRequestFactory.selectedReviseProduct);
				}
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
			
		}

		/**
		 * function to navigate to teh reviseQuote page
		 * @param isConfig
		 * @param quoteOrconfig
		 */
		function goToReviseQuote(isConfig, quoteOrConfig){
			console.log("Going to reviseQuote", quoteOrConfig, isConfig);
			newRequestFactory.isReviseConfig = isConfig;

			if(isConfig){				
				newRequestFactory.selectedReviseQuote = undefined;
				newRequestFactory.selectedReviseConfig = quoteOrConfig;
				//newRequestFactory.request.reviseQuoteName = 'Revise Config';	
			} else {
				newRequestFactory.selectedReviseQuote = quoteOrConfig;	
				newRequestFactory.selectedReviseConfig = undefined;
				//newRequestFactory.request.reviseQuoteName = 'Revise Quote';
			}
			
			$state.go('reviseQuote', {'RequestRevisionSK':$stateParams.RequestRevisionSK});
		}

		/**
		 * function triggered when the revise type is selected
		 */
		function onTypeSelected(isConfig){
			if(isConfig){
				if($scope.configFiles && $scope.configFiles.length > 1){
					newRequestFactory.selectedReviseTab = 2;
					changeTabContentTo(2);					
				} else if($scope.configFiles && $scope.configFiles.length == 1){
					newRequestFactory.selectedReviseTab = 1;
					goToReviseQuote(true, $scope.configFiles[0]);
				} else {
					//no configs present go to revise detail
					newRequestFactory.selectedReviseTab = 1;
					goToReviseQuote(true);
				}
			} else {
				if($scope.reviseQuotes && $scope.reviseQuotes.length > 1){
					newRequestFactory.selectedReviseTab = 3;
					changeTabContentTo(3);
				} else if($scope.reviseQuotes && $scope.reviseQuotes.length == 1){
					newRequestFactory.selectedReviseTab = 1;
					goToReviseQuote(false, $scope.reviseQuotes[0]);
				} else {
					newRequestFactory.selectedReviseTab = 1;
					goToReviseQuote(false);
				}
			}
		}

		/**
		 * function to change the tab
		 */
		function changeTabContentTo(index){
			$timeout(function(){
				
			},0);
			$scope.tabIndex.index = index;
			refreshTitle();			
		}

		/**
		 * function to handle the back button
		 */
		function handleBackButton(){
			if($scope.tabIndex.index == 1){
				resetFields();
				broadCastHandleBack();
			} else {
				changeTabContentTo(1);
			}
		}
		
		function broadCastHandleBack(){
			$rootScope.$broadcast("handleBack", {'RequestRevisionSK':$stateParams.RequestRevisionSK});
			//history.back();
		}

		/**
		 * function to reset the fields
		 */
		function resetFields(){
			newRequestFactory.isReviseConfig = false;
			newRequestFactory.selectedReviseQuote = undefined;
			newRequestFactory.selectedReviseConfig = undefined;
			newRequestFactory.selectedReviseTab = 1;

		}

}

})();