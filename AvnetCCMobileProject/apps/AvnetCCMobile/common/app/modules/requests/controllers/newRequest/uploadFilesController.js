(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('uploadFilesController', uploadFilesController);
	
	/**
	 * controller for file upload
	 * 
	 */
	function uploadFilesController($scope, $rootScope){
		$scope.handleBackButton = handleBackButton;
		
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