//DEFINE GLOBALS

var username, password;
var triedAuthentication = false;
var HeaderAuthRealmChallengeHandler;
var busyInd = new WL.BusyIndicator('content', {text: 'Loading...'});
var getAuthDataMethodCalled = false;
var sessionResponse;


//HANDLE DIRECT UPDATE
wl_directUpdateChallengeHandler.handleDirectUpdate = function (directUpdateData, directUpdateContext) {
    console.log('challengeHandler: handleDirectUpdate');
    busyInd.hide();
    var customDialogTitle = 'Update Available';
    var customDialogMessage = 'An update to the Channel Connection app is available. Tap the OK button below to install. For security reasons you may be required to log in again after updating.';
    var customButtonText = 'OK';

    WL.SimpleDialog.show(customDialogTitle, customDialogMessage, [{
        text: customButtonText,
        handler: function () {
            directUpdateContext.start();
            localStorage.setItem('gotDirectUpdate', 'YES');
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        }
    }]);
};

//HEADER AUTH REALM
HeaderAuthRealmChallengeHandler = WL.Client.createChallengeHandler('HeaderAuthRealm');

//CUSTOM RESPONSE
HeaderAuthRealmChallengeHandler.isCustomResponse = function (response) {
    if (isPkmsLogin(response)) {
        return true;
    } else {
        return false;
    }
};

//DETERMINE IF PKMS LOGIN
function isPkmsLogin(response) {

    if (response.responseText.search('/pkmslogin.form') > 0 || response.responseText.search('Account Temporarily Locked Out') > 0) {
        //busyInd.hide();

        /*if(response.responseText.search("/m-test.avnet.com") > 0 ){
         localStorage.setItem("fileBaseUrl","http://r2o-test.avnet.com/api/file/");
         }
         else if(response.responseText.search("/m-dev.avnet.com") > 0){
         localStorage.setItem("fileBaseUrl","http://r2o-dev.avnet.com/api/file/");
         }
         else{
         localStorage.setItem("fileBaseUrl","http://r2o.avnet.com/api/file/");
         }*/

        localStorage.setItem('fileBaseUrl', 'https://r2om.avnet.com/api/file/');
        clearCookies();
        console.log('challengeHandler: isPkmsLogin: true');
        return true;
    } else {
        console.log('challengeHandler: isPkmsLogin: false');
        return false;
    }
}

//CLEAR COOKIES
function clearCookies() {
    console.log('challengeHandler: clearCookies');
    localStorage.removeItem('pdhSessionId');
    localStorage.removeItem('pdId');
    localStorage.removeItem('bigIpCookie');
}

//CHECK IF USER LOGGED OUT
function isUserLoggedOut(response) {

    if (response.responseText.search('logged out') > 0) {
        console.log('challengeHandler: isUserLoggedOut: true');
        return true;
    } else {
        console.log('challengeHandler: isUserLoggedOut: false');
        return false;
    }
}

//CHECK IF ACCOUNT LOCKED
function isAccountLocked(response) {
    if (response.responseText.search('Account Temporarily Locked Out') > 0) {
        console.log('challengeHandler: isAccountLocked: true');
        return true;
    } else {
        console.log('challengeHandler: isAccountLocked: false');
        return false;
    }
}

//HANDLE FAILURE - MISSING?
HeaderAuthRealmChallengeHandler.handleFailure = function (response) {
    console.log('challengeHandler: handleFailure: ', response);
};

//HANDLE CHALLENGE
HeaderAuthRealmChallengeHandler.handleChallenge = function (response) {
    console.log('challengeHandler: handleChallenge: ', response.responseText);
    WL.Client.updateUserInfo();
    if (isPkmsLogin(response) || isUserLoggedOut(response)) {
        location.hash = '#/login';
    }
};

//DELETE USER DATA FROM LOCAL STORAGE
function deleteTokens() {
    console.log('challengeHandler: deleteTokens ');
    localStorage.removeItem('cookie');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('emailAddress');
    localStorage.removeItem('pid');
    localStorage.removeItem('FullName');
    localStorage.removeItem('LoginId');
    localStorage.removeItem('IsInternal');
    localStorage.removeItem('PartnerId');
}

//GET AUTH DATA
function getAuthData() {
    console.log('challengeHandler: getAuthData: getAuthDataMethodCalled:', getAuthDataMethodCalled);

    if (!getAuthDataMethodCalled) {
        getAuthDataMethodCalled = true;
        triedAuthentication = false;

        deleteTokens();

        var invocationData = {
            adapter: 'QuotesAdapter',
            procedure: 'getSessionIdAndCookie',
            parameters: [username, password]
        };

        var options = {
            onSuccess: function (result) {
                sessionResponse = result;
                console.log('challengeHandler: getAuthData: QuotesAdapter: getSessionIdAndCookie: onSuccess', result);
                getCookie = result;
                if (result.invocationResult.isSuccessful) {
                    getAuthDataMethodCalled = false;
                    localStorage.setItem('cookie', result.invocationResult.cookie);
                    localStorage.setItem('pid', result.invocationResult.pid);
                    localStorage.setItem('sessionId', result.invocationResult.r2oSessionId);
                    localStorage.setItem('emailAddress', result.invocationResult.emailAddress);
                    localStorage.setItem('FullName', result.invocationResult.FullName);
                    localStorage.setItem('LoginId', result.invocationResult.LoginId);
                    localStorage.setItem('IsInternal', result.invocationResult.IsInternal);
                    localStorage.setItem('PartnerId', result.invocationResult.PartnerId);
                    location.hash = '#/home';
                } else {
                    busyInd.hide();
                    getAuthDataMethodCalled = false;
                }
            },
            onFailure: failure(),
            invocationContext: {}
        };

        function failure(error) {
            console.log('challengeHandler: getAuthData: QuotesAdapter: getSessionIdAndCookie: failure', error);

            WL.Client.invokeProcedure(invocationData, options);
        }

        if (!busyInd.isVisible()) {
            busyInd.show();
        }

        WL.Client.invokeProcedure(invocationData, options);
    }
    else {
        console.log('challengeHandler: getAuthData: getAuthDataMethodCalled: skipping to avoid calling multiple times');
    }
}

//CLEAR ON SESSION TIMEOUT
function clearOnSessionOut() {
    console.log('challengeHandler: clearOnSessionOut ');
    var doc = angular.element(document);
    var $rootScope = doc.injector().get('$rootScope');
    $rootScope.$apply(function () {
        $rootScope.modalShown = undefined;
    });
}

//ADD COOKIE VALUES
function addCookieValues(header) {
    console.log('challengeHandler: addCookieValues: ', header);
    if (!angular.isArray(header)) {
        header = header.split(',');
    }
    console.log('challengeHandler: addCookieValues: headers: ', header);

    for (var i = 0; i < header.length; i++) {
        if (header[i].indexOf('PD-H-SESSION-ID') != -1) {
            localStorage.setItem('pdhSessionId', header[i]);
        }
        else if (header[i].indexOf('PD-ID') != -1) {
            localStorage.setItem('pdId', header[i]);
        }
        else if (header[i].indexOf('bigip-cookie') != -1) {
            localStorage.setItem('bigIpCookie', header[i]);
        }
    }
}

//UPDATE COOKIE
function updateCookie(cookie) {
    console.log('challengeHandler: updateCookie: ', cookie);
    localStorage.setItem("cookie", cookie);
}