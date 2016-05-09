(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('deviceContactsController', productSpecificQuestionsController)
		.controller('userEmailsController', userEmailsController);


	/**
	 * function that controls the product specific questions functionality
	 */
	function productSpecificQuestionsController($scope, $rootScope, newRequestFactory,$timeout, loadingOverlayService){
		$scope.handleBackButton = handleBackButton;
		$scope.orderContacts=orderContacts;
		$scope.blurElement=blurElement;
		$scope.showAlphabetScrolling=true;
		loadingOverlayService.show();
		navigator.contacts.find(["name"],function(res){
			$scope.$apply(function(){
				$scope.contacts = res.map(function(cnt){
					var contact = {
							id : cnt.id,
							displayName : cnt.displayName
					};
					if(cnt.displayName == null){
						if(!cnt.name.formatted || cnt.name.formatted == ""){
							if(cnt.emails && cnt.emails.length > 0){
								contact.displayName = cnt.emails[0].value;
							}else{
								contact.displayName = "Not Specified";
							}
						}else{
							contact.displayName = cnt.name.formatted;
						}
					}
					return contact;
				});
				loadingOverlayService.hide();
			});
		},function(){
			$scope.$apply(function(){
				$scope.contacts = [];
				loadingOverlayService.hide();
			});
		},{
			filter: "",
			multiple: true,
		});

		/**
		 * function to order the contacts in a specific format
		 * 
		 */
		function orderContacts(contact){
			var charCode = (contact.displayName).toUpperCase().charCodeAt(0);
			if(charCode >= 65 && charCode<=122){
				return contact.displayName;
			}
			else if(charCode >= 48 && charCode<=57){
				return "zzzzz"+(charCode + 48);
			}
			else{
				return "zzzzzzzz"+(charCode + 122);
			}
		}

		/**
		 * function to blur any element in the html
		 * @param elementId
		 */
		function blurElement(elementId){
			$timeout(function(){
				document.getElementById(elementId).blur();
			});
		}
		
		/**
		 * function to handle the back button action
		 */
		function handleBackButton(){
			broadCastHandleBack();
		}
		
		/**
		 * function to broadcast the back button action
		 */
		function broadCastHandleBack(){
			$rootScope.$broadcast("handleBack");
		}
		
		WL.App.overrideBackButton(function(e){
			e.preventDefault();
			handleBackButton();
		});
	}
	
	
	/**
	 * controller for selecting the emails from the selected contacts
	 */
	function userEmailsController($scope, $stateParams, $rootScope, newRequestFactory){
		$scope.handleBackButton = handleBackButton;
		$scope.selectedContacts = newRequestFactory.temporarySelectedContacts || [];
		$scope.addedContacts = newRequestFactory.temporaryNotificationEmails;
		
		$scope.isEmailAdded = isEmailAdded;
		$scope.addOrRemoveEmail = addOrRemoveEmail;
		
		function isEmailAdded(emailId){
			emailId=emailId.toLowerCase();
			return $scope.selectedContacts.indexOf(emailId) != -1;
		}
		
		function addOrRemoveEmail(emailId){
			emailId=emailId.toLowerCase();
			if(isEmailAdded(emailId)){
				var index = $scope.selectedContacts.indexOf(emailId);
				$scope.selectedContacts.splice(index, 1);
			}else{
				$scope.selectedContacts.push(emailId);
				if($scope.addedContacts.indexOf(emailId) == -1)
					$scope.addedContacts.push(emailId);
			}
		}
		
		navigator.contacts.find(["id"],function(res){
			if(res.length > 0){
				$scope.$apply(function(){
					$scope.emails = res[0].emails.map(function(e){ return e.value;});
				});
			}
		},function(){
		},{
			filter: $stateParams.id,
			multiple: true,
		});
		
		function handleBackButton(){
			newRequestFactory.temporaryNotificationEmails=$scope.addedContacts;
			newRequestFactory.temporarySelectedContacts=$scope.selectedContacts;
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