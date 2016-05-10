
/* JavaScript content from app/mobilefirst/app.wl.init.js in folder common */
var wlInitOptions = {

    // # To disable automatic hiding of the splash screen uncomment this property and use WL.App.hideSplashScreen() API
    //autoHideSplash: false,

    // # The callback function to invoke in case application fails to connect to MobileFirst Server
    //onConnectionFailure: function (){},

    // # MobileFirst Server connection timeout
    //timeout: 30000,

    // # How often heartbeat request will be sent to MobileFirst Server
    //heartBeatIntervalInSecs: 20 * 60,

    // # Enable FIPS 140-2 for data-in-motion (network) and data-at-rest (JSONStore) on iOS or Android.
    //   Requires the FIPS 140-2 optional feature to be enabled also.
    //enableFIPS : false,

    // # The options of busy indicator used during application start up
    //busyOptions: {text: "Loading..."}
};

if (window.addEventListener) {
    window.addEventListener('load', function() { WL.Client.init(wlInitOptions); }, false);
} else if (window.attachEvent) {
    window.attachEvent('onload',  function() { WL.Client.init(wlInitOptions); });
}


function wlCommonInit() {

    console.log('main: wlCommonInit');

    //CONNECT
    WL.Client.connect({
        onSuccess: function () {
            console.log('main: wlCommonInit: WL.Client.connect: onSuccess');
            WL.Client.setHeartBeatInterval(10);
        },
        onFailure: function (error) {
            console.log('main: wlCommonInit: WL.Client.connect: onFailure', error);
        }
    });

    //DEFINE JSON STORE COLLECTIONS
    var collections = {
        quotes: {
            "searchFields": {
                "RequestNO": 'integer'
            }
        },
        quoteDetails: {
            "searchFields": {
                "RequestRevisionSK": 'integer'
            }
        },
        favoriteEndUser: {
            "searchFields": {
                "PartnerId": 'string',
                "loginId": 'string'
            }
        },
        favoriteProduct: {
            "searchFields": {
                "EntityTemplateSk": 'integer',
                "loginId": 'string'
            }
        },
        recentNotificationEmails: {
            "searchFields": {
                "loginId": "string",
                "email": "string"
            }
        }
    };

    //DEFINE JSON STORE OPTIONS
    var options = {
        username: 'avnetR2O',
        password: 'avnet',
        localKeyGen: false
    };

    console.log('main: wlCommonInit: WL.JSONStore.init', collections, options);


    //INIT JSON STORE
    WL.JSONStore.init(collections, options)
        .then(function () {

            console.log('main: wlCommonInit: WL.JSONStore.init.then');

            angular.element(document).ready(function () {

                console.log('main: wlCommonInit: angular.element(document).ready: bootstrapping angular');

                angular.bootstrap(document, ['ccMobile']);

                if (localStorage.getItem('gotDirectUpdate') == 'YES') {

                    console.log('main: wlCommonInit: angular.element(document).ready: gotDirectUpdate');

                    localStorage.setItem('gotDirectUpdate', 'NO');
                    username = localStorage.getItem('username');
                    password = localStorage.getItem('password');
                    localStorage.removeItem("username");
                    localStorage.removeItem("password");
                    getAuthData();
                } else {

                    console.log('main: wlCommonInit: angular.element(document).ready: navigating to login');
                    //GO TO LOGIN SCREEN
                    location.hash = "#/login";
                }
            });
        });
}