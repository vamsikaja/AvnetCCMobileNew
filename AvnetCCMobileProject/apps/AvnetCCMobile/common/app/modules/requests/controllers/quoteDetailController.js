var newRequestFact;
(function(){
	'use strict';
	
	angular.module('ccMobile.requests')
		.controller('quoteDetailController', quoteDetailController);
	/**
	 * quotesDetail controller main
	 */
	function quoteDetailController($scope, $stateParams,quoteDetailFactory,quoteDetailCacheService,$rootScope,loginCacheService, loadingOverlayService,$timeout,$state, newRequestFactory){
		newRequestFact=newRequestFactory;
		$stateParams.RequestRevisionSK=angular.copy(localStorage.getItem('RequestRevisionSK'));
		$scope.tabContent='details';
		$scope.showEndUserInfo=true;
		$scope.showProductInfo=true;
		$scope.changeTabContentTo=changeTabContentTo;
		$scope.transformLeft='';
		$scope.title = 'Quote Request';
		
		$scope.showFileShare=showFileShare;
		$scope.removeFileShare=removeFileShare;
		$scope.revealedFileIdIndex = '-1';
		
		$scope.toggleQuoteAccordion = toggleQuoteAccordion;
		$scope.revealedQuoteAccordionIndex = '-1';
		$scope.shareFile = shareFile;	
		$scope.getNotesHeading = getNotesHeading;
		$scope.getNotesComments = getNotesComments;
		$scope.showNotesDescription=showNotesDescription;
		$scope.showQuotesDescription=showQuotesDescription;
		$scope.tabIndex = {index:4};
		$scope.notesIndex = {index:1};
		$scope.handleBackButton = handleBackButton;
		$scope.hideFilesHelpScreen=hideFilesHelpScreen;
		$scope.hidedetailsHelpScreen=hidedetailsHelpScreen;
		$scope.hideQuoteNotesDescriptionHelpScreen=hideQuoteNotesDescriptionHelpScreen;
		$scope.showEditRequestName = showEditRequestName;
		$scope.showAddNote = showAddNote;
		$scope.addNewNote = addNewNote;
		$scope.updateRequestName = updateRequestName;
		$scope.cancelEditRequestName = cancelEditRequestName;
		$scope.cancelAddNote = cancelAddNote;
		$scope.showEditEndUser=showEditEndUser;
		$scope.updateEditEndUser = updateEditEndUser;
		$scope.cancelEditEndUser = cancelEditEndUser;
		$scope.redirectToSelectEndUserScreen=redirectToSelectEndUserScreen;
		$scope.redirectToRequestNotification = redirectToRequestNotification;
		$scope.hideModal=hideModal;
		$scope.goToSelectProductToRevise = goToSelectProductToRevise;
		$scope.getCustomProductName=getCustomProductName;
		
		$rootScope.showDetailsHeaderButton=true;
		$rootScope.toggleRequestActionButtons=toggleRequestActionButtons;
		$scope.goToRequestAction=goToRequestAction;
		$scope.closeRequestActionButtons=closeRequestActionButtons;
		$scope.hideHeaderButton=hideHeaderButton;
		$scope.blurElementWithId=blurElementWithId;
		
		var tempIsRequestRevisableFlag;
		var endUserChangedSuccessfully;
		var notedAddedSuccessfully;
		var quoteDetailsHelpScreenShownLocal;
		var quoteNoteDetailsHelpScreenShownLocal;
		var quoteFilesHelpScreenShownLocal;

		$scope.editValues = {
				"editRequestNameValue" : ""
		}
		
		$scope.newNote = {
			"noteValue": "",
			"recipients": []
		}
		
		/**
		 * function to navigate to revise request page from the Quote Details page.
		 */
		function goToSelectProductToRevise(){
			newRequestFactory.selectedRequestQuote = $scope.quoteDetail;

			if(newRequestFactory.selectedRequestQuote.products.length > 1){
				$state.go('selectProductToRevise',{'RequestRevisionSK':$stateParams.RequestRevisionSK});	
			} else {
				// if there is only one product then just skip the select products screen
				newRequestFactory.selectedReviseProduct = newRequestFactory.selectedRequestQuote.products[0];
				$state.go('selectItemtoRevise',{'RequestRevisionSK':$stateParams.RequestRevisionSK});
			}			
		}
		
		$scope.$on('online',function(){
			if($scope.quoteDetail == undefined){
				loadQuoteDetail();
			}
		});

		$scope.$on('offline',function(){
			
		});
		
		if(quoteDetailFactory.quoteDetailEndUserClicked){
			$scope.quoteDetail=quoteDetailFactory.quoteDetailData;
			angular.element(document).ready(function(){
				$scope.showEditEndUser();
	    	});
		}
		else if(quoteDetailFactory.addNoteSendNotificationClicked){
			$scope.quoteDetail=quoteDetailFactory.quoteDetailData;
			angular.element(document).ready(function(){
				$scope.showAddNote();
	    	});
		}
		else{
			$rootScope.showDetailsHeaderButton=true;
			loadQuoteDetail();
		}	

		/**
		 * function to load the quote.
		 * @param result - result from the service
		 */
		function loadLocalQuote(result){
			console.log('in loadLocalQuote success method');
			$scope.quoteDetail = result;
			//sorting notes
			$scope.quoteDetail.notes=$scope.quoteDetail.notes.sort(function(a,b){
				if(a.CreateDate > b.CreateDate)
					return -1;
				else if(a.CreateDate == b.CreateDate)
					return 0;
				else
					return 1;
			});
			$scope.title = $scope.quoteDetail.requestName;
			$scope.editValues.editRequestNameValue = $scope.quoteDetail.requestName || '';
			if(localStorage.getItem(localStorage.getItem('LoginId')+'hideRequestDetailsHelpScreen') != "true"){
				localStorage.setItem(localStorage.getItem('LoginId')+'hideRequestDetailsHelpScreen',"true");
				angular.element(document).ready(function (){
					quoteDetailsHelpScreenShownLocal=true;
			        $scope.revealedrequestIdIndex = 0;
			        $rootScope.quoteDetailsHelpScreenShown=true;
			        tempIsRequestRevisableFlag=$scope.quoteDetail.IsRequestRevisable;
			        $scope.quoteDetail.IsRequestRevisable=true;
			        $scope.requestActionButtonsShown=true;
					$rootScope.$broadcast("toggle-quoteDetailsHelpModal");
			    });
			}
			addProductIndexCount($scope.quoteDetail.products);
			function addProductIndexCount(products){
				for(var i=0;i<products.length;i++){
					products[i].productIndexCount=products.slice(0,i).filter(function(e){return e.EntityTemplateSk == products[i].EntityTemplateSk}).length +1;
					
				}
			}
			if(endUserChangedSuccessfully){
				$scope.showSuccessMessage=true;
    			setTimeout(function(){
    				endUserChangedSuccessfully=false;
    				$scope.showSuccessMessage=false;
    			},3000);
			}
			else if(notedAddedSuccessfully){
				$scope.showSuccessMessage=true;
    			setTimeout(function(){
    					notedAddedSuccessfully=false;
		    			$scope.showSuccessMessage=false;
	    		},3000);
			}
			/*quoteDetailCacheService.getQuoteDetail($stateParams.RequestRevisionSK)
			.then(function(result){
						
			}, function(error){
				console.log("quoteDetailController: Error while retrieving quotes details", error);
				WL.SimpleDialog.show("Service Unavailable", "Could not fetch details. Please try again later.", [{ 
						text : "OK", 
						handler : function() {handleBackButton();}}]);
			});*/
		}
		
		/**
		 * wrapper function to load the quote details
		 *
		 */
		function loadQuoteDetail(){
			quoteDetailFactory.loadQuoteDetailData($stateParams.RequestRevisionSK)
			.then(function(data){
				loadLocalQuote(data);
			},function(message){
				if(message == "Service unavailable"){
					//loadLocalQuote(); //disabling cache
					//$rootScope.logout();
					WL.SimpleDialog.show("Service Unavailable", "Could not fetch details. Please try again later.", [{ text : "OK", handler : function() {}}]);
				}else if(message == "no network"){
					WL.SimpleDialog.show("Check Network Connection", "Could not fetch details. Please try again later.", [{ text : "OK", handler : function() {}}]);
				}else{
					WL.SimpleDialog.show("Permission Denied", message, [{ text : "OK", handler : function() { $state.go('quotes');}}]);
				}
			});
		}


		/**
		 * function to get the product name using a particular logic
		 * @param product - product data 
		 */
		function getCustomProductName(product){
			if(product.ProductName != product.SupplierName + " - " + product.EntityTemplateName)
				return product.ProductName;

			var productName = product.EntityTemplateName;
			
			if(product.productIndexCount > 0){
				if(product.productIndexCount != 1) {
					productName = productName + ' ' + product.productIndexCount;
				}
			} 

			return productName;			
		}

		/**
		 * function to change the tab content
		 * @param index - tab index
		 */
		function changeTabContentTo(index){
			$scope.closeRequestActionButtons();
			$timeout(function(){
				$scope.tabIndex.index = index;
			},0);
			if(index == 3){
				if((localStorage.getItem(localStorage.getItem('LoginId')+'hideRequestFilesHelpScreen') != "true" ) && !($scope.quoteDetail==undefined || $scope.quoteDetail.entityFiles.length==0)){
					localStorage.setItem(localStorage.getItem('LoginId')+'hideRequestFilesHelpScreen',"true");
					$scope.revealedFileIdIndex=0;
					quoteFilesHelpScreenShownLocal=true;
					$rootScope.$broadcast("toggle-quoteFilesHelpModal");
				}
			}
		}

		/**
		 * function to show file share
		 * @param index
		 */
		function showFileShare(index){
			$scope.revealedFileIdIndex = index;
		}

		/**
		 * function to remove file share
		 * @param index
		 */
		function removeFileShare(index){
			if(index == $scope.revealedFileIdIndex){
				$scope.revealedFileIdIndex= "-1";
			}	
		}
		/**
		 * function to display the edit request name option
		 */
		function showEditRequestName() {
			$rootScope.showDetailsHeaderButton=false;
			$scope.requestActionButtonsShown=false;
			$scope.editValues.editRequestNameValue = $scope.quoteDetail.requestName;
			$rootScope.$broadcast("toggle-editRequestName");
		}
		
		/**
		 * function to cancel the edit request name
		 */
		function cancelEditRequestName() {
			$rootScope.showDetailsHeaderButton=true;
			$rootScope.$broadcast("toggle-editRequestName");
		}

		/**
		 * function to update the request name
		 */
		function updateRequestName(){
			$rootScope.showDetailsHeaderButton=true;
			//alert("requestSk: " + $stateParams.RequestRevisionSK + " newRequestName: " + $scope.editValues.editRequestNameValue);
			quoteDetailFactory.editRequestName($stateParams.RequestRevisionSK, $scope.editValues.editRequestNameValue)
			.then(function(response) {
				//alert("success. close modal");
				if(response.invocationResult.data.ReturnResult.ResultMessage=="Completed Successfully" || response.invocationResult.data.ReturnResult.ResultMessage == "An error occurred retrieving the Quote List from Q2O"){
					$scope.quoteDetail.requestName = $scope.editValues.editRequestNameValue;
					$scope.successMessage="Request Name Changed Successfully";
					$scope.showSuccessMessage=true;
		    		setTimeout(function(){
		    			$scope.showSuccessMessage=false;
		    		},3000);
					$rootScope.$broadcast("toggle-editRequestName");
				}
				else{
					$scope.requestsErrorMessage="Unable to edit request name. Please check your connection and try again";
					WL.SimpleDialog.show("Service Unavailable", $scope.requestsErrorMessage, [{ text : "OK", handler : function() {cancelEditRequestName();}}]);
				}
			},function(error){
				$scope.requestsErrorMessage="Unable to edit request name. Please check your connection and try again";
				WL.SimpleDialog.show("Service Unavailable", $scope.requestsErrorMessage, [{ text : "OK", handler : function() {cancelEditRequestName();}}]);
				//logout();
			});
		}
		
		/**
		 * function to show the add note functionality
		 */
		function showAddNote() {
			quoteDetailFactory.quoteDetailData=angular.copy($scope.quoteDetail);
			$rootScope.showDetailsHeaderButton=false;
			$scope.requestActionButtonsShown=false;
			$rootScope.$broadcast("toggle-addNoteModalView");
			if(newRequestFactory.getRequest() == undefined){
				newRequestFactory.getNewRequest('new')
				.then(function(request){
					$scope.request = request;
					populateNotificationContactsStringAndCount();
				},function(){
					WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
					  text : "OK",
					  handler: function(){
					  	$scope.cancelAddNote();	
					  }
					}]);
				});
			}else{
				$scope.request = newRequestFactory.getRequest();
				populateNotificationContactsStringAndCount();
				if(quoteDetailFactory.addNoteSendNotificationClicked){
					$scope.newNote.noteValue=quoteDetailFactory.note;
					$timeout(function(){
						$scope.changeTabContentTo(2);
					},300);
				}
			}
			quoteDetailFactory.addNoteSendNotificationClicked=true;
			
			/**
			 * function to populate the contacts
			 */
			function populateNotificationContactsStringAndCount(){
				if(!(($scope.request.notificationEmails==undefined) || ($scope.request.notificationEmails.length==0))){
					$scope.correctlyFilledNotificationsList=true;
					var selectedAddedEmails=$scope.request.notificationEmails.filter(function(e){ return !angular.isObject(e) }).map(function(e){ return e})
					$scope.notificationListCount=selectedAddedEmails.length;
					$scope.notificationListString=selectedAddedEmails.join(', ');

					var selectedReceivedEmails=$scope.request.notificationEmails.filter(function(e){ return angular.isObject(e) }).map(function(e){ return e.EmailAddress});
					if(selectedReceivedEmails.length!=0 && selectedAddedEmails.length!=0)
						$scope.notificationListString=$scope.notificationListString+', ';
					$scope.notificationListCount=$scope.notificationListCount+selectedReceivedEmails.length;
					$scope.notificationListString=$scope.notificationListString+selectedReceivedEmails.join(', ');
				}
				else{
					$scope.notificationListCount=0;
					$scope.notificationListString="Please select notifications";
				}
			}
		}
		
		/**
		 * function to cancel add note
		 */
		function cancelAddNote(){
			$rootScope.showDetailsHeaderButton=true;
			$rootScope.$broadcast("toggle-addNoteModalView");	
			quoteDetailFactory.addNoteSendNotificationClicked=false;
			$scope.newNote.noteValue="";
			$scope.request.notificationEmails=[];
			newRequestFactory.temporaryNotificationEmails=[];
			newRequestFactory.temporarySelectedContacts=[];

			newRequestFactory.setRequest(angular.copy($scope.request));
		}
		
		/**
		 * function to add new note
		 */
		function addNewNote() {
			$rootScope.showDetailsHeaderButton=true;
			
			var adHocRecipients = ($scope.request.notificationEmails || []).filter(function(contact){
				return !angular.isObject(contact);
			});
			var recipients = ($scope.request.notificationEmails || []).filter(function(contact){
				return angular.isObject(contact);
			}).map(function(contact) { return contact.EmailAddress });
			
			quoteDetailFactory.addNote($stateParams.RequestRevisionSK, $scope.newNote.noteValue, recipients, adHocRecipients)
			.then(function(response){
				if(response.invocationResult.data.ReturnResult.ResultMessage=="Completed Successfully" || response.invocationResult.data.ReturnResult.ResultMessage == "An error occurred retrieving the Quote List from Q2O" ){
					$scope.newNote.noteValue="";
					$scope.successMessage="Note Added Successfully";
					notedAddedSuccessfully=true;
					$rootScope.$broadcast("toggle-addNoteModalView");
					
					quoteDetailFactory.addNoteSendNotificationClicked=false;
					$scope.request.notificationEmails=[];
					newRequestFactory.temporaryNotificationEmails=[];
					newRequestFactory.temporarySelectedContacts=[];
					newRequestFactory.setRequest(angular.copy($scope.request));
					
					loadQuoteDetail();
				}
				else{
					$scope.requestsErrorMessage="Unable to create new note. Please check your connection and try again";
					WL.SimpleDialog.show("Service Unavailable", $scope.requestsErrorMessage, [{ text : "OK", handler : function() {quoteDetailFactory.addNoteSendNotificationClicked=false;$scope.cancelAddNote();}}]);
				}
			},function(error){
				$scope.requestsErrorMessage="Unable to create new note. Please check your connection and try again";
				WL.SimpleDialog.show("Service Unavailable", $scope.requestsErrorMessage, [{ text : "OK", handler : function() {quoteDetailFactory.addNoteSendNotificationClicked=false;$scope.cancelAddNote();}}]);
			});
		}
		
		/**
		 * function to display edit end user option
		 */
		function showEditEndUser(){
			quoteDetailFactory.quoteDetailData=angular.copy($scope.quoteDetail);
			$scope.hideHeaderButton();
			$scope.requestActionButtonsShown=false;
			$scope.quoteDetailEndUserClicked=angular.copy(quoteDetailFactory.quoteDetailEndUserClicked);
			$rootScope.$broadcast("toggle-editEndUser");
			if(newRequestFactory.getRequest() == undefined){
				newRequestFactory.getNewRequest('new')
				.then(function(request){
					$scope.request = request;
					if(!$scope.quoteDetailEndUserClicked && $scope.quoteDetail.partnerDetails!=undefined){
						var requestEndUser=$scope.request.RecentEndUsers.filter(function(endUser){
							return endUser.PartnerId==$scope.quoteDetail.partnerDetails.endUserAccountId;
						})[0];
						$scope.request.addedEndUsers=[requestEndUser];
						newRequestFactory.setRequest(angular.copy($scope.request));
					}
					quoteDetailFactory.quoteDetailEndUserClicked=true;
				},function(){
					//Error Callback
					console.log("newRequestController: error retrieving newRequest");
					WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
					  text : "OK",
					  handler: function(){
					  	/*$state.go('quotes');*/
					  	$scope.cancelEditEndUser();
					  	//quoteDetailFactory.quoteDetailEndUserClicked=false;	
					  }
					}]);
				});
			}else{
				$scope.request = newRequestFactory.getRequest();
				if(!$scope.quoteDetailEndUserClicked && $scope.quoteDetail.partnerDetails!=undefined){
					var requestEndUser=$scope.request.RecentEndUsers.filter(function(endUser){
						return endUser.PartnerId==$scope.quoteDetail.partnerDetails.endUserAccountId;
					})[0];
					$scope.request.addedEndUsers=[requestEndUser];
					newRequestFactory.setRequest(angular.copy($scope.request));
				}
				quoteDetailFactory.quoteDetailEndUserClicked=true;
			}
		}

		function cancelEditEndUser(){
			$rootScope.showDetailsHeaderButton=true;
			quoteDetailFactory.quoteDetailEndUserClicked=false;
			$scope.selectEndUserError=false;
			$scope.request.addedEndUsers=[];
			newRequestFactory.setRequest(angular.copy($scope.request));
			$rootScope.$broadcast("toggle-editEndUser");
		}

		/**
		 * function to update the end user
		 */
		function updateEditEndUser(){
			if($scope.request.addedEndUsers.length>0){
				$rootScope.showDetailsHeaderButton=true;
				var requestJson=angular.copy($scope.request.addedEndUsers[0]);
				requestJson.CreateUserId=localStorage.getItem('LoginId');
				requestJson.RequestSk=parseInt($stateParams.RequestRevisionSK);
				/*requestJson.EntityType="Partner";*/
				requestJson.PartnerRoleTypeCode="SAPEUO";
				quoteDetailFactory.editEndUser(requestJson,$stateParams.RequestRevisionSK)
				.then(function(response){
					if(response.invocationResult.data.ReturnResult.ResultMessage=="Completed Successfully" || response.invocationResult.data.ReturnResult.ResultMessage == "An error occurred retrieving the Quote List from Q2O" || response.invocationResult.data.ReturnResult.ResultMessage == "An error occurred Updating the End User in R2O"){
						endUserChangedSuccessfully=true;
						quoteDetailFactory.quoteDetailEndUserClicked=false;
						$rootScope.$broadcast("toggle-editEndUser");
						$scope.successMessage="End User Changed Successfully";
						
						loadQuoteDetail();
					}
					else{
						$scope.requestsErrorMessage="Unable to edit End User. Please check your connection and try again";
						WL.SimpleDialog.show("Service Unavailable", $scope.requestsErrorMessage, [{ text : "OK", handler : function() {quoteDetailFactory.quoteDetailEndUserClicked=false;$scope.cancelEditEndUser();}}]);
					}
				},function(error){
					$scope.requestsErrorMessage="Unable to edit End User. Please check your connection and try again";
					WL.SimpleDialog.show("Service Unavailable", $scope.requestsErrorMessage, [{ text : "OK", handler : function() {quoteDetailFactory.quoteDetailEndUserClicked=false;$scope.cancelEditEndUser();}}]);
					//logout();
				});
			}
			else{
				$scope.selectEndUserError=true;
			}
		}

		/**
		 * function to redirect to select end user screen
		 */
		function redirectToSelectEndUserScreen(){
			$rootScope.$broadcast("toggle-editEndUser");
			$scope.hideHeaderButton();
			$rootScope.goToState('selectEndUser');
		}
		
		/**
		 * function to redirect to request notification screen
		 */
		function redirectToRequestNotification(){
			quoteDetailFactory.note=$scope.newNote.noteValue;
			$rootScope.$broadcast("toggle-addNoteModalView");
			$rootScope.goToState('requestNotification');
		}
		
		/**
		 * function to toggle Quote Accordion
		 * @param - index
		 */
		function toggleQuoteAccordion(index){
			if(index == $scope.revealedQuoteAccordionIndex){
				$scope.revealedQuoteAccordionIndex= "-1";
			}else{
				$scope.revealedQuoteAccordionIndex = index;
			}			
		}
		
		/**
		 * function to invoke the native share functionality plugin
		 * @param attachmentId - attachment id for the file
		 * @param extension - file extension
		 * @param filename - name of the file
		 * @param action - action to be performed
		 * @param requestName - Name of the Quote Request
		 */
		function shareFile(attachmentId, extension, filename, action, requestName){
			$timeout(function(){
				$scope.revealedFileIdIndex= "-1";
			},0);		
			loadingOverlayService.show();
			var fileBaseUrl=localStorage.getItem("fileBaseUrl");
			var url = fileBaseUrl + attachmentId;
			
			var credentials = loginCacheService.getLoginToken();
			console.log("cookie ::: " + credentials.cookie);
			var ext = extension.split(".");
			var bigId=localStorage.getItem('bigIpCookie');
			var localPid=localStorage.getItem('pdId');
			$timeout(function(){
				r2oShare.shareItem(function(){
					loadingOverlayService.hide();
				},function(){
					loadingOverlayService.hide();
				},{
					"action" : action,
					"url" : url,
					"filename" : filename,
					"Cookie" : localPid+','+bigId,
					"R2oSessionId" : credentials.sessionId,
					"requestName" : requestName,
					"extension" : ext[ext.length-1]
				});
			},0);
		}

		/**
		 * function to return the notes heading
		 * @param note - note response
		 */
		function getNotesHeading(note){

			if(note.NoteType =='Product Note') {
				return note.EntityName;
			} /*else if(note.EntityType == "RequestNote"){
				return getNotesComments(note);
			}*/
			else{
				return getNotesComments(note);
			}

		}

		/**
		 * function to return the notes comments
		 * @param note - note response
		 */
		function getNotesComments(note){
			var tempNotes = note.NoteText.split("Comments:\n");
			if(tempNotes && tempNotes.length == 2){
				return tempNotes[1];
			} else { 
				return note.NoteText;
			}
		}

		/**
		 * function to return the notes description
		 * @param noteindex
		 */
		function showNotesDescription(noteIndex){
			var index = noteIndex+1;
			$scope.notesIndex = {index:index};
			$scope.notesDescriptionShown=true;
			if(localStorage.getItem(localStorage.getItem('LoginId')+'hideRequestNotesDescriptionHelpScreen') != "true" ){
				localStorage.setItem(localStorage.getItem('LoginId')+'hideRequestNotesDescriptionHelpScreen',"true");
				$scope.revealedFileIdIndex=1;
				quoteNoteDetailsHelpScreenShownLocal=true;
				$rootScope.$broadcast("toggle-quoteNotesDescriptionHelpModal");
			}
		}
		
		/**
		 * function to hide the notes description
		 */
		function hideNotesDescription(){
			$scope.notesDescriptionShown=undefined;
		}
		
		
		/**
		 * function to show the notes description
		 * @param quoteNumber
		 * @param quoteRevisionNumber
		 */
		function showQuotesDescription(quoteNumber, quoteRevisionNumber){
			$scope.quotesDescriptionShown=true;
			quoteDetailFactory.getQuoteLineData(quoteNumber, quoteRevisionNumber)
			.then(function(lineItems){
				$scope.quoteDetail.lineItems = lineItems;
			},function(message){
				$scope.quoteDetail.lineItems.length = 0;
				WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
					text : "OK"
				}]);
			});			
		}

		/**
		 * function to toggle request action buttons
		 */
		function toggleRequestActionButtons(){
			if(!quoteDetailsHelpScreenShownLocal && !quoteNoteDetailsHelpScreenShownLocal && !quoteFilesHelpScreenShownLocal)
				$scope.requestActionButtonsShown=!$scope.requestActionButtonsShown;
		}
		
		function closeRequestActionButtons(){
			$scope.requestActionButtonsShown=false;
		}

		/**
		 * function to navigate to revise or copy page
		 */
		function goToRequestAction(actionName){
			$scope.closeRequestActionButtons();
			$scope.hideHeaderButton();
			switch(actionName) {
			    case 'copy':
			    	newRequestFactory.setRequest(undefined);
			        $rootScope.goToState('newRequest',{type:'copy', requestNo :$stateParams.RequestRevisionSK});
			        break;
			    case 'revise':
			        $scope.goToSelectProductToRevise();
			        break;
			}

		}

		function hideHeaderButton(){
			$rootScope.showDetailsHeaderButton=false;
		}

		function hideQuotesDescription(){
			$scope.quotesDescriptionShown=undefined;
		}

		/**
		 * function to hide files help screen
		 */
		function hideFilesHelpScreen(){
			quoteFilesHelpScreenShownLocal=false;
			$scope.revealedFileIdIndex=-1;
			$rootScope.$broadcast("toggle-quoteFilesHelpModal");
		}
		
		/**
		 * function to quote details files help screen
		 */
		function hidedetailsHelpScreen(){
			$rootScope.quoteDetailsHelpScreenShown=false;
			quoteDetailsHelpScreenShownLocal=false;
			$scope.quoteDetail.IsRequestRevisable=tempIsRequestRevisableFlag;
			$scope.requestActionButtonsShown=false;
			$rootScope.$broadcast("toggle-quoteDetailsHelpModal");	
		}

		/**
		 * function to hide quote notes help screen
		 */
		function hideQuoteNotesDescriptionHelpScreen(){
			quoteNoteDetailsHelpScreenShownLocal=false;
			$rootScope.$broadcast("toggle-quoteNotesDescriptionHelpModal");
		}

		/**
		 * function to hide modal
		 * @param modal object
		 */
		function hideModal(modal){
			$rootScope.$broadcast("close-"+modal);
		}

		function blurElementWithId(id){
			$timeout(function() { 
				document.getElementById(id).blur();
			});
		}
		/**
		 * function to handle the back button
		 */
		function handleBackButton(){
			$scope.closeRequestActionButtons();
			newRequestFactory.resetNewRequest();
			quoteDetailFactory.quoteDetailData=undefined;
			quoteDetailFactory.quoteDetailEndUserClicked=undefined;
			quoteDetailFactory.addNoteSendNotificationClicked=undefined;
			localStorage.setItem('RequestRevisionSK',null);
			switch($scope.tabIndex.index){
				case 1:
					if($scope.quotesDescriptionShown){
						hideQuotesDescription();
					}else{
						broadCastHandleBack();
					}
					break;
				case 2:
					if($scope.notesDescriptionShown){
						$scope.hideModal('quoteNotesDescriptionHelpModal');
						hideNotesDescription();
					}else{
						broadCastHandleBack();
					}
					break;
				case 3:
					broadCastHandleBack();
					break;
				case 4:
					broadCastHandleBack();
					break;
			}
		}
		
		/**
		 * function to broadcast the back button
		 */
		function broadCastHandleBack(){
			$scope.hideHeaderButton();
			$state.go('quotes');
			//$rootScope.$broadcast("handleBack");
		}
		
		/**
		 * function to override the back button
		 */
		WL.App.overrideBackButton(function(e){
			e.preventDefault();
			handleBackButton();
		});
	}
})();
