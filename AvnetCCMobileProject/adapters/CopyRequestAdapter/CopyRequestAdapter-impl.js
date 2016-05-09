/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */


/**
 * function to copy a request
 * @param cookie
 * @param r2oSessionId
 * @param requestNo
 * @param isInternal
 */
function copyRequest(cookie, r2oSessionId, requestNo, isInternal) {
	path = "api/request/copy/" + requestNo;
	var copyRequestResponse = initializeResponse();
	var input = {
			method : 'get',
			body : {
				contentType : "application/json",
				content : ""
			},
			headers : {
				"Cookie" : cookie,
				"R2oSessionId" : r2oSessionId
			},
			path : path,
	};
	
	copyRequestResponse.data =  WL.Server.invokeHttp(input);
	
	//filter only required partners and add that partner to RecentEndUsers if it doesnot exist
	/*
	var addedPartners = [];
	if(copyRequestResponse.data.Partners != null){
		for(var i=0; i <  copyRequestResponse.data.Partners.length; i++){
			if(copyRequestResponse.data.Partners[i].PartnerRoleTypeCode == "SAPEUO"){
				addedPartners.push(copyRequestResponse.data.Partners[i]);
			}
		}
	}
	//copyRequestResponse.data.Partners = addedPartners;
	
	if(copyRequestResponse.data.Partners.length > 0){
		var partnerExist = false;
		for(var i=0; i <  copyRequestResponse.data.RecentEndUsers.length; i++){
			if(copyRequestResponse.data.RecentEndUsers[i].PartnerId == addedPartners[0].PartnerId){
				partnerExist = true;
			}
		}		
		if(!partnerExist){
			copyRequestResponse.data.RecentEndUsers.push(addedPartners[0]);
		}
	}
	*/
	copyRequestResponse.data.LookupLists = [];
	
	var lookUpLists = (getAllProducts(cookie, r2oSessionId).LookupLists || {}).EntityTemplates || [];
	
	for(var i=0; i < lookUpLists.length; i++){
		if(isInternal == "true"){
			if(!lookUpLists[i].IsPrimaryTemplate && lookUpLists[i].IsUserDisplay){
				copyRequestResponse.data.LookupLists.push(lookUpLists[i]);
			}
		}else{
			if(!lookUpLists[i].IsPrimaryTemplate && lookUpLists[i].IsExternalDisplay && lookUpLists[i].IsUserDisplay){
				copyRequestResponse.data.LookupLists.push(lookUpLists[i]);
			}
		}
	}
	copyRequestResponse.cookie = copyRequestResponse.data.responseHeaders['Set-Cookie'];
	return copyRequestResponse;
}

/**
 * function to get all products
 * @param cookie
 * @param sessionId
 * @returns
 */
function getAllProducts(cookie, sessionId){
	var lookUpListInput = {
        method : 'put',
        body : {
            contentType : "application/json",
            content : '["EntityTemplates"]'
        },
        headers : {
			"Cookie" : cookie,
			"R2oSessionId" : sessionId
		},
        path : 'api/lookuplist',
    };

    var lookUpListResp = WL.Server.invokeHttp(lookUpListInput);
	return lookUpListResp;
}


/**
 * function to initialize the response
 * @returns {___anonymous2771_3215}
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
