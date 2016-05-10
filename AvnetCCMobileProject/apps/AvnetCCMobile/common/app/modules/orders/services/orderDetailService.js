(function(){
	'use strict';

// service
angular
	.module('ccMobile.orders')
	.factory('orderDetailFactory', orderDetailFactory);

function orderDetailFactory($q) {
	
	var factory = {};
	
	//bindables
	factory.orderDetail = [];

	//factory.getOrderDetail = getOrderDetail;
	
	factory.getOrderDetail = function(salesOrderNumber) {
		
		var deferred = $q.defer();
		var invocationData = {
				adapter:  'OrdersAdapter',
				procedure:  'getOrderDetail',
				parameters:  [salesOrderNumber]
		}
		
		WL.Client.invokeProcedure(invocationData, {
				onSuccess:  loadFeedsSuccess,
				onFailure:  loadFeedsFailure
			}
		);
		
        function loadFeedsSuccess(result) {
            console.log('orderDetailFactory: getOrderDetail: success', result);
            var orderDetail = {};
            
            var response = result.invocationResult.Envelope.Body.ZqtcSalesorderGetdetailResponse;
            console.log('orderDetailFactory: getOrderDetail: response ', response);
            if (typeof response != 'undefined') {
                orderDetail.CustomerPo = response.CustomerPo;   
                orderDetail.OrderNo = response.OrderNo; 
                orderDetail.OrderAmount = response.OrderAmount; 
                orderDetail.OverallStatus = response.OverallStatus;
                orderDetail.OverallStatusDescription = prepareStatusDescription(response.OverallStatus);
                orderDetail.OrderDate = moment(response.OrderDate);
                orderDetail.ReqDate = moment(response.ReqDate);
                orderDetail.ShipTo = '';
                orderDetail.EndUser = '';
                var partnerTypes = response.PartnerDetails.item;
                if (partnerTypes.length > -1) {
                	for (var i = 0; i < partnerTypes.length; i++) {
                		//Get ShipTo
                		if (partnerTypes[i].PartnerType == 'WE') {
                			orderDetail.ShipTo = partnerTypes[i].Name;
                		}
                		//Get EndUser
                		if (partnerTypes[i].PartnerType == 'ZE') {
                			orderDetail.EndUser = partnerTypes[i].Name;
                		}               		
                	}
                }
            }
            
            deferred.resolve(orderDetail);          
        }
		
		function loadFeedsFailure(result) {
			console.log('orderDetailFactory: getOrderDetail: failure');
			deferred.reject(result);
		}
		

		
		return deferred.promise;
		
	}
	
	return factory;
}

function prepareStatusDescription (statusCode) {
    if (statusCode == 'A') {
        return 'Open';
    }
    else if (statusCode == 'B') {
        return 'Partial';
    }
    else if (statusCode == 'C') {
        return 'Closed';
    }
}

})();