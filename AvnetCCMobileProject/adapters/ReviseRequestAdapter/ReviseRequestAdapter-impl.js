/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 *  WL.Server.invokeHttp(parameters) accepts the following json object as an argument:
 *  
 *  {
 *  	// Mandatory 
 *  	method : 'get' , 'post', 'delete' , 'put' or 'head' 
 *  	path: value,
 *  	
 *  	// Optional 
 *  	returnedContentType: any known mime-type or one of "json", "css", "csv", "plain", "xml", "html"  
 *  	returnedContentEncoding : 'encoding', 
 *  	parameters: {name1: value1, ... }, 
 *  	headers: {name1: value1, ... }, 
 *  	cookies: {name1: value1, ... }, 
 *  	body: { 
 *  		contentType: 'text/xml; charset=utf-8' or similar value, 
 *  		content: stringValue 
 *  	}, 
 *  	transformation: { 
 *  		type: 'default', or 'xslFile', 
 *  		xslFile: fileName 
 *  	} 
 *  } 
 */

/**
 * @param interest
 *            must be one of the following: world, africa, sport, technology, ...
 *            (The list can be found in http://edition.cnn.com/services/rss/)
 * @returns json list of items
 */
function reviseRequest(cookie, sessionId, request) {
	
	var reviseRequestInput = {
			method : 'post',
			body : {
				contentType : "multipart/form-data; boundary=----WebKitFormBoundaryXlFLdEOMtDkAWzMY", 
				content : getSampleReviseRequest(request)
			},
			headers : {
				"Cookie" : cookie,
				"R2oSessionId" : sessionId,
				"Accept-Encoding" : "gzip, deflate, sdch",
				"Content-Type" : "multipart/form-data; boundary=----WebKitFormBoundaryXlFLdEOMtDkAWzMY",
				"Accept" : "*/*",
				"Accept-Language" : "en-US,en;q=0.8"
			},
			path : 'api/request/revise'
		};
		
	var response = WL.Server.invokeHttp(reviseRequestInput);
	response.cookie = response.responseHeaders['Set-Cookie'];
	return response;
}

/**
 * function to prepare the sample request to be submitted
 * @param request
 * @returns {String}
 */
function getSampleReviseRequest(request){
	var sampleReviseReqInput = '------WebKitFormBoundaryXlFLdEOMtDkAWzMY\n'+
	'Content-Disposition: form-data; name="ReviseResponse"'+'\n\n'+
	JSON.stringify(request) +
	'\n'+
	'------WebKitFormBoundaryXlFLdEOMtDkAWzMY--';
	
	return sampleReviseReqInput;
}

/**
 * function to initialize the response
 * @returns {___anonymous1303_1747}
 */
function initializeResponse() {
	return {

		error : {
			type : null, // type of error
			messages : [], // error messages
			code : null, // error code
			params : []
		// param that might be the root cause of the issue
		},
		warning : {
			type : null, // type of error
			messages : [], // error messages
			code : null, // error code
			params : []
		// param that might be the roor cause of the issue
		},
		action : {
			code : null
		},
		isAdapterResponseSuccessful : true
	};
}
