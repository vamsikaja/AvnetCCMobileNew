
/* JavaScript content from app/modules/requests/controllers/quotesController.js in folder common */
(function () {
    'use strict';

    angular.module('ccMobile.requests')
        .controller('quotesController', quotesController);

    /**
     * quotes controller main function. controls the list of quotes populated on the quotes list page and the filters applied.
     */
    function quotesController($scope, $state, quotesFactory, quoteListCacheService, filterPreferences, $rootScope, loginFactory, loadingOverlayService) {

        $rootScope.showDetailsHeaderButton = false;


        $scope.filters = filterPreferences.filters;
        $scope.filterPriority = ['json.ApplUpdateDT', '-json.ApplUpdateDT', 'json.ResellerNM', '-json.ResellerNM', 'json.RequestRevisionNM', '-json.RequestRevisionNM', 'json.WorkflowStatusTX'];
        $scope.appliedFilters = angular.copy(filterPreferences.filters);
        $scope.filterActive = undefined;
        $scope.limitTo = filterPreferences.limitTo;

        $scope.showModifyQuote = showModifyQuote;
        $scope.removeModifyQuote = removeModifyQuote;
        $scope.modifyQuote = modifyQuote;
        $scope.closeHelpModal = closeHelpModal;
        $scope.redirectToQuotesDetailPage = redirectToQuotesDetailPage;
        $scope.isSelected = isSelected;
        $scope.addFilter = addFilter;
        $scope.applyFilters = applyFilters;
        $scope.cancelFilters = cancelFilters;


        function viewContentLoaded() {
            document.getElementsByTagName("r2o-content")[0].children[0].onscroll = loadMore;
        }

        WL.App.overrideBackButton(function (e) {
            e.preventDefault();
            $rootScope.$broadcast("handleBack");
        });

        $scope.$on('online', function () {

        });

        $scope.$on('offline', function () {

        });

        $scope.$on('$viewContentLoaded', viewContentLoaded);

        loadData();

        /**
         * function to load the quotes in the quotes list page
         */
        function getLocalQuotes() {
            quoteListCacheService.getQuotes()
                .then(function (quotes) {
                    var invocationData = {
                        adapter: 'CreateRequestAdapter',
                        procedure: 'getProductSpecificQuestions',
                        parameters: []
                    };
                    var options = {
                        onSuccess: success,
                        onFailure: failure,
                        invocationContext: {}
                    };
                    var tryCount = 2;

                    function success(result) {
                        loadingOverlayService.hide();
                        if (result.invocationResult.isSuccessful) {
                            var hashId = parseInt(localStorage.getItem("hashId") || '-1');
                            if (hashId != result.invocationResult.hashId) {
                                localStorage.setItem("productsRequiringQuestions", JSON.stringify(result.invocationResult.data));
                            }
                        }
                    }

                    function failure() {
                        if (tryCount != 0) {
                            WL.Client.invokeProcedure(invocationData, options);
                            tryCount--;
                        } else {
                            loadingOverlayService.hide();
                            WL.SimpleDialog.show("Service Unavailable", "Please verify connectivity and try again.", [{
                                text: "OK"
                            }]);
                        }

                    }

                    $scope.quotes = quotes;
                    $scope.requestsErrorMessage = "No recent requests found.";
                    if ((localStorage.getItem(localStorage.getItem('LoginId') + 'hideRequestsHelpScreen') != "true") && ($scope.quotes != undefined && $scope.quotes.length > 0)) {
                        localStorage.setItem(localStorage.getItem('LoginId') + 'hideRequestsHelpScreen', "true");
                        angular.element(document).ready(function () {
                            $scope.revealedrequestIdIndex = 0;
                            $rootScope.$broadcast("toggle-quotesHelpModal");
                        });
                    }
                    loadingOverlayService.show();
                    WL.Client.invokeProcedure(invocationData, options);
                }, function () {
                    $scope.requestsErrorMessage = "Unable to retrieve requests, please check your connection and try again.";
                    WL.SimpleDialog.show("Service Unavailable", "Unable to retrieve requests, please check your connection and try again.", [{
                        text: "OK",
                        handler: function () {
                        }
                    }]);
                });
        }

        /**
         * wrapper function to call the service and to load the quotes list
         */
        function loadData() {
            quotesFactory.loadQuotesData()
                .then(getLocalQuotes, function (error) {
                    $scope.requestsErrorMessage = "Unable to retrieve requests, please check your connection and try again.";
                    WL.SimpleDialog.show("Service Unavailable", "Unable to retrieve requests, please check your connection and try again.", [{
                        text: "OK",
                        handler: function () {
                        }
                    }]);

                });
        }


        /**
         * function to load the next 20 quotes in the list
         */
        function loadMore() {
            var scrolledDistance = document.getElementsByTagName("r2o-content")[0].children[0].offsetHeight + document.getElementsByTagName("r2o-content")[0].children[0].scrollTop;
            var scrollableDistance = document.getElementsByTagName("r2o-content")[0].children[0].scrollHeight - 40;
            if (scrolledDistance > scrollableDistance) {
                $scope.$apply(function () {
                    $scope.limitTo = $scope.limitTo + 10;
                    filterPreferences.limitTo = $scope.limitTo;
                });
            }
        }

        function isSelected(filter) {
            if ($scope.filters.indexOf(filter) != -1) {
                return "selected";
            } else {
                return "unselected";
            }
        }

        /**
         * function to apply the filtes in the quotes list page
         *
         */
        function applyFilters() {
            var appliedFilters = $scope.filters.sort(function (a, b) {
                return $scope.filterPriority.indexOf(a) - $scope.filterPriority.indexOf(b);
            });
            filterPreferences.filters = angular.copy(appliedFilters);
            $scope.appliedFilters = angular.copy(appliedFilters);
            document.getElementsByTagName("r2o-content")[0].children[0].scrollTop = 0;
        }

        /**
         * function to cancel the filters
         */
        function cancelFilters() {
            $scope.filters = angular.copy($scope.appliedFilters);
        }

        /**
         * function to add a particular filter
         */
        function addFilter(isRadio, filter, ascending) {
            if (isRadio) {
                var ascendingFilter = $scope.filters.indexOf(filter);
                var descendingFilter = $scope.filters.indexOf("-" + filter);
                var filterToAdd, filterToremove;
                if (ascendingFilter == -1 && descendingFilter == -1) {
                    filterToAdd = (ascending == true ? "" : "-") + filter;
                    $scope.filters.push(filterToAdd);
                } else if (ascendingFilter != -1 && ascending == true) {
                    filterToremove = $scope.filters.indexOf(filter);
                    $scope.filters.splice(filterToremove, 1);
                } else if (descendingFilter != -1 && ascending == false) {
                    filterToremove = $scope.filters.indexOf("-" + filter);
                    $scope.filters.splice(filterToremove, 1);
                } else if (ascendingFilter != -1 && ascending == false) {
                    filterToAdd = "-" + filter;
                    filterToremove = $scope.filters.indexOf(filter);
                    $scope.filters.splice(filterToremove, 1);
                    $scope.filters.push(filterToAdd);
                } else if (descendingFilter != -1 && ascending == true) {
                    filterToAdd = filter;
                    filterToremove = $scope.filters.indexOf("-" + filter);
                    $scope.filters.splice(filterToremove, 1);
                    $scope.filters.push(filterToAdd);
                }
            } else {
                if ($scope.filters.indexOf(filter) == -1) {
                    $scope.filters.push(filter);
                } else {
                    $scope.filters.splice($scope.filters.indexOf(filter), 1);
                }
            }
        }

        /**
         * function to show the modifyQuote
         */
        function showModifyQuote(index, event) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            $scope.revealedrequestIdIndex = index;
        }

        /**
         * function to hide the modifyQuote
         */
        function removeModifyQuote(index, event) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            if (index == $scope.revealedrequestIdIndex) {
                $scope.revealedrequestIdIndex = "-1";
            }
        }

        /**
         * function to navigate the user to revise quote
         * @param quote object
         */
        function modifyQuote(quote) {
            $state.go('selectItemtoRevise');
        }

        /**
         * function to redirect the user to the QuotesDetailPage
         * @param requestRevisionSK
         */
        function redirectToQuotesDetailPage(requestRevisionSK) {
            localStorage.setItem('RequestRevisionSK', requestRevisionSK);
            $rootScope.goToState('quoteDetail');
        }

        /**
         * function to close the help modal
         */
        function closeHelpModal() {
            $scope.revealedrequestIdIndex = -1;
            $rootScope.$broadcast("toggle-quotesHelpModal");
        }
    }
})();