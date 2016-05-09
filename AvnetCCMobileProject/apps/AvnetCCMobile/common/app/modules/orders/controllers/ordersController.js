(function () {
    'use strict';

    angular.module('ccMobile.orders')
        .controller('ordersController', ordersController);

    /**
     * Orders controller main function.
     */
    function ordersController($scope, $state, $rootScope, ordersFactory, moment, userService) {
        console.log('ordersController: load');

        // BINDABLE VARS

        $scope.orders = [];
        $scope.moment = moment;
        $scope.getOrdersCalled = false;


        //BINDABLE FUNCS
        $scope.loadMore = loadMore;
        $scope.goToOrderDetail = goToOrderDetail;


        //INTERNAL VARS
        var searchObject = {};
        searchObject.customerId = userService.userData.customerId;

        var allOrders = [];
        var isAtEnd = false;

        var counter = 0;
        var pageSize = 10;

        //INTERNAL FUNCS
        function activate() {
            console.log('ordersController: activate');
            $rootScope.busyInd.show();
            getOrders();
        }

        function goToOrderDetail(salesOrderNumber){
            console.log('ordersController: goToOrderDetail: ', salesOrderNumber);
            $state.go('orderDetail', {salesOrderNumber: salesOrderNumber});
        }

        function loadMore() {
            console.log('ordersController: loadMore');
            if (!isAtEnd) {
                for (var i = counter; i < pageSize + counter; i++) {
                    if (i < allOrders.length) {
                        $scope.orders.push(allOrders[i]);
                    } else {
                        isAtEnd = true;
                        break;
                    }
                }
                if (!isAtEnd) {
                    counter = counter + pageSize;
                }
            }
        }

        function getOrders() {

            console.log('ordersController: getOrders: ', searchObject);

            ordersFactory.fetchOrders(searchObject).then(function (orders) {
                allOrders = orders;
                $scope.loadMore();
                $scope.getOrdersCalled = true;

            }, function () {

                //handle error in ui

            }).finally(function () {
                $rootScope.busyInd.hide();
            });

        }

        activate();

    }
})();