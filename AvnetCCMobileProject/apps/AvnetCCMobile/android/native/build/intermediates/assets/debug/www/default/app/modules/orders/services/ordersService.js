
/* JavaScript content from app/modules/orders/services/ordersService.js in folder common */

/**
*  Orders Service
*
*  Provides methods for getting Orders Data
*/
(function(){
	'use strict';
	
	angular.module('ccMobile.orders')
	.factory('ordersFactory', ordersFactory);
	
	function ordersFactory($q, moment){
		
		var service = {};

		//bindables
		service.orders = [];

		service.fetchOrders = fetchOrders;

		//internals
		function fetchOrders(searchObject) {
			var deferred = $q.defer();

			console.log('ordersService: fetchOrders');

			var options = {
				customerId: searchObject.customerId
//				customerPo: searchObject.customerPo,
//				searchType: searchObject.searchType
			};

//			var options = {
//					customerId: userService.userData.customerId
//			}
			
			var invocationData = {
				adapter: 'OrdersAdapter',
				procedure: 'getOrders',
				parameters: [options]
			};

			console.log('ordersService: fetchOrders', invocationData);

			WL.Client.invokeProcedure(invocationData, {
				onSuccess: loadFeedsSuccess,
				onFailure: loadFeedsFailure
			});


			function loadFeedsSuccess(result) {
				console.log('ordersService: fetchOrders: success', result, result.responseJSON.Envelope.Body.ZqtcSalesorderSearchResponse.Saleorders.item);
	            var salesOrders = [];
	            var response = result.responseJSON.Envelope.Body.ZqtcSalesorderSearchResponse.Saleorders.item;
	            if (typeof response != 'undefined') {
	            	salesOrders = response;	
	            }
	            // convert bookdate to moment
	            for (var i = 0; i < salesOrders.length; i++) {
	            	salesOrders[i].BookDate = moment(salesOrders[i].BookDate, 'YYYY-MM-DD');
	            }
	            // sort descending
	            salesOrders.sort(function(a, b) {
	            	return b.BookDate - a.BookDate;
	            });

	            // add status description
	        	for (var a = 0; a < salesOrders.length; a++) {
	        	    if (salesOrders[a].StatusCode == 'A') {
	        	    	salesOrders[a].StatusDescription = 'Open';
	        	    }
	        	    else if (salesOrders[a].StatusCode == 'B') {
	        	    	salesOrders[a].StatusDescription = 'Partial';
	        	    }
	        	    else if (salesOrders[a].StatusCode == 'C') {
	        	    	salesOrders[a].StatusDescription = 'Complete';
	        	    }
	        	}	            
				deferred.resolve(salesOrders);
			}

			function loadFeedsFailure(result) {
				console.log('ordersService: fetchOrders: error', result);
				deferred.reject(result);
			}


			return deferred.promise;
		}
		
		return service;
	}
})();
