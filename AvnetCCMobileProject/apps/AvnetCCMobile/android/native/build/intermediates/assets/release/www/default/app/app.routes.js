
/* JavaScript content from app/app.routes.js in folder common */
(function () {
    angular.module('ccMobile')
        .config(routes);

    function routes($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/shared/templates/login.html',
                controller: 'loginController'
            })

            .state('home', {
                url: '/home',
                templateUrl: 'app/shared/templates/home.html',
                controller: 'homeController',
                resolve: {
                    userData: ['userService', function (userService) {
                        return userService.getUser();
                    }]
                }
            })

            // view current quotes
            .state('quotes', {
                url: '/quotes',
                templateUrl: 'app/modules/requests/templates/quotes.html',
                controller: 'quotesController'
            })
            .state('quoteDetail', {
                url: '/quoteDetail/:RequestRevisionSK',
                templateUrl: 'app/modules/requests/templates/quoteDetail.html',
                controller: 'quoteDetailController'
            })

            // Create new request
            .state('newRequest', {
                url: '/newRequest/{type:string}/{requestNo:string}',
                templateUrl: 'app/modules/requests/templates/newRequest.html',
                controller: 'newRequestController'
            })

            .state('requestNotification', {
                url: '/requestNotification',
                templateUrl: 'app/modules/requests/templates/newRequest/requestNotifications.html',
                controller: 'requestNotificationController'
            })

            .state('deviceContacts', {
                url: '/deviceContacts',
                templateUrl: 'app/modules/requests/templates/newRequest/deviceContacts.html',
                controller: 'deviceContactsController'
            })

            .state('userEmails', {
                url: '/userEmails/{id:string}',
                templateUrl: 'app/modules/requests/templates/newRequest/userEmails.html',
                controller: 'userEmailsController'
            })

            .state('selectEndUser', {
                url: '/selectEndUser',
                templateUrl: 'app/modules/requests/templates/newRequest/selectEndUser.html',
                controller: 'selectEndUserController'
            })

            .state('selectProduct', {
                url: '/selectProduct',
                templateUrl: 'app/modules/requests/templates/newRequest/selectProduct.html',
                controller: 'selectProductController'
            })

            .state('productsWithQuestions', {
                url: '/productsWithQuestions',
                templateUrl: 'app/modules/requests/templates/newRequest/productsWithQuestions.html',
                controller: 'productsWithQuestionsController'
            })

            .state('selectRequiredResponse', {
                url: '/selectRequiredResponse',
                templateUrl: 'app/modules/requests/templates/newRequest/selectRequiredResponse.html',
                controller: 'selectRequiredResponseController'
            })

            .state('copyNotesAndFiles', {
                url: '/copyNotesAndFiles',
                templateUrl: 'app/modules/requests/templates/newRequest/copyNotesAndFiles.html',
                controller: 'copyNotesAndFilesController'
            })

            .state('disclaimer', {
                url: '/disclaimer',
                templateUrl: 'app/modules/requests/templates/newRequest/disclaimer.html',
                controller: 'disclaimerController'
            })

            .state('uploadFiles', {
                url: '/uploadFiles',
                templateUrl: 'app/modules/requests/templates/newRequest/uploadFiles.html',
                controller: 'uploadFilesController'
            })

            .state('productQuestions', {
                url: '/productQuestions',
                templateUrl: 'app/modules/requests/templates/newRequest/productQuestions.html',
                controller: 'productSpecificQuestionsController'
            })

            .state('multiOptions', {
                url: '/multiOptions/:productIndex/:questionIndex',
                templateUrl: 'app/modules/requests/templates/newRequest/productQuestionOptions.html',
                controller: 'multiOptionsController'
            })

            .state('submissionSuccessful', {
                url: '/submissionSuccessful',
                templateUrl: 'app/modules/requests/templates/submissionSuccessful.html'
            })

            // modify Quote

            .state('selectProductToRevise', {
                url: '/selectProductToRevise/:RequestRevisionSK',
                templateUrl: 'app/modules/requests/templates/modifyQuote/selectProductToRevise.html',
                controller: 'selectProductToReviseController'
            })

            .state('selectItemtoRevise', {
                url: '/selectItemtoRevise/:RequestRevisionSK',
                templateUrl: 'app/modules/requests/templates/modifyQuote/selectItemtoRevise.html',
                controller: 'selectItemtoReviseController'
            })

            .state('reviseQuote', {
                url: '/reviseQuote',
                templateUrl: 'app/modules/requests/templates/modifyQuote/reviseQuote.html',
                controller: 'reviseQuoteController'
            })

            .state('reviseSubmissionSuccessful', {
                url: '/reviseSubmissionSuccessful',
                templateUrl: 'app/modules/requests/templates/reviseSubmissionSuccessful.html'
            })

            // view current orders
            .state('orders', {
                url: '/orders',
                templateUrl: 'app/modules/orders/templates/orders.html',
                controller: 'ordersController'
            })

            // view order deatils
            .state('orderDetail', {
                url: '/orderDetail/:salesOrderNumber',
                templateUrl: 'app/modules/orders/templates/orderDetail.html',
                controller: 'orderDetailController'
            });

    }


})();