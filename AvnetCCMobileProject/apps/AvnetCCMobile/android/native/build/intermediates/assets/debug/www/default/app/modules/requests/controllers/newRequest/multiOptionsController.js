
/* JavaScript content from app/modules/requests/controllers/newRequest/multiOptionsController.js in folder common */
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('multiOptionsController', multiOptionsController);


	/**
	 * controller for product questions multiple answer options functionality
	 */
	function multiOptionsController($scope, $rootScope, $stateParams, newRequestFactory){
		//variables
		$scope.question = newRequestFactory.productSpecificQuestions[$stateParams.productIndex].questions[$stateParams.questionIndex];
		
		//methods
		$scope.handleBackButton = handleBackButton;
		$scope.addOrRemoveOption = addOrRemoveOption;
		$scope.isOptionAdded = isOptionAdded;
		
		function handleBackButton(){			
			broadCastHandleBack();
		}
		
		/**
		 * function to check if an option is added 
		 */
		function isOptionAdded(option){
			var matchedOptions = $scope.question.answer.filter(function(addedOption){
				return addedOption.option == option.option;
			});
			return matchedOptions.length != 0;
		}
		
		/**
		 * function to add or remove an option
		 * @param option
		 */
		function addOrRemoveOption(option){
			if(isOptionAdded(option)){
				var index = $scope.question.answer.map(function(opt){ return opt.option;}).indexOf(option.option);
				$scope.question.answer.splice(index,1);
			}else{
				if($scope.question.max == 1){
					$scope.question.answer = [option];
				}else{
					if($scope.question.answer.length < $scope.question.max){
						$scope.question.answer.push(option);
					}
				}
			}
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