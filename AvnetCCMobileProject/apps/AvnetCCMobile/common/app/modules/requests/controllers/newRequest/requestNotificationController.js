/**
 * 
 */
(function(){
	angular.module('ccMobile.requests')
	.controller('requestNotificationController', requestNotificationController);
	
	/**
	 * controller for the request notification screen
	 */
	function requestNotificationController($state, $scope, $rootScope, newRequestFactory, recentNotificationEmails,$timeout){
		
		WL.App.overrideBackButton(function(e){
			e.preventDefault();
			handleBackButton();
		});
		$scope.enteredEmail={};
		$scope.enteredEmail.email = newRequestFactory.temporaryEmail;
		$scope.addedContacts = newRequestFactory.temporaryNotificationEmails || [];// newRequestFactory.temporaryNotificationEmails contains emails added via typeHeader and device contacts
		$scope.receivedContacts = (newRequestFactory.getRequest().Contacts || []).filter(function(e){return e.IsNotifyAssigned==true;});
		//$scope.selectedContacts = newRequestFactory.getRequest().notificationEmails || [];
		$scope.selectedContacts = newRequestFactory.temporarySelectedContacts || [];
		$scope.showOptions=false;
		$scope.showSelectionButtons=true;
		$scope.validateEmail = validateEmail;
		$scope.addEmail = addEmail;
		$scope.addNotificationContacts = addNotificationContacts;
		$scope.handleBackButton = handleBackButton;
		$scope.showDeviceContacts = showDeviceContacts;
		$scope.emailInputFocus=emailInputFocus;
		$scope.emailInputBlur=emailInputBlur;
		$scope.showAddedContactDeleteButton=showAddedContactDeleteButton;
		$scope.hideAddedContactDeleteButton=hideAddedContactDeleteButton;
		$scope.deleteAddedContact=deleteAddedContact;
		$scope.showReceivedContactDeleteButton=showReceivedContactDeleteButton;
		$scope.hideReceivedContactDeleteButton=hideReceivedContactDeleteButton;
		$scope.deleteReceivedContact=deleteReceivedContact;
		$scope.toggleContactSelection=toggleContactSelection;
		$scope.isContactSelected=isContactSelected;
		$scope.areAllContactsSelected=areAllContactsSelected;
		$scope.toggleAllSelection=toggleAllSelection;
		$scope.getUnselectedContactsOnly=getUnselectedContactsOnly;
		$scope.blurInput=blurInput;
		
		/**
		 * function to fetch the recent emails
		 */
		function getRecentEmails(){
			recentNotificationEmails.getRecentEmails()
			.then(function(res){
				$scope.recentNotificationMails = res;
			}, function(){
				$scope.recentNotificationMails = [];
			});
		}
		getRecentEmails();
		
		/**
		 * function to display the device contacts
		 */
		function showDeviceContacts(){
			newRequestFactory.temporarySelectedContacts = $scope.selectedContacts;
			$state.go("deviceContacts");
		}
		
		/**
		 * function to add a notification
		 */
		function addNotificationContacts(){
			var request = newRequestFactory.getRequest();
			request.notificationEmails = $scope.selectedContacts;
			newRequestFactory.setRequest(request);
			//handleBackButton();
		}
			
		/**
		 * function to validate the email address
		 * @param contactEmail
		 */
		function validateEmail(contactEmail) {
			contactEmail=contactEmail.toLowerCase();
		    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
		    return ( regex.test(contactEmail) && !isEmailPresentInTheList($scope.addedContacts , contactEmail) && !isEmailPresentInTheList($scope.receivedContacts , contactEmail)) ? true : false;
		}

		/**
		 * function to check if the email is present in the list
		 * @param email list 
		 * @param email
		 */
		function isEmailPresentInTheList(list,email){
			if(
				list.map(function(e){
					if(angular.isObject(e)){
						return e.EmailAddress
					}
					else{
						return e;
					}
				}).indexOf(email) == -1
			){
				return false;
			}
			return true;
		}

		/**
		 * function to check if a contact has been selected
		 * @param contact
		 */
		function isContactSelected(contact){
			if(angular.isObject(contact)){
				return ['receivedContact',$scope.selectedContacts.filter(function(e){ return angular.isObject(e) }).map(function(e){ return e.ContactId}).indexOf(contact.ContactId)]
			}
			else{
				return ['addedContact',$scope.selectedContacts.filter(function(e){ return !angular.isObject(e) }).map(function(e){ return e}).indexOf(contact)]
					
			}
		}
			
		/**
		 * function to add the contact email
		 * @param contactEmail
		 */
		function addEmail(contactEmail){
			contactEmail=contactEmail.toLowerCase();
			if($scope.addedContacts.indexOf(contactEmail)==-1){
				recentNotificationEmails.addEmail(contactEmail)
				.then(function(){
					getRecentEmails();
				}, function(){
					getRecentEmails();
				});
				$scope.addedContacts.push(contactEmail);
				$scope.selectedContacts.push(contactEmail);
				$timeout(function(){
					document.getElementById('notificationEmail').blur();
					$scope.enteredEmail.email='';
				});
			}
		}

		/**
		 * function to toggle the contact selection
		 * @param contact
		 */
		function toggleContactSelection(contact){
			var isContactSelectedReturnValue = isContactSelected(contact);
			var selectedReceivedContactsLength=$scope.selectedContacts.filter(function(e){ return angular.isObject(e) }).length;
			if( isContactSelectedReturnValue[1] == -1){
				//contact not selected
				if(isContactSelectedReturnValue[0]=='addedContact'){
					$scope.selectedContacts.push(contact);
				}
				else if(isContactSelectedReturnValue[0]=='receivedContact'){
					$scope.selectedContacts.splice(selectedReceivedContactsLength,0,contact);
				}
			}
			else{
				if(isContactSelectedReturnValue[0]=='addedContact'){
					$scope.selectedContacts.splice(selectedReceivedContactsLength+isContactSelectedReturnValue[1],1);
				}
				else if(isContactSelectedReturnValue[0]=='receivedContact'){
					$scope.selectedContacts.splice(isContactSelectedReturnValue[1],1);
				}
			}
		}

		/**
		 * function to bring email input to focus
		 */
		function emailInputFocus(){
			$scope.showOptions=true;
			$scope.showSelectionButtons=false;
		}

		/**
		 * function to blur the email input
		 */
		function emailInputBlur(){
			$scope.showOptions=false;
			$scope.showSelectionButtons=true;
		}

		/**
		 * function to show  the delete button for the added contact
		 * @param index
		 * @param Event
		 */
		function showAddedContactDeleteButton(index,event){
			event.stopImmediatePropagation();
			event.stopPropagation();
			$scope.revealedAddedContactIndex = index;
			$scope.revealedReceivedContactIndex= "-1";

		}

		/**
		 * function to hide the delete button for the contact
		 * @param index
		 * @param Event
		 */
		function hideAddedContactDeleteButton(index,event){
			event.stopImmediatePropagation();
			event.stopPropagation();
			if(index == $scope.revealedAddedContactIndex){
				$scope.revealedAddedContactIndex= "-1";
			}	
		}

		function deleteAddedContact(contact,index){
			/*$scope.addedContacts.splice(index,1);
			var selectedIndex=$scope.selectedContacts.indexOf(contact);
			if(selectedIndex != -1)
				$scope.selectedContacts.splice(selectedIndex,1);
			$scope.revealedContactIndex= "-1";*/
		}

		/**
		 * function to show the recieved contact delete button
		 * @param index
		 * @param Event
		 */
		function showReceivedContactDeleteButton(index,event){
			event.stopImmediatePropagation();
			event.stopPropagation();
			$scope.revealedReceivedContactIndex = index;
			$scope.revealedAddedContactIndex= "-1";
		}

		/**
		 * function to hide the recieved contact button
		 * @param index
		 * @param Event
		 */
		function hideReceivedContactDeleteButton(index,event){
			event.stopImmediatePropagation();
			event.stopPropagation();
			if(index == $scope.revealedReceivedContactIndex){
				$scope.revealedReceivedContactIndex= "-1";
			}	
		}

		/**
		 * function to hide the recieved contact
		 * @param index
		 */
		function deleteReceivedContact(index){
			/*$scope.addedContacts.splice(index,1);
			$scope.revealedContactIndex= "-1";*/
			/*var selectedIndex=$scope.selectedContacts.filter()indexOf(contact);
			if(selectedIndex != -1)
				$scope.selectedContacts.splice(selectedIndex,1);
			$scope.revealedContactIndex= "-1";*/
		}


		/**
		 * function to check if all contacts are selected
		 */
		function areAllContactsSelected(){
			return ($scope.addedContacts.length + $scope.receivedContacts.length) == $scope.selectedContacts.length
		}

		/**
		 * function to toggle all contact selection
		 */
		function toggleAllSelection(){
			if(areAllContactsSelected()){
				//deselectall
				$scope.selectedContacts.length=0;
			}
			else{
				$scope.selectedContacts=$scope.receivedContacts.concat($scope.addedContacts);
			}
		}

		/**
		 * function to get the unselected contacts
		 * @param element
		 */
		function getUnselectedContactsOnly(element){
			return $scope.addedContacts.indexOf(element.email)==-1 ;
		}

		/**
		 * function to blur the input field
		 */
		function blurInput(id){
			$timeout(function(){
				document.getElementById('notificationEmail').blur();
			});
		}
		
		function handleBackButton(){
			//addNotificationContacts();
			newRequestFactory.temporaryNotificationEmails = $scope.addedContacts || [];
			newRequestFactory.temporaryEmail = "";
			newRequestFactory.temporarySelectedContacts=angular.copy($scope.selectedContacts);
			var request = newRequestFactory.getRequest();
			request.notificationEmails = $scope.selectedContacts;
			newRequestFactory.setRequest(request);
			broadCastHandleBack();
		}
		
		function broadCastHandleBack(){
			$rootScope.$broadcast("handleBack");
		}
	}
})();