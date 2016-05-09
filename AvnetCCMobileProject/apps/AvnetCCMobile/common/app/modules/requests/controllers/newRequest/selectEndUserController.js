/**
 * 
 */
(function(){
	angular.module('ccMobile.requests')
	.controller('selectEndUserController', selectEndUserController);
	
	/**
	 * controller for the select end user functionality
	 */
	function selectEndUserController($scope, $rootScope, newRequestFactory, favoriteEndUsers,$timeout,$filter,quoteDetailFactory){
		$scope.tabIndex = {index:1};
		$scope.endUserInfo={};
		$scope.endUserInfo.isEndUserNotRequired = angular.copy(newRequestFactory.isEndUserNotRequired);
		$scope.businessSector = newRequestFactory.getRequest().businessSector || "";
		$scope.addedEndUsers = newRequestFactory.getRequest().addedEndUsers || [];
		$scope.recentEndUsers = newRequestFactory.getRequest().RecentEndUsers;
		$scope.Partners=newRequestFactory.getRequest().Partners;
		$scope.favoriteEndUsers = [];
		$scope.anyEndUsersSearched=false;
		$scope.handleBackButton = handleBackButton;
		$scope.changeTabContentTo=changeTabContentTo;
		$scope.isEndUserAdded = isEndUserAdded;
		$scope.isEndUserFavorite = isEndUserFavorite;
		$scope.addOrRemoveEndUser = addOrRemoveEndUser;
		$scope.addOrRemoveFavoriteEndUser = addOrRemoveFavoriteEndUser;
		$scope.addEndUsersToRequest = addEndUsersToRequest;
		$scope.getMatchedEndUsers = getMatchedEndUsers;
		$scope.changeBusinessSector = changeBusinessSector;
		$scope.orderUsers = orderUsers;
		$scope.searchOnChangeMethod=searchOnChangeMethod;
		$scope.closeHelpScreen=closeHelpScreen;
		var temporarySearchTerm="";
		var isSearchGoClicked=false;
		var timerVariable;

		$scope.quoteDetailEndUserClicked=quoteDetailFactory.quoteDetailEndUserClicked;
		if(localStorage.getItem(localStorage.getItem('LoginId')+'hideSelectEndUserHelpScreen') != "true" && ($scope.recentEndUsers !=undefined && $scope.recentEndUsers.length>2)){
			$scope.helpOverlayShown=true;
			localStorage.setItem(localStorage.getItem('LoginId')+'hideSelectEndUserHelpScreen',"true");
			var temporaryRecentEndUsers=$scope.recentEndUsers;
			temporaryRecentEndUsers=$filter('orderBy')(temporaryRecentEndUsers,$scope.orderUsers);
			$scope.addedEndUsers.pop();
			$scope.addedEndUsers.push(temporaryRecentEndUsers[2]);
			//$scope.addOrRemoveEndUser(temporaryRecentEndUsers[2]);
			angular.element(document).ready(function (){
				$rootScope.$broadcast("toggle-selectEndUserHelpModal");
		    });
		}
		
		if(!hasUS33SalesOrgPartner($scope.Partners)){
			$scope.businessSector='Commercial';
			$scope.commercialAutoSelected=true;
			$scope.IsGovernmentRequest=false;
		}

		/**
		 * function to order the users 
		 * @param name
		 */
		function orderUsers(name){
			var charCode = name.PartnerName.toUpperCase().charCodeAt(0);
			if(charCode >= 65 && charCode<=122){
				return name.PartnerName;
			}else{
				return "zzzzz"+(charCode + 122);
			}
		};
		
		/**
		 * function to get the favorite end users
		 */
		function getFavoriteEndUsers(){
			favoriteEndUsers.getFavoriteEndUsers()
			.then(function(favoriteEndUsers){
				$scope.favoriteEndUsers = favoriteEndUsers;
			},function(){
				
			});
		}
		getFavoriteEndUsers();

		function changeTabContentTo(index){
			$timeout(function(){
				$scope.tabIndex.index = index;
			},0);
		}
		
		/**
		 * function to check if the end user has been added
		 * @param endUser
		 */
		function isEndUserAdded(endUser){
			var user = $scope.addedEndUsers.filter(function(a){
				return endUser.PartnerId == a.PartnerId;
			});
			return user.length!=0;
		}
		
		/**
		 * 
		 */
		function isEndUserFavorite(endUser){
			var user = $scope.favoriteEndUsers.filter(function(a){
				return parseInt(endUser.PartnerId) == a.PartnerId;
			});
			return user.length!=0;
		}
		
		/**
		 * function to add or remove the end user
		 * @param enduser
		 */
		function addOrRemoveEndUser(endUser){
			if(isEndUserAdded(endUser)){
				var index = $scope.addedEndUsers.map(function(e){return e.PartnerId;}).indexOf(endUser.PartnerId);
				$scope.addedEndUsers.splice(index,1);
			}else{
				$scope.addedEndUsers.pop();
				$scope.addedEndUsers.push(endUser);
			}
		}
		
		/**
		 * function to add or remove favorite end user
		 */
		function addOrRemoveFavoriteEndUser(endUser,event){
			if(!isEndUserAdded(endUser)){
				event.preventDefault();
				event.stopPropagation();
				if(isEndUserFavorite(endUser)){
					favoriteEndUsers.removeEndUser(endUser)
					.then(function(){
						getFavoriteEndUsers();
					});
				}else{
					favoriteEndUsers.addEndUser(endUser)
					.then(function(){
						getFavoriteEndUsers();
					});
				}
			}else{
				//event propagates here and executes addOrRemoveEndUser 
			}
		}
		
		/**
		 * funtion to change the business options
		 * @param sector
		 */
		function changeBusinessSector(sector){
			if(!$scope.commercialAutoSelected){
				$scope.businessSector = sector;
				if(sector=='Commercial')
					$scope.IsGovernmentRequest=false;
				else if(sector=='Fed/Sled')
					$scope.IsGovernmentRequest=true;
			}

		}
		
		/**
		 * function to add end users to the request
		 */
		function addEndUsersToRequest(){
			var request = newRequestFactory.getRequest();
			request.addedEndUsers = angular.copy($scope.addedEndUsers);
			request.businessSector = angular.copy($scope.businessSector);
			newRequestFactory.setRequest(request);
			newRequestFactory.isEndUserNotRequired = angular.copy($scope.endUserInfo.isEndUserNotRequired);
		}
		
		/**
		 * function to fetch the matched end users
		 * @param searchTerm
		 * @param searchField
		 */
		function getMatchedEndUsers(searchTerm,searchFieldId){
			if(searchTerm.length>=3){
				isSearchGoClicked=true;
				updateSearchResults(searchTerm,searchFieldId);
			}
		}

		/**
		 * function to update the search results
		 * @param searchTerm
		 * @param searchField id
		 */
		function updateSearchResults(searchTerm,searchFieldId){
			temporarySearchTerm=searchTerm;
			$timeout(function() { 
				document.getElementById(searchFieldId).blur();
			});
			newRequestFactory.getMatchedEndUsers(searchTerm)
			.then(function(result){
				result.Partners = result.Partners || [];
				$scope.matchedEndUsers = result.Partners;
				$scope.anyEndUsersSearched=true;
			}, function(){
				console.log('in getMatchedEndUsers error method');
				WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
					text : "OK"
				}]); 
			});
		}

		/**
		 * function triggered each time when the search term changes
		 */
		function searchOnChangeMethod(searchTerm,searchFieldId){
			$timeout.cancel(timerVariable);
			if(searchTerm.length >= 3 && searchTerm.length>temporarySearchTerm.length && isSearchGoClicked){
				timerVariable= $timeout(function(){
									updateSearchResults(searchTerm,searchFieldId);
								},750);
			}
			else{
				if(searchTerm.length <= temporarySearchTerm.length){
					isSearchGoClicked=false;
				}
			}
		}

		/**
		 * function to check if the partner code has US33 value
		 * @param partners
		 */
		function hasUS33SalesOrgPartner(partners){
			for(var i=0;i<(partners || []).length;i++){
				if(partners[i].SalesOrganizations.map(function(item){return item.SalesOrgCode;}).indexOf('US33') != -1){
					return true;
				}
			}
			return false;
		}

		/**
		 * function to close the help screen
		 */
		function closeHelpScreen(){
			$scope.helpOverlayShown=false;
			var temporaryRecentEndUsers=$scope.recentEndUsers;
			temporaryRecentEndUsers=$filter('orderBy')(temporaryRecentEndUsers,$scope.orderUsers);
			$scope.addedEndUsers.pop();
			//$scope.addOrRemoveEndUser(temporaryRecentEndUsers[2]);
			$scope.addedEndUsers = newRequestFactory.getRequest().addedEndUsers || [];
			$rootScope.$broadcast("toggle-selectEndUserHelpModal");
		}
		

		function handleBackButton(){
			if($scope.helpOverlayShown){
				$scope.closeHelpScreen();
			}
			var request = newRequestFactory.getRequest();
			request.addedEndUsers = angular.copy($scope.addedEndUsers);
			request.businessSector = angular.copy($scope.businessSector);
			request.IsGovernmentRequest=angular.copy($scope.IsGovernmentRequest);
			newRequestFactory.setRequest(request);
			newRequestFactory.isEndUserNotRequired = angular.copy($scope.endUserInfo.isEndUserNotRequired);
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