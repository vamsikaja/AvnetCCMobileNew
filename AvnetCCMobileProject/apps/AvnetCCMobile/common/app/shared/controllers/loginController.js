(function () {
    'use strict';
    angular.module('ccMobile')
        .controller('loginController', loginController);

    /**
     * login controller main function
     */
    function loginController($scope, userService, CONST, $state, $timeout, $rootScope, $interval, newRequestFactory, quoteDetailFactory) {

        console.log('loginController: load');

        //bindable vars
        $scope.user = {};
        $scope.user.userNameError = {};
        $scope.user.passwordError = {};
        $scope.webViewOverlayShown = false;
        $scope.hideForgotCredentials = false;
        $scope.networkConnected = true;


        //bindable methods
        $scope.setFocus = setFocus;
        $scope.validateInput = validateInput;
        $scope.toggleWebViewShown = toggleWebViewShown;
        $scope.login = login;


        //internal vars

        var isLocalDev = CONST.LOCAL;


        //internal funcs

        function activate() {
            console.log('loginController: activate');
            clearSessionData();
            $rootScope.busyInd.hide();
        }

        function clearSessionData() {
            console.log('loginController: clearSessionData');
            $rootScope.modalShown = undefined;
            $rootScope.showDetailsHeaderButton = false;
            newRequestFactory.resetNewRequest();
            quoteDetailFactory.quoteDetailData = undefined;
            quoteDetailFactory.quoteDetailEndUserClicked = undefined;
            quoteDetailFactory.addNoteSendNotificationClicked = undefined;
        }

        /**
         * submit Login function
         */
        function submitLoginForm() {
            console.log('loginController: login');
            if (!$rootScope.busyInd.isVisible()) {
                $rootScope.busyInd.show();
            }
            console.log('submitLoginForm: ', $scope.user);

            var reqURL = '/../../../pkmslogin.form';
            var options =
            {
                headers: {},
                parameters: {
                    username: $scope.user.userName,
                    password: $scope.user.password,
                    'login-form-type': 'pwd'
                }
            };
            username = $scope.user.userName;
            password = $scope.user.password;
            HeaderAuthRealmChallengeHandler.submitLoginForm(reqURL, options, handleSubmit);
        }


        /**
         * login function
         */
        function login(loginForm) {
            console.log('loginController: login: ', $scope.user);
            setBlur('username');
            setBlur('password');
            if ($scope.user.userName == undefined || $scope.user.password == undefined || $scope.user.userName == "" || $scope.user.password == "") {
                if ($scope.user.password == undefined) {
                    $scope.user.passwordError.missingInput = true;
                    addTransition('password');
                }

                if ($scope.user.userName == undefined) {
                    $scope.user.userNameError.missingInput = true;
                    addTransition('username');
                }
            } else {

                userService.userData.id = $scope.user.userName;

                if (!$rootScope.busyInd.isVisible()) {
                    $rootScope.busyInd.show();
                }

                if (isLocalDev) {
                    $state.go('home');
                } else {
                    submitLoginForm();
                }

            }
        }

        /**
         * handling the response from the challenge Handler
         *
         * @param response - Challenge Handler Response
         */
        function handleSubmit(response) {
            if (isPkmsLogin(response)) {
                location.hash = "#/login";
                $rootScope.busyInd.hide(response);
                $scope.user.userNameError = {};
                $scope.user.passwordError = {};
                $scope.user.errorOccured = {};
                if (isAccountLocked(response)) {
                    $scope.$apply(function () {
                        $scope.user.userNameError.accountLocked = true;
                        $scope.user.passwordError.accountLocked = true;
                        $scope.user.errorOccured.accountLocked = true;
                    });
                } else {
                    $scope.$apply(function () {
                        $scope.user.userNameError.wrongCredentials = true;
                        $scope.user.passwordError.wrongCredentials = true;
                        $scope.user.errorOccured.wrongCredentials = true;
                    });
                }
            } else {
                HeaderAuthRealmChallengeHandler.submitSuccess();
                console.log('loginController: handleSubmit: success');
                setTimeout(function () {
                    checkIfAuthenticated();
                }, 1000);
            }
        }

        function checkIfAuthenticated() {
            console.log('loginController: checkIfAuthenticated');
            //alert("(WL.Client.isUserAuthenticated(\"HeaderAuthRealm\"): " + WL.Client.isUserAuthenticated("HeaderAuthRealm"));
            if (WL.Client.isUserAuthenticated("HeaderAuthRealm") == true) {
                //WL.Client.checkForDirectUpdate();
                getAuthData();
            } else {
                //TODO: Following line for debugging only. Remove before going live.
                //alert ("HeaderAuthRealm = false");
                setTimeout(function () {
                    /*if (location.hash == "#/login") {
                     // If auto update redirects back to login, do nothing.
                     //alert("Recognize redirect back to login. Stop authenticating");
                     }
                     else {*/
                    WL.Client.updateUserInfo();
                    checkIfAuthenticated();
                    /*}*/
                }, 1000);
            }
        }

        /**
         * function to add class for transition
         * @param element
         */
        function addTransition(element) {
            $scope[element + 'HeadingClass'] = 'transitionClass';
        }

        /**
         * function to set the focus on any html form element
         * @param elementClass
         * @param event
         */
        function setFocus(elementClass, event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            addTransition(elementClass);
            $timeout(function () {
                document.getElementsByClassName(elementClass)[0].focus();
            });
        }

        /**
         * function to take away the focus on any html form element
         * @param elementClass
         */
        function setBlur(elementClass) {
            $timeout(function () {
                document.getElementsByClassName(elementClass)[0].blur();
            });
        }

        function validateInput(inputField) {
            if ($scope.user[inputField] == undefined || $scope.user[inputField] == "") {
                $scope.user[inputField + 'Error'].missingInput = true;
            }
        }

        /**
         * function to handle the backbutton
         */
        function handleBackButton() {
            if ($scope.webViewOverlayShown) {
                window.shopWebViewOverlay.close();
                $rootScope.$broadcast("close-passwordResetModal");
                $scope.webViewOverlayShown = false;
            } else {
                $rootScope.$broadcast("handleBack");
            }
        }

        /**
         * function top toggle the webview overlay
         * @Param shown
         */
        function toggleWebViewShown(shown) {
            console.log(shown);
            $scope.webViewOverlayShown = shown;
        }

        /**
         * function to override the back button
         */
        WL.App.overrideBackButton(function (e) {
            e.preventDefault();
            handleBackButton();
        });

        //check network status
        WL.Device.getNetworkInfo(function (networkInfo) {
            if (networkInfo.isNetworkConnected == "true") {
                $scope.networkConnected = true;
            }
            else {
                $scope.networkConnected = false;
            }
        });
        $interval(function () {
            WL.Device.getNetworkInfo(function (networkInfo) {
                if (networkInfo.isNetworkConnected == "true") {
                    $scope.networkConnected = true;
                }
                else {
                    $scope.networkConnected = false;
                }
                $scope.$apply();
            });
        }, 5000);

        activate();
    }
})();