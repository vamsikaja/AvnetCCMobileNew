
/* JavaScript content from app/modules/requests/services/quotesService.js in folder common */
var quotesResp;
/**
 *  Quotes Service
 *
 *  Provides methods for getting Quotes Data
 */
(function () {
    'use strict';

    angular.module('ccMobile.requests')
        .factory('quotesFactory', quotesFactory);
    quotesFactory.$inject = ['$q', 'loginCacheService', 'quoteListCacheService', 'loadingOverlayService'];

    function quotesFactory($q, loginCacheService, quoteListCacheService, loadingOverlayService) {

        var quotesFactory = {
            loadQuotesData: loadQuotesData
        };

        /** Loads Quotes Data */
        function loadQuotesData() {
            console.log('quotesFactory: loadQuotesData');

            var defered = $q.defer();

            var tryCount = 0;

            function getQuotesSuccessMethod(response) {
                if (response.invocationResult.cookie != undefined)
                    addCookieValues(response.invocationResult.cookie);
                if (response.invocationResult.isSuccessful == true) {
                    if (response.invocationResult.sessionExpired == true) {
                        loadingOverlayService.hide();
                        defered.reject("sessionExpired");
                    } else {
                        if (response.invocationResult.requests != undefined) {
                            quoteListCacheService.updateQuotes(response.invocationResult.requests)
                                .then(function () {
                                    loadingOverlayService.hide();
                                    defered.resolve();
                                }, function () {
                                    loadingOverlayService.hide();
                                    defered.reject();
                                });
                        } else {
                            if (tryCount < 3) {
                                tryCount = tryCount + 1;
                                WL.Client.invokeProcedure(invocationData, options);
                            } else {
                                loadingOverlayService.hide();
                                defered.reject();
                            }
                        }
                    }
                } else {
                    loadingOverlayService.hide();
                    defered.reject("service unavailable");
                }
            }


            function getQuotesFailureMethod(error) {
                loadingOverlayService.hide();
                defered.reject(error);
            }

            var authCredentials = loginCacheService.getLoginToken();

            var invocationData = {
                adapter: 'QuotesAdapter',
                procedure: 'getQuotesList',
                parameters: [authCredentials.cookie, authCredentials.sessionId, localStorage.getItem("IsInternal")]
            };
            var options = {
                onSuccess: getQuotesSuccessMethod,
                onFailure: getQuotesFailureMethod,
                invocationContext: {}
            };
            console.log('quotesFactory: parameters: ', invocationData.parameters);
            loadingOverlayService.show();
            WL.Client.invokeProcedure(invocationData, options);
            return defered.promise;
        }

        return quotesFactory;
    }
})();
