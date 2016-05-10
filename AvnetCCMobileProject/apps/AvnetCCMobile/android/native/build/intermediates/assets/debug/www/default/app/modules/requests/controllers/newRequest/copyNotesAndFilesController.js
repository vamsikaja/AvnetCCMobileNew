
/* JavaScript content from app/modules/requests/controllers/newRequest/copyNotesAndFilesController.js in folder common */
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('copyNotesAndFilesController', copyNotesAndFilesController);
	
	/**
	 * function that controls the copy notes and files functionality
	 */
	function copyNotesAndFilesController($scope, $rootScope, newRequestFactory, $state, $timeout, $stateParams){		
		
		$scope.handleBackButton = handleBackButton;
		$scope.request = newRequestFactory.getRequest();
		$scope.toggleCopyAll = toggleCopyAll;
		$scope.toggleCopyAllFiles = toggleCopyAllFiles;
		$scope.toggleCopyAllNotes = toggleCopyAllNotes;
		$scope.isCopyAll = isCopyAll;
		
		WL.App.overrideBackButton(function(e){
			e.preventDefault();
			handleBackButton();
		});


		/**
		 * function to check to copy all files and notes
		 */
		function isCopyAll(){
			return (!$scope.request.isRemoveAllFiles && !$scope.request.isRemoveAllNotes);
		}

		function toggleCopyAll(){
			if(isCopyAll()){
				$scope.request.isRemoveAllFiles = true;
				$scope.request.isRemoveAllNotes = true;
			} else {
				$scope.request.isRemoveAllFiles = false;
				$scope.request.isRemoveAllNotes = false;
			}
		}



		/**
		 * function to toggle the copy/remove all files
		 */
		function toggleCopyAllFiles(){
			if($scope.request.isRemoveAllFiles){
				$scope.request.isRemoveAllFiles = false;
			} else {
				$scope.request.isRemoveAllFiles = true;
			}
		}

		/**
		 *  function to toggle the copy/remove all notes
		 */
		function toggleCopyAllNotes(){
			if($scope.request.isRemoveAllNotes){
				$scope.request.isRemoveAllNotes = false;
			} else {
				$scope.request.isRemoveAllNotes = true;
			}
		}

		/**
		 * function to handle back button action
		 */
		function handleBackButton(){
			newRequestFactory.setRequest($scope.request);
			broadCastHandleBack();
		}
		
		/**
		 * function to broadcast the back button action
		 */
		function broadCastHandleBack(){
			$rootScope.$broadcast("handleBack");
			//history.back();
		}	
	}
})();