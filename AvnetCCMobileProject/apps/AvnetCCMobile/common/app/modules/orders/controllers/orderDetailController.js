(function () {
    'use strict';

    angular.module('ccMobile.orders')
        .controller('orderDetailController', orderDetailController);
    /**
     * Order detail controller main function.
     */
    function orderDetailController($scope, $state, $stateParams, $rootScope, orderDetailFactory, moment) {
        console.log('orderDetailController: load');

        // BINDABLE VARS
        $scope.handleBackButton = handleBackButton;
        $scope.orderDetail = [];
        
        // INTERNAL VARS
        var salesOrderNumber = $stateParams.salesOrderNumber;
        var orderDetail;
        
        // BINDABLE FUNCS
        $scope.getOrderDetail = getOrderDetail;

        //INTERNAL FUNCS
        function activate() {
            console.log('orderDetailController: activate');
            $rootScope.busyInd.show();
            getOrderDetail();
        }

        function handleBackButton(){
            $state.go('orders');
        }
        
        function getOrderDetail() {

            console.log('orderDetailController: getOrderDetail ', salesOrderNumber);

            orderDetailFactory.getOrderDetail(salesOrderNumber).then(function (orderDetailResult) {
                orderDetail = orderDetailResult;

            }, function () {

                //handle error in ui

            }).finally(function () {
                $rootScope.busyInd.hide();
            });

        }

        activate();

    }
})();