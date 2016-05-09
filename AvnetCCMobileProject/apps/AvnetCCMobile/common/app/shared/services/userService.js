(function () {
    'use strict';

    angular.module('ccMobile')
        .factory('userService', userService);
    
    /**
     * @name userService
     * @desc Service for managing user data
     */

    function userService($q, CONST, $rootScope) {

        var service = {};

        //bindables

        service.userData = {
            avnetStatusCode: '',
            id: '',
            isExternalUser: '',
            customerId: '',
            email: '',
            firstName: '',
            lastName: '',
            roles: [],
            permissions: {
                requests: false,
                orders: false,
                invoices: false
            }
        };

        //bindable methods
        service.getUser = getUser;


        function getUser(userId) {
            var deferred = $q.defer();

            var userId = userId ? userId : service.userData.id;

            if(!userId){

                console.log('userService: getUser: no username');

                service.userData.id = localStorage.getItem('LoginId');

                console.log('userService: getUser: set to username from localStorage: ', service.userData.id);
            }

            console.log('userService: getUser: ', service.userData.id);

            var invocationData = {
                adapter: 'UserAdapter',
                procedure: 'getUser',
                parameters: [service.userData.id]
            };

            WL.Client.invokeProcedure(invocationData, {
                onSuccess: loadSuccess,
                onFailure: loadFailure
            });

            function loadSuccess(result) {
                console.log('userService: getUser: success', result);

                prepareUserData(result.responseJSON.userData);

                console.log('userService: getUser: loadSuccess: service.userData.customerId', service.userData);

                deferred.resolve(service.userData);
            }

            function loadFailure(result) {
                console.log('userService: getUser: error', result);
                deferred.reject(result);
            }

            return deferred.promise;

        }


        function prepareUserData(userData) {

            console.log('userService: prepUserData: ', userData);

            service.userData.avnetStatusCode = userData.avnetStatusCode;
            service.userData.id = userData.id;
            service.userData.isExternalUser = userData.isExternalUser;
            service.userData.customerId = userData.customerId;
            service.userData.email = userData.email;
            service.userData.firstName = userData.firstName;
            service.userData.lastName = userData.lastName;
            service.userData.roles = userData.roles;
            $rootScope.IsInternal = service.userData.isExternalUser;

            preparePermissions(service.userData.roles);

            return service.userData;

        }


        function preparePermissions(rolesArray) {

            console.log('userService: preparePermissions: ', rolesArray);

            if(service.userData.isExternalUser){
                for(var a = 0; a < CONST.TOOLS.length; a++){
                    var tool = CONST.TOOLS[a];
                    for (var i = 0; i < rolesArray.length; i++) {
                        var role = rolesArray[i];
                        if (role.name == tool.role) {
                            console.log('userService: preparePermissions: role found: ', role.name);
                            service.userData.permissions[tool.id] = true;
                        }
                    }
                }
            }else{
                console.log('userService: preparePermissions: internal so setting all to true');
                for(var a = 0; a < CONST.TOOLS.length; a++){
                    service.userData.permissions[tool.id] = true;
                }
            }

        }

        return service;
    }
})();
