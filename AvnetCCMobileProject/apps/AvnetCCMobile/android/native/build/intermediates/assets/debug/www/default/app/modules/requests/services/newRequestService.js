
/* JavaScript content from app/modules/requests/services/newRequestService.js in folder common */
var newReqResp, submitResp;
var productsCache;


/**
 *  New Request Service
 *
 *  Provides methods for getting data for creating Request, Submitting a New Request, Revising a Request and also stores
 *  the New Request Data until it is submitted.
 */
(function () {
    angular.module('ccMobile.requests')
        .factory('newRequestFactory', newRequestFactory);

    var requiredResponse = [{
        id: 1,
        response: "Configure this request",
    }, {
        id: 4,
        response: "Configure and quote this request"
    }, {
        id: 5,
        response: "Quote this request"
    }];
    
    function newRequestFactory($q, loginCacheService, loadingOverlayService, productSpecificQuestionsCacheService, dateService) {
        productsCache = productSpecificQuestionsCacheService;
        var newRequestFactory = {
            //variables
            request: undefined,
            selectedReviseQuote: undefined,
            selectedReviseProduct: undefined,
            selectedRequestQuote: undefined,
            selectedReviseConfig: undefined,
            selectedReviseTab: 1,
            isReviseConfig: false,
            requiredResponse: [],
            productSpecificQuestions: [],
            temporaryNotificationEmails: [],
            removedProductIndexes: {},
            temporaryEmail: "",
            areQuestionsRequired: false,
            isSubmitButtonClicked: false,
            isQuestionsSaveClicked: false,
            isEndUserNotRequired: false,
            disclaimers: [],
            //methods
            getNewRequest: getNewRequest,
            getRequest: getRequest,
            setRequest: setRequest,
            submitRequest: submitRequest,
            submitReviseRequest: submitReviseRequest,
            getMatchedEndUsers: getMatchedEndUsers,
            getDisclaimer: getDisclaimer,
            updateProductSpecificQuestions: updateProductSpecificQuestions,
            addProductSpecificQuestions: addProductSpecificQuestions,
            removeProductSpecificQuestions: removeProductSpecificQuestions,
            resetNewRequest: resetNewRequest

        };

        /**  Returns the New Request Data that so far has been added */
        function getRequest() {
            return angular.copy(newRequestFactory.request);
        }

        /**  Sets the New Request Data
         *     @param request
         */
        function setRequest(request) {
            newRequestFactory.request = angular.copy(request);
        }

        /** Returns the New Request based on the type of Request(copy, modify or new)
         *    @param type - type of get New Request : copy, modify or new
         *    requestNo - requestNo to get copy or revise request
         */
        function getNewRequest(type, requestNo) {
            if (type == "copy") {
                return getNewRequestFromCopy(requestNo);
            } else if (type == "modify") {
                return getNewReviseRequest();
            } else {
                return getNewBlankRequest();
            }
        }

        /** Returns the New Blank Request */
        function getNewBlankRequest() {
            var defered = $q.defer();
            var authCredentials = loginCacheService.getLoginToken();
            var tryCount = 2;
            var invocationData = {
                adapter: 'CreateRequestAdapter',
                procedure: 'getRecentUsers',
                parameters: [authCredentials.cookie, authCredentials.sessionId, localStorage.getItem("IsInternal") == "true" ? null : authCredentials.emailAddress, localStorage.getItem("IsInternal")]
            };
            var options = {
                onSuccess: success,
                onFailure: failure,
                invocationContext: {}
            };

            function success(result) {
                addCookieValues(result.invocationResult.cookie);
                newReqResp = result;
                result.invocationResult.data.CurrencyCode = "USD";
                newRequestFactory.setRequest(result.invocationResult.data);
                defered.resolve(newRequestFactory.getRequest());
                loadingOverlayService.hide();
            }

            function failure(error) {
                console.log(error);
                loadingOverlayService.hide();
                if (tryCount != 0) {
                    loadingOverlayService.show();
                    WL.Client.invokeProcedure(invocationData, options);
                    tryCount--;
                } else {
                    defered.reject();
                }
            }

            loadingOverlayService.show();
            WL.Client.invokeProcedure(invocationData, options);
            newRequestFactory.productSpecificQuestions.length = 0;
            newRequestFactory.temporaryEmail = "";
            newRequestFactory.temporaryNotificationEmails.length = 0;
            newRequestFactory.isSubmitButtonClicked = false;
            newRequestFactory.areQuestionsRequired = false;
            newRequestFactory.isEndUserNotRequired = false;
            newRequestFactory.requiredResponse = angular.copy(requiredResponse);
            return defered.promise;
        }

        /** Returns the New Revise Request */
        function getNewReviseRequest() {
            var defered = $q.defer();
            var authCredentials = loginCacheService.getLoginToken();
            var tryCount = 2;
            var invocationData = {
                adapter: 'CreateRequestAdapter',
                procedure: 'getRecentUsers',
                parameters: [authCredentials.cookie, authCredentials.sessionId, localStorage.getItem("IsInternal") == "true" ? null : authCredentials.emailAddress, localStorage.getItem("IsInternal")]
            };
            var options = {
                onSuccess: success,
                onFailure: failure,
                invocationContext: {}
            };

            function success(result) {
                addCookieValues(result.invocationResult.cookie);
                result.invocationResult.data.CurrencyCode = "USD";
                newRequestFactory.setRequest(result.invocationResult.data);
                defered.resolve(newRequestFactory.getRequest());
                loadingOverlayService.hide();
            }

            function failure() {

                console.log("error");
                if (tryCount != 0) {
                    WL.Client.invokeProcedure(invocationData, options);
                    tryCount--;
                } else {
                    loadingOverlayService.hide();
                    defered.reject();
                }
            }

            loadingOverlayService.show();
            WL.Client.invokeProcedure(invocationData, options);
            return defered.promise;
        }

        /** Returns the New Request that has contents copied from provided requestNo Request
         *    @param requestNo - requestNo of request to be copied
         */

        function getNewRequestFromCopy(requestNo) {
            var defered = $q.defer();
            var authCredentials = loginCacheService.getLoginToken();
            var tryCount = 2;
            var invocationData = {
                adapter: 'CopyRequestAdapter',
                procedure: 'copyRequest',
                parameters: [authCredentials.cookie, authCredentials.sessionId, requestNo, localStorage.getItem("IsInternal")]
            };
            var options = {
                onSuccess: success,
                onFailure: failure,
                invocationContext: {}
            };

            /** Populates Product Specific Questions Data From Copy Request Product Attributes
             *   @param productAttributes - productAttributes from where we need to populate product specific questions and answers to them
             */

            function populateProductSpecificQuestionsFromCopy(productAttributes) {
                var productSpecificQuestions = newRequestFactory.productSpecificQuestions;
                for (var i = 0; i < (productSpecificQuestions || []).length; i++) {
                    //console.debug(productSpecificQuestions[i].productAttribute.EntityType + ' == '+productAttributes[i].EntityType);
                    var productQuestions = productSpecificQuestions[i].questions;
                    for (var j = 0; j < productQuestions.length; j++) {
                        if (productQuestions[j].questionType == "multiSelect") {
                            productQuestions[j].answer = [];
                            var allOptions = productQuestions[j].options;
                            for (var k = 0; k < allOptions.length; k++) {
                                if (productAttributes[i][allOptions[k].attributeProperty]) {
                                    productQuestions[j].answer.push(allOptions[k]);
                                }
                            }
                        } else if (productQuestions[j].questionType == "radio") {
                            productQuestions[j].answer = [];
                            var allOptions = productQuestions[j].options;
                            if (allOptions[0].attributeProperty.indexOf('IsMachineTypeNew') > -1) {
                                if (productAttributes[i]['IsMachineTypeNew'] == true) {
                                    productQuestions[j].answer.push(allOptions[0]);//first option is new
                                }
                                else if (productAttributes[i]['IsMachineTypeNew'] == false) {
                                    productQuestions[j].answer.push(allOptions[1]);// second option is used
                                }
                            }
                            else if (allOptions[0].attributeProperty.indexOf('SelectedTerm') > -1) {
                                productQuestions[j].answer.push(allOptions.filter(function (e) {
                                    if (e.attributeProperty == "SelectedTerm" + productAttributes[i]['SelectedTerm'] + "Yr") return e;
                                })[0]);
                            }
                            else if (allOptions[0].attributeProperty.indexOf('IsChange') > -1) {
                                if (productAttributes[i]['IsChange'] == true) {
                                    productQuestions[j].answer.push(allOptions[0]);//first option is change
                                }
                                else if (productAttributes[i]['IsChange'] == false) {
                                    productQuestions[j].answer.push(allOptions[1]);// second option is no change
                                }
                            }
                            else if (allOptions[0].attributeProperty.indexOf('CurrentContract') > -1) {
                                productQuestions[j].answer = productAttributes[i]['IsCurrentContract'];
                                /*else if(productAttributes[i]['IsCurrentContract']==false){
                                 productQuestions[j].answer.push(allOptions[0]);// second option is yes
                                 }*/
                            }
                            else if (allOptions[0].attributeProperty.indexOf('Channel') > -1 || allOptions[0].attributeProperty.indexOf('HPDirect') > -1) {
                                if (productAttributes[i]['ChannelHPDirect'] == true) {
                                    productQuestions[j].answer.push(allOptions[1]);//first option is no
                                }
                                else if (productAttributes[i]['ChannelHPDirect'] == false) {
                                    productQuestions[j].answer.push(allOptions[0]);// second option is yes
                                }
                            }
                            else if (allOptions[0].attributeProperty.indexOf('IsNotes') > -1 || allOptions[0].attributeProperty.indexOf('IsFiles') > -1) {
                                if (productAttributes[i]['IsFiles'] == true) {
                                    productQuestions[j].answer.push(allOptions[1]);//first option is no
                                }
                                else if (productAttributes[i]['IsFiles'] == false) {
                                    productQuestions[j].answer.push(allOptions[0]);// second option is yes
                                }
                            }
                            else if (allOptions[0].attributeProperty.indexOf('IsQuote') > -1) {
                                if (productAttributes[i]['IsQuoteContract'] == true) {
                                    productQuestions[j].answer.push(allOptions[1]);//first option is quote
                                }
                                else if (productAttributes[i]['IsQuoteContract'] == false) {
                                    productQuestions[j].answer.push(allOptions[0]);// second option is quote contract
                                }
                            }
                        } else if (productQuestions[j].questionType == "date") {
                            var dateString = productAttributes[i][productQuestions[j].attributeProperty];
                            if (!dateString) {
                                productQuestions[j].answer = null;
                            }
                            else {
                                dateString = dateString.split('/');
                                productQuestions[j].answer = new Date(dateString[2], dateString[0] - 1, dateString[1]);
                            }
                        } else if (productQuestions[j].questionType == "number") {
                            if (!productAttributes[i][productQuestions[j].attributeProperty]) {
                                productQuestions[j].answer = null;
                            }
                            else {
                                productQuestions[j].answer = parseInt(productAttributes[i][productQuestions[j].attributeProperty]);
                            }
                        } else {
                            productQuestions[j].answer = productAttributes[i][productQuestions[j].attributeProperty];
                        }
                    }
                }
            }

            /** Populates Product Specific Questions
             * @param products - products for which to which we need to populate product specific questions
             */
            function populateProductsAndQuestions(products) {
                console.log('in populateProductsAndQuestions');
                for (var i = 0; i < products.length; i++) {
                    products[i].productIndexCount = products.slice(0, i).filter(function (e) {
                            return e.EntityTemplateSk == products[i].EntityTemplateSk
                        }).length + 1;
                    newRequestFactory.addProductSpecificQuestions(products[i]);
                }
            }

            function success(result) {
                addCookieValues(result.invocationResult.cookie);
                newReqResp = result;
                result.invocationResult.data.addedEndUsers = result.invocationResult.data.Partners.filter(function (e) {
                    return e.PartnerRoleTypeCode == "SAPEUO"
                });
                /*if(result.invocationResult.data.addedEndUsers.length<1){
                 newRequestFactory.isEndUserNotRequired=true;
                 if(result.invocationResult.data.IsGovernmentRequest)
                 result.invocationResult.data.businessSector='Fed/Sled';
                 else
                 result.invocationResult.data.businessSector='Commercial';
                 }*/
                result.invocationResult.data.Partners = result.invocationResult.data.Partners.filter(function (e) {
                    return e.PartnerRoleTypeCode != "SAPEUO"
                });
                newReqResp.invocationResult.data.RequestName = "Copy of " + newReqResp.invocationResult.data.RequestName
                //result.invocationResult.data.requestInstructions=(result.invocationResult.data.RequestNotes.map(function(e){return e.NoteText;})).join('$$$');
                populateProductsAndQuestions(result.invocationResult.data.Products);
                newRequestFactory.setRequest(result.invocationResult.data);
                //updateProductSpecificQuestions();

                //chnaging product attributes to contain only the products with required questions
                var selectedProducts = newRequestFactory.request.Products || [];
                selectedProducts = selectedProducts.map(function (item) {
                    var object = {};
                    object['ProductSk'] = item.ProductSk;
                    object['EntityTemplateSk'] = item.EntityTemplateSk;
                    return object
                });
                var allProductSpecificQuestions = productSpecificQuestionsCacheService.getProductsRequiringQuestions();

                var allProductSpecificQuestionSks = allProductSpecificQuestions.map(function (item) {
                    return item.EntityTemplateSk;
                });

                var selectedProductsWithQuestionsSks = selectedProducts.filter(function (e) {
                    return allProductSpecificQuestionSks.indexOf(e.EntityTemplateSk) != -1
                }).map(function (e) {
                    return e.ProductSk
                });
                result.invocationResult.data.ProductAttributes = result.invocationResult.data.ProductAttributes.filter(function (e) {
                    return selectedProductsWithQuestionsSks.indexOf(e.ProductSk) != -1
                });
                result.invocationResult.data.ProductAttributes = result.invocationResult.data.ProductAttributes.sort(function (a, b) {
                    return a.ProductSk - b.ProductSk;
                });

                populateProductSpecificQuestionsFromCopy(result.invocationResult.data.ProductAttributes);
                defered.resolve(newRequestFactory.getRequest());
                loadingOverlayService.hide();
            }

            function failure() {

                console.log("newRequestService: getNewRequestFromCopy: error");
                if (tryCount != 0) {
                    WL.Client.invokeProcedure(invocationData, options);
                    tryCount--;
                } else {
                    loadingOverlayService.hide();
                    defered.reject();
                }
            }

            loadingOverlayService.show();
            WL.Client.invokeProcedure(invocationData, options);
            newRequestFactory.productSpecificQuestions.length = 0;
            newRequestFactory.temporaryEmail = "";
            newRequestFactory.temporaryNotificationEmails.length = 0;
            newRequestFactory.isSubmitButtonClicked = false;
            newRequestFactory.areQuestionsRequired = false;
            newRequestFactory.isEndUserNotRequired = false;
            newRequestFactory.requiredResponse = angular.copy(requiredResponse);
            return defered.promise;
        }

        /** Returns New Product with all the Product Data added
         * @param productSk - productSk of product
         * lookUpListProduct - lookUpListProduct
         */
        function getNewProduct(productSk, lookUpListProduct) {
            var productName = lookUpListProduct.SupplierName + " - " + lookUpListProduct.EntityTemplateName;
            /*if(productIndexCount>1){
             productName=productName+ " "+productIndexCount;
             }*/
            return {
                EntityType: "Product",
                ProductSk: productSk,
                RequestSk: 0,
                ProductName: productName,
                IsB2BCustomer: false,
                PriorityLevel: 0,
                WorkflowId: "",
                WorkflowVersion: 1,
                WorkflowStatus: "",
                EffectiveFromDate: null,
                IsConfigurable: false,
                IsAutoQuote: false,
                ConfigComplexityLevel: 1,
                IsPricingApproved: null,
                PricingExpireDate: null,
                PricingSupplierAuthNumber: null,
                EntityTemplateSk: lookUpListProduct.EntityTemplateSk,
                EntityTemplateName: lookUpListProduct.EntityTemplateName,
                SupplierName: lookUpListProduct.SupplierName,
                OldRequestNumber: 0,
                ProductGroupSk: lookUpListProduct.ProductGroupSk,
                ProductGroupName: lookUpListProduct.ProductGroupName,
                CreateDate: dateService.now(),
                UpdateDate: dateService.now(),
                DeleteDate: null,
                CreateUserId: localStorage.getItem("LoginId"),
                UpdateUserId: null,
                DeleteUserId: null,
                EntityTemplate: lookUpListProduct,
                ProductDetail: null
            };
        }

        /** Submits the New Request with all the data added -> Populating product Specific Questions, adding entire product Data of added Products,
         *    Properly updating the Notifications List etc.,
         */
        function submitRequest() {
            var defered = $q.defer();
            var authCredentials = loginCacheService.getLoginToken();
            var request = getRequest();
            //request notifications

            //adding lori.thompson@avnet.com if it is not present to gis.testing@avnet.com user
            if (localStorage.getItem("emailAddress").toLowerCase() == "gis.testing@avnet.com") {
                if ((request.notificationEmails || []).filter(function (contact) {
                        return !angular.isObject(contact);
                    }).indexOf("lori.thompson@avnet.com") == -1) {
                    if ((request.notificationEmails || []).filter(function (contact) {
                            return angular.isObject(contact)
                        }).map(function (contact) {
                            return contact.EmailAddress.toLowerCase()
                        }).indexOf("lori.thompson@avnet.com") == -1) {
                        (request.notificationEmails || []).push("lori.thompson@avnet.com");
                    }
                }
            }


            /*request.Contacts = (request.notificationEmails || []).filter(function(contact){
             return angular.isObject(contact);
             });*/

            var ccRecipients = (request.notificationEmails || []).filter(function (contact) {
                return angular.isObject(contact);
            }).map(function (item) {
                return item.EmailAddress
            });


            var adHocRecipients = (request.notificationEmails || []).filter(function (contact) {
                return !angular.isObject(contact);
            });

            request.Contacts = (newRequestFactory.getRequest().Contacts || []).filter(function (e) {
                return e.IsNotifyAssigned == false && e.IsNotifySuggested == true;
            });
            //Partners
            if (request.addedEndUsers.length > 0) {
                request.Partners.push(angular.copy(request.addedEndUsers[0]));
            }


            request.IsIntegration = false;
            request.IsGovernmentRequest = false;

            //product specific questions
            var productSpecificQuestions = newRequestFactory.productSpecificQuestions;
            for (var i = 0; i < (productSpecificQuestions || []).length; i++) {
                var productQuestions = productSpecificQuestions[i].questions;
                for (var j = 0; j < productQuestions.length; j++) {
                    var selectedOptions = productQuestions[j].answer;
                    if (productQuestions[j].questionType == "multiSelect") {
                        var allOptions = productQuestions[j].options;
                        for (var k = 0; k < allOptions.length; k++) {
                            productSpecificQuestions[i].productAttributes[allOptions[k].attributeProperty] = false;
                        }
                        for (var k = 0; k < selectedOptions.length; k++) {
                            productSpecificQuestions[i].productAttributes[selectedOptions[k].attributeProperty] = true;
                        }
                    } else if (productQuestions[j].questionType == "radio") {
                        if (selectedOptions.length > 0) {
                            if (selectedOptions[0].attributeProperty.indexOf('SelectedTerm') > -1) {
                                productSpecificQuestions[i].productAttributes['SelectedTerm'] = selectedOptions[0].option.split(' ')[0];
                            }
                            else if (selectedOptions[0].attributeProperty.indexOf('MachineType') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('IsMachineTypeNew') > -1) {
                                    productSpecificQuestions[i].productAttributes['IsMachineTypeNew'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['IsMachineTypeNew'] = false;
                                }
                            }
                            else if (selectedOptions[0].attributeProperty.indexOf('Change') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('IsChange') > -1) {
                                    productSpecificQuestions[i].productAttributes['IsChange'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['IsChange'] = false;
                                }
                            }
                            /*else if(selectedOptions[0].attributeProperty.indexOf('CurrentContract')>-1){
                             if(selectedOptions[0].attributeProperty.indexOf('IsCurrentContract')>-1){
                             productSpecificQuestions[i].productAttributes['IsCurrentContract'] = true;
                             }
                             else{
                             productSpecificQuestions[i].productAttributes['IsCurrentContract'] = false;
                             }
                             }*/
                            else if (selectedOptions[0].attributeProperty.indexOf('HPDirect') > -1 || selectedOptions[0].attributeProperty.indexOf('Channel') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('HPDirect') > -1) {
                                    productSpecificQuestions[i].productAttributes['ChannelHPDirect'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['ChannelHPDirect'] = false;
                                }
                            }
                            else if (selectedOptions[0].attributeProperty.indexOf('IsFiles') > -1 || selectedOptions[0].attributeProperty.indexOf('IsNotes') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('IsFiles') > -1) {
                                    productSpecificQuestions[i].productAttributes['IsFiles'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['IsFiles'] = false;
                                }
                            }
                            else if (selectedOptions[0].attributeProperty.indexOf('IsQuote') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('IsIsQuoteContractAS') > -1) {
                                    productSpecificQuestions[i].productAttributes['IsQuoteContract'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['IsQuoteContract'] = false;
                                }
                            }
                        }
                        else {
                            //only currnet contract only answer contains true or false. for other answers objects are stored
                            var allOptions = productQuestions[j].options;
                            if (allOptions.filter(function (e) {
                                    return e.option == "CurrentContract"
                                }).length > 0) {
                                productSpecificQuestions[i].productAttributes['IsCurrentContract'] = productQuestions[j].answer;
                            }
                        }
                    }
                    else if (productQuestions[j].questionType == "date") {
                        if (selectedOptions) {
                            productSpecificQuestions[i].productAttributes[productQuestions[j].attributeProperty] = dateService.formatShortDate(new Date(selectedOptions));
                        }
                    } else {
                        if (selectedOptions) {
                            productSpecificQuestions[i].productAttributes[productQuestions[j].attributeProperty] = selectedOptions.toString();
                        }
                    }
                }
            }

            var allProductSpecificQuestionSks = productSpecificQuestionsCacheService.getProductsRequiringQuestions().map(function (e) {
                return e.EntityTemplateSk;
            });
            var questionsIndex = 0;

            var products = [];
            for (var i = 0; i < request.Products.length; i++) {
                var lookUpListProduct = request.LookupLists.filter(function (e) {
                    return e.EntityTemplateSk == request.Products[i].EntityTemplateSk;
                })[0];
                var product = getNewProduct(i + 1, lookUpListProduct);
                if (allProductSpecificQuestionSks.indexOf(product.EntityTemplateSk) != -1) {
                    productSpecificQuestions[questionsIndex].productAttributes.ProductSk = i + 1;
                    questionsIndex = questionsIndex + 1;

                }
                products.push(product);
            }
            request.Products = products;
            request.ProductAttributes = productSpecificQuestions.map(function (e) {
                return e.productAttributes;
            });


            if (request.isCopy) {
                //If its copy then check whether we need to copy all notes and files
                if (request.isRemoveAllFiles) {
                    request.EntityFiles = [];
                }

                if (request.isRemoveAllNotes) {
                    request.ProductNotes = [];
                    request.RequestNotes = [];
                }
            }

            request.RequestNotes = request.RequestNotes || [];

            if (request.requestInstructions != undefined && request.requestInstructions.length > 0) {
                var requestNotesdata = {
                    "EntityType": "",
                    "NoteSk": 1,
                    "EntitySk": 0,
                    "NoteTypeSk": 1,
                    "NoteText": request.requestInstructions,
                    "ActionSk": null,
                    "IsReportable": false,
                    "IsActive": false,
                    "IsDisplay": false,
                    "IsInternal": false,
                    "EntityTemplateName": "",
                    "EntityName": "Request",
                    "NoteType": "Request Note",
                    "CreateDate": dateService.now(),
                    "UpdateDate": null,
                    "DeleteDate": null,
                    "CreateUserId": localStorage.getItem("LoginId"),
                    "UpdateUserId": "",
                    "DeleteUserId": "",
                    "CreateUserName": localStorage.getItem("FullName"),
                    "Author": localStorage.getItem("FullName")
                };
                request.RequestNotes.push(requestNotesdata);
            }

            delete request.businessSector;
            delete request.RecentEndUsers;
            delete request.RecentProducts;
            delete request.LookupLists;
            delete request.addedEndUsers;
            delete request.notificationEmails;
            delete request.requestInstructions;

            delete request.isSuccessful;
            delete request.responseTime;
            delete request.statusReason;
            delete request.statusCode;
            delete request.responseHeaders;
            delete request.totalTime;

            //exposed variable
            newReqResp = angular.copy(request);
            newReqResp.adHocRecipients = adHocRecipients;

            var invocationData = {
                adapter: 'CreateRequestAdapter',
                procedure: 'submitRequest',
                parameters: [authCredentials.cookie, authCredentials.sessionId, request, adHocRecipients, ccRecipients]
            };
            var options = {
                onSuccess: success,
                onFailure: failure,
                invocationContext: {}
            };

            function success(result) {
                console.log('newRequestService: Request Create Successful', result);
                submitResp = result;
                addCookieValues(result.invocationResult.cookie);
                if (result.invocationResult.isSuccessful) {
                    if (result.invocationResult.ReturnResult.ResultMessage == "Completed Successfully" || result.invocationResult.ReturnResult.ResultMessage == "An error occurred retrieving the Quote List from Q2O") {
                        defered.resolve();
                    } else {
                        defered.reject();
                    }
                } else {
                    defered.reject();
                }
                loadingOverlayService.hide();
            }

            function failure(error) {
                submitResp = error;
                defered.reject();
                loadingOverlayService.hide();
            }

            loadingOverlayService.show();
            console.log('parameters sent to submitRequest are :');
            console.log([authCredentials.cookie, authCredentials.sessionId, request, adHocRecipients, ccRecipients]);
            WL.Client.invokeProcedure(invocationData, options);
            return defered.promise;
        }

        /** Submits the Revised Request with all the data added -> Populating product Specific Questions, adding entire product Data of added Products,
         *    Properly updating the Notifications List etc.,
         *    @param reviseActionName - reviseActionName
         *   @param reviseAction - reviseAction
         *   @param reviseNotes - reviseNotes
         */

        function submitReviseRequest(reviseActionName, reviseAction, reviseNotes) {
            var reviseRequestTemplate = {
                "RequestNumber": 7449577,
                "ProductCount": 1,
                "Action": {
                    "EntityType": "Product",
                    "EntitySk": 2459562,
                    "EventName": "Revise Quote",
                    "ActionSk": 0,
                    "ActionName": "Revise Name",
                    "ActionTypeSk": 43,
                    "AlertSk": null,
                    "RevisedFromEntitySk": 2459562,
                    "RevisedReasonTypeSk": 2,
                    "CurrentHoldReasonTypeSk": null,
                    "CurrentCancelReasonTypeSk": null,
                    "CurrentAssignId": null,
                    "CurrentAssignFullName": null,
                    "ConfigComplexityLevel": null,
                    "OutputsNumber": 0,
                    "PriorityLevel": null,
                    "CustomerPurchaseOrderNumber": null,
                    "POReleaseNumber": null,
                    "QuoteNumber": 119529412,
                    "QuoteRevNumber": 1,
                    "ReviseConfigFileId": null,
                    "ReviseConfigFileName": null,
                    "ProductList": null,
                    "ActionTypeName": null,
                    "IsInternal": false,
                    "ActionGroup": null,
                    "IsQuote": false,
                    "IsOrder": false,
                    "IsShowInCustomerSummary": false,
                    "RevisedReasonTypeCode": null,
                    "HoldReasonType": null,
                    "CancelReasonType": null,
                    "RevisedReasonType": null,
                    "WorkflowStatus": null,
                    "WorkflowId": null,
                    "CreateDate": "",
                    "UpdateDate": "",
                    "DeleteDate": null,
                    "CreateUserId": null,
                    "UpdateUserId": null,
                    "DeleteUserId": null
                },
                "Products": [],
                "Notification": {
                    "adHocRecipients": [],
                    "ccRecipients": [],
                    "fileList": [],
                    "forceSend": false,
                    "isNoteInternal": false,
                    "isNoteReportable": false,
                    "noteText": "Test Noteesss",
                    "recipients": [],
                    "requestSk": 2459561,
                    "shouldSend": false,
                    "subject": ""
                },
                "EntityFiles": []
            };

            var request = getRequest();

            reviseRequestTemplate.ccRecipients = (request.notificationEmails || []).filter(function (contact) {
                return angular.isObject(contact);
            }).map(function (item) {
                return item.EmailAddress
            });
            console.log('ccRecipients: ', reviseRequestTemplate.ccRecipients);

            reviseRequestTemplate.adHocRecipients = (request.notificationEmails || []).filter(function (contact) {
                return !angular.isObject(contact);
            });
            console.log('adHocRecipients: ', reviseRequestTemplate.adHocRecipients);

            reviseRequestTemplate.recipients = (request.notificationEmails || []).filter(function (e) {
                if (angular.isObject(e))
                    return e.IsNotifyAssigned == false && e.IsNotifySuggested == true;
                else
                    return false;
            });


            var defered = $q.defer();
            var authCredentials = loginCacheService.getLoginToken();

            reviseRequestTemplate.ProductCount = newRequestFactory.selectedRequestQuote.products ? newRequestFactory.selectedRequestQuote.products.length : 0;

            //reviseRequestTemplate.RequestSk = newRequestFactory.selectedReviseQuote.requestSk;
            //reviseRequestTemplate.RequestNumber = newRequestFactory.selectedRequestQuote.requestNumber;

            reviseRequestTemplate.RequestSk = localStorage.RequestRevisionSK;
            reviseRequestTemplate.RequestNumber = newRequestFactory.selectedRequestQuote.requestNumber;


            if (newRequestFactory.isReviseConfig) {
                //this is a config revise
                reviseRequestTemplate.Action.ActionTypeSk = 39;
                reviseRequestTemplate.Action.EventName = "Revise Config";
            } else {
                //this is a quote revise
                reviseRequestTemplate.Action.ActionTypeSk = 43;
                reviseRequestTemplate.Action.EventName = "Revise Quote";
            }

            reviseRequestTemplate.Action.EntitySk = newRequestFactory.selectedReviseProduct.ProductSk;
            reviseRequestTemplate.Action.RevisedFromEntitySk = newRequestFactory.selectedReviseProduct.ProductSk;
            reviseRequestTemplate.Action.RevisedReasonTypeSk = parseInt(request.reviseAction);

            //only for revise quote
            reviseRequestTemplate.Action.QuoteNumber = newRequestFactory.selectedReviseQuote ? newRequestFactory.selectedReviseQuote.quoteNumber : null;
            reviseRequestTemplate.Action.QuoteRevNumber = newRequestFactory.selectedReviseQuote ? newRequestFactory.selectedReviseQuote.quoteRevisionNumber : null;


            //reviseRequestTemplate.Notification.requestSk = newRequestFactory.selectedReviseQuote.requestSk;
            reviseRequestTemplate.Notification.requestSk = newRequestFactory.selectedRequestQuote.RequestRevisionSK;

            reviseRequestTemplate.Notification.noteText = request.requestInstructions;
            reviseRequestTemplate.Action.ActionName = request.reviseQuoteName;

            reviseRequestTemplate.Notification.recipients = request.selectedNotificationEmails;


            //product specific questions
            var productSpecificQuestions = newRequestFactory.productSpecificQuestions;
            for (var i = 0; i < (productSpecificQuestions || []).length; i++) {
                var productQuestions = productSpecificQuestions[i].questions;
                for (var j = 0; j < productQuestions.length; j++) {
                    var selectedOptions = productQuestions[j].answer;
                    if (productQuestions[j].questionType == "multiSelect") {
                        var allOptions = productQuestions[j].options;
                        for (var k = 0; k < allOptions.length; k++) {
                            productSpecificQuestions[i].productAttributes[allOptions[k].attributeProperty] = false;
                        }
                        for (var k = 0; k < selectedOptions.length; k++) {
                            productSpecificQuestions[i].productAttributes[selectedOptions[k].attributeProperty] = true;
                        }
                    } else if (productQuestions[j].questionType == "radio") {
                        if (selectedOptions.length > 0) {
                            if (selectedOptions[0].attributeProperty.indexOf('SelectedTerm') > -1) {
                                productSpecificQuestions[i].productAttributes['SelectedTerm'] = selectedOptions[0].option.split(' ')[0];
                            }
                            else if (selectedOptions[0].attributeProperty.indexOf('MachineType') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('IsMachineTypeNew') > -1) {
                                    productSpecificQuestions[i].productAttributes['IsMachineTypeNew'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['IsMachineTypeNew'] = false;
                                }
                            }
                            else if (selectedOptions[0].attributeProperty.indexOf('Change') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('IsChange') > -1) {
                                    productSpecificQuestions[i].productAttributes['IsChange'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['IsChange'] = false;
                                }
                            }
                            /*else if(selectedOptions[0].attributeProperty.indexOf('CurrentContract')>-1){
                             if(selectedOptions[0].attributeProperty.indexOf('IsCurrentContract')>-1){
                             productSpecificQuestions[i].productAttributes['IsCurrentContract'] = true;
                             }
                             else{
                             productSpecificQuestions[i].productAttributes['IsCurrentContract'] = false;
                             }
                             }*/
                            else if (selectedOptions[0].attributeProperty.indexOf('HPDirect') > -1 || selectedOptions[0].attributeProperty.indexOf('Channel') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('HPDirect') > -1) {
                                    productSpecificQuestions[i].productAttributes['ChannelHPDirect'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['ChannelHPDirect'] = false;
                                }
                            }
                            else if (selectedOptions[0].attributeProperty.indexOf('IsFiles') > -1 || selectedOptions[0].attributeProperty.indexOf('IsNotes') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('IsFiles') > -1) {
                                    productSpecificQuestions[i].productAttributes['IsFiles'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['IsFiles'] = false;
                                }
                            }
                            else if (selectedOptions[0].attributeProperty.indexOf('IsQuote') > -1) {
                                if (selectedOptions[0].attributeProperty.indexOf('IsIsQuoteContractAS') > -1) {
                                    productSpecificQuestions[i].productAttributes['IsQuoteContract'] = true;
                                }
                                else {
                                    productSpecificQuestions[i].productAttributes['IsQuoteContract'] = false;
                                }
                            }
                        }
                        else {
                            //only currnet contract only answer contains true or false. for other answers objects are stored
                            var allOptions = productQuestions[j].options;
                            if (allOptions.filter(function (e) {
                                    return e.option == "CurrentContract"
                                }).length > 0) {
                                productSpecificQuestions[i].productAttributes['IsCurrentContract'] = productQuestions[j].answer;
                            }
                        }
                    }
                    else if (productQuestions[j].questionType == "date") {
                        if (selectedOptions) {
                            productSpecificQuestions[i].productAttributes[productQuestions[j].attributeProperty] = dateService.formatShortDate(new Date(selectedOptions));
                        }
                    } else {
                        if (selectedOptions) {
                            productSpecificQuestions[i].productAttributes[productQuestions[j].attributeProperty] = selectedOptions.toString();
                        }
                    }
                }
            }

            var allProductSpecificQuestionSks = productSpecificQuestionsCacheService.getProductsRequiringQuestions().map(function (e) {
                return e.EntityTemplateSk;
            });
            var questionsIndex = 0;

            var products = [];
            for (var i = 0; i < request.Products.length; i++) {
                var lookUpListProduct = request.LookupLists.filter(function (e) {
                    return e.EntityTemplateSk == request.Products[i].EntityTemplateSk;
                })[0];
                var product = getNewProduct(i + 1, lookUpListProduct);
                if (allProductSpecificQuestionSks.indexOf(product.EntityTemplateSk) != -1) {
                    productSpecificQuestions[questionsIndex].productAttributes.ProductSk = i + 1;
                    questionsIndex = questionsIndex + 1;

                }
                products.push(product);
            }
            reviseRequestTemplate.Products = products;
            reviseRequestTemplate.ProductAttributes = productSpecificQuestions.map(function (e) {
                return e.productAttributes;
            });

            var invocationData = {
                adapter: 'ReviseRequestAdapter',
                procedure: 'reviseRequest',
                parameters: [authCredentials.cookie, authCredentials.sessionId, reviseRequestTemplate]
            };
            var options = {
                onSuccess: success,
                onFailure: failure,
                invocationContext: {}
            };

            function success(result) {
                console.log('newRequestService: Revise Successful: ', result);
                loadingOverlayService.hide();
                addCookieValues(result.invocationResult.cookie);
                submitResp = result;
                if (result.invocationResult.isSuccessful) {
                    if (result.invocationResult.ReturnResult.ResultMessage == "Completed Successfully" || result.invocationResult.ReturnResult.ResultMessage == "An error occurred retrieving the Quote List from Q2O") {
                        defered.resolve();
                    } else {
                        defered.reject();
                    }
                } else {
                    defered.reject();
                }
            }

            function failure(error) {
                console.log("newRequestFactory: Error revising request", error);
                defered.reject();
                loadingOverlayService.hide();
            }

            loadingOverlayService.show();
            console.log('parameters passed : ', [authCredentials.cookie, authCredentials.sessionId, reviseRequestTemplate]);
            WL.Client.invokeProcedure(invocationData, options);

            return defered.promise;
        }

        /** Returns Matched EndUsers based on the provided Search Term
         *    @param searchTerm - searchTerm to get the matched end users
         */
        function getMatchedEndUsers(searchTerm) {
            var defered = $q.defer();
            var authCredentials = loginCacheService.getLoginToken();
            var invocationData = {
                adapter: 'CreateRequestAdapter',
                procedure: 'getAllUsers',
                parameters: [authCredentials.cookie, authCredentials.sessionId, searchTerm, localStorage.getItem("PartnerId")]
            };
            var options = {
                onSuccess: success,
                onFailure: failure,
                invocationContext: {}
            };

            function success(result) {
                newReqResp = result;
                addCookieValues(result.invocationResult.cookie);
                defered.resolve(result.invocationResult.data);
                loadingOverlayService.hide();
            }

            function failure() {
                //defered.resolve([]);
                defered.reject();
                loadingOverlayService.hide();
            }

            loadingOverlayService.show();
            WL.Client.invokeProcedure(invocationData, options);
            return defered.promise;
        }

        /** Updates the Product Specific Questions */
        function updateProductSpecificQuestions() {
            //get selected products
            var selectedProducts = newRequestFactory.request.Products || [];
            //update questions required flag

            newRequestFactory.areQuestionsRequired = productSpecificQuestionsCacheService.areQuestionsRequired(selectedProducts);
            //get product specific questions
            //selectedProducts = selectedProducts.map(function(item){ return item.EntityTemplateSk; });

            var allProductSpecificQuestions = productSpecificQuestionsCacheService.getProductsRequiringQuestions();

            var allQuesSks = allProductSpecificQuestions.map(function (item) {
                return item.EntityTemplateSk;
            });

            var previousAddedQuestionsSks = newRequestFactory.productSpecificQuestions.map(function (e) {
                return e.EntityTemplateSk;
            });
            var requiredQuestions = [];
            for (var i = 0; i < selectedProducts.length; i++) {
                var questionsIndexTemp = allQuesSks.indexOf(selectedProducts[i].EntityTemplateSk);
                if (questionsIndexTemp != -1) {
                    var prodIndexInpreviousAddedQuestions = previousAddedQuestionsSks.indexOf(selectedProducts[i].EntityTemplateSk);
                    if (prodIndexInpreviousAddedQuestions != -1) {
                        requiredQuestions.push(angular.copy(newRequestFactory.productSpecificQuestions[prodIndexInpreviousAddedQuestions]));
                    }
                    else {
                        requiredQuestions.push(angular.copy(allProductSpecificQuestions[questionsIndexTemp]));
                    }
                }
            }
            /*var requiredQuestions = allProductSpecificQuestions.filter(function(item){
             return selectedProducts.indexOf(item.EntityTemplateSk) != -1;
             });*/
            newRequestFactory.productSpecificQuestions = requiredQuestions;
        }

        /** Adds Product Specific Questions of the provided Product
         *    @param product - product to which product specific questions to be added
         */
        function addProductSpecificQuestions(product) {
            console.log('in addProductSpecificQuestions');
            console.log(product);
            var allProductSpecificQuestions = productSpecificQuestionsCacheService.getProductsRequiringQuestions();
            var allQuesSks = allProductSpecificQuestions.map(function (item) {
                return item.EntityTemplateSk;
            });
            var questionsIndexTemp = allQuesSks.indexOf(product.EntityTemplateSk);
            if (questionsIndexTemp != -1) {
                var tempQuestions = angular.copy(allProductSpecificQuestions[questionsIndexTemp]);
                tempQuestions.productIndexCount = product.productIndexCount;
                newRequestFactory.productSpecificQuestions.push(tempQuestions);
            }
        }

        /** Removes Product Specific Questions of the provided Product
         *    @param product - product to which product specific questions to be removed
         */
        function removeProductSpecificQuestions(product) {
            console.log('in removeProductSpecificQuestions');
            console.log(product);
            var allProdQuesSks = newRequestFactory.productSpecificQuestions.map(function (item) {
                return item.EntityTemplateSk;
            });
            var questionsIndexTemp = allProdQuesSks.indexOf(product.EntityTemplateSk);
            if (questionsIndexTemp != -1) {
                for (var i = newRequestFactory.productSpecificQuestions.length - 1; i >= 0; i--) {
                    if (newRequestFactory.productSpecificQuestions[i].EntityTemplateSk == product.EntityTemplateSk && newRequestFactory.productSpecificQuestions[i].productIndexCount == product.productIndexCount) {
                        newRequestFactory.productSpecificQuestions.splice(i, 1);
                        return;
                    }
                }
                ;
            }
        }

        /** Gets Disclaimer Content */
        function getDisclaimer() {
            var defered = $q.defer();
            var authCredentials = loginCacheService.getLoginToken();
            var products = getRequest().Products;

            var invocationData = {
                adapter: 'CreateRequestAdapter',
                procedure: 'getDisclaimers',
                parameters: [authCredentials.cookie, authCredentials.sessionId]
            };

            var options = {
                onSuccess: success,
                onFailure: failure,
                invocationContext: {}
            };

            function success(result) {
                addCookieValues(result.invocationResult.cookie);
                var productSks = products.map(function (e) {
                    return e.EntityTemplateSk;
                });
                var disclaimers = result.invocationResult.ProductDisclaimers.ProductDisclaimers;
                var requiredDisclaimers = disclaimers.filter(function (disclaimer) {
                    return productSks.indexOf(disclaimer.EntityTemplateSk) != -1;
                });
                newRequestFactory.disclaimers = angular.copy(requiredDisclaimers);
                defered.resolve(requiredDisclaimers);
                loadingOverlayService.hide();
            }

            function failure() {
                //defered.resolve([]);
                defered.reject();
                loadingOverlayService.hide();
            }

            loadingOverlayService.show();
            WL.Client.invokeProcedure(invocationData, options);
            return defered.promise;
        }

        /** Resets New Request Data */
        function resetNewRequest() {
            newRequestFactory.setRequest(undefined);
            newRequestFactory.isSubmitButtonClicked = false;
            newRequestFactory.questionsSaveClicked = false;
            newRequestFactory.temporaryNotificationEmails = [];
            newRequestFactory.temporarySelectedContacts = [];
            newRequestFactory.removedProductIndexes = {};
            newRequestFactory.productSpecificQuestions = [];
            newRequestFactory.selectedReviseQuote = undefined;
            newRequestFactory.selectedReviseProduct = undefined;
            newRequestFactory.selectedRequestQuote = undefined;
            newRequestFactory.selectedReviseConfig = undefined;
            newRequestFactory.selectedReviseTab = 1;
            newRequestFactory.isReviseConfig = false;
        }

        return newRequestFactory;
    }
})();
