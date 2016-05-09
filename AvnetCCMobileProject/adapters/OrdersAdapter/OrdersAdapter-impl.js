
/**
 * Note: SOAP 1.2
 * @param options params:customerId, searchType
 * @returns object list of orders
 */
function getOrders(options) {

	var path = 'mediator-test2/ws/getMobOrderStatusVS';
	
	// build from and to dates and format
    var today = new Date();
    var toDateFormatted = formatDate(today);
    var fromDateFormatted = formatDate(adjustMonths(today, -6));

    // retrieve options
	var customerId = options.customerId ? options.customerId : '';
	var searchType = options.searchType ? options.searchType : 'AL';
	
	// build request string
	var soapRequestString = 
		'<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">'
			+ '<soap:Header/>'
			+ '<soap:Body>'
				+ '<urn:ZqtcSalesorderSearch>'
					+ '<CustomerId>' + customerId + '</CustomerId>'
					+ '<FromDate>' + fromDateFormatted + '</FromDate>'
					+ '<SearchType>' + searchType + '</SearchType>'
					+ '<ToDate>' + toDateFormatted + '</ToDate>' 
					+ '<Sonumberout>100</Sonumberout>'
				+ '</urn:ZqtcSalesorderSearch>'
			+ '</soap:Body>'
		+ '</soap:Envelope>';
	
	// build input
	var input = {
		method : 'post',
		returnedContentType : 'xml',
		path : path,
		body : {
			content : soapRequestString,
			contentType : 'application/soap+xml;charset=UTF-8'
		}
	};

	WL.Logger.info(input);

	return WL.Server.invokeHttp(input);
}

/**
 * Returns detailed information about a single sales order.  isSuccessful = false returned on errors or 
 * unsuccessful order search
 * 
 * @param salesOrderNumber sales order number of desired order
 */
function getOrderDetails(salesOrderNumber) {
	var path = 'mediator-test2/ws/getMobOrderStatusDetailVS';
	WL.Logger.warn(salesOrderNumber);	
	// build request string
	var soapRequestString = getOrderDetailsRequest(salesOrderNumber);
	WL.Logger.warn(soapRequestString);
	
	// build input
	var input = {
		method : 'post',
		returnedContentType : 'xml',
		path : path,
		body : {
			content : soapRequestString,
			contentType : 'text/xml;charset=UTF-8'
		},
		headers: {
			SOAPAction : "urn:sap-com:document:sap:soap:functions:mc-style:ZWS_QTC_SALESORDER_GETDETAIL:ZqtcSalesorderGetdetailRequest"
		}
	};

	WL.Logger.warn(input);
	orderDetails =  WL.Server.invokeHttp(input);
	WL.Logger.warn(orderDetails);
	if (typeof orderDetails.Envelope.Body.ZqtcSalesorderGetdetailResponse != 'undefined') {
		return orderDetails.Envelope.Body.ZqtcSalesorderGetdetailResponse;
	} else {
		return {
			isSuccessful: false 
		}
	}
	
		
}

/**
 * getOrderDetailsRequest build request string
 * 
 * @param salesOrderNumber
 */
function getOrderDetailsRequest(salesOrderNumber) {
	var request = '<soapenv:Envelope ' + 
			' xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' + 
			' xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">' + 
			'<soapenv:Header/>' + 
			'<soapenv:Body>' + 
			'<urn:ZqtcSalesorderGetdetail>' + 
			'<SalesOrderNo>' + salesOrderNumber + '</SalesOrderNo>' + 
			'</urn:ZqtcSalesorderGetdetail>' + 
			'</soapenv:Body>' + 
			'</soapenv:Envelope>';

	return request;
}


/**
 * Format date as yyyy-mm-dd format
 * @param date as Date object
 * @returns String in yyyy-mm-dd format
 */
function formatDate(date) {
	var outdate = '';
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    outdate = yyyy+'-'+mm+'-'+dd;
    return outdate;
}

/**
 * adjustMonths (add or remove months to current date)
 * @date number of months.  Positive to 
 * @months number of months to add (negative number to subtract)
 * @returns date string in yyyy-mm-dd format
 */
function adjustMonths(date, months) {
	date.setMonth(date.getMonth() + months);
	return date;
}