(function () {
    'use strict';

    angular.module('ccMobile.orders')
        .controller('orderDetailController', orderDetailController);
    /**
     * Order detail controller main function.
     */
    function orderDetailController($scope, $state, $stateParams, $rootScope, ordersFactory, moment) {
        console.log('orderDetailController: load');

        // BINDABLE VARS
        $scope.handleBackButton = handleBackButton;

        //INTERNAL FUNCS
        function activate() {
            console.log('orderDetailController: activate');

        }

        function handleBackButton(){
            $state.go('orders');
        }

        activate();

    }
})();