/**
 * function to get the cookies from the R2O server
 * @param username
 * @param password
 * @returns {object}
 */
function getSessionIdAndCookie(username, password){

	WL.Logger.warn('QuotesAdapter: getSessionIdAndCookie: ' + username + ' / ' + password);

	var req = WL.Server.getClientRequest();
	var pid = req.getHeader("cookie");
	var PHID = getPHID(pid, username, password)[0];
	
	var input = {
			method : 'get',
			headers : {
				"Cookie" : PHID
			},
			path : "api/user/login"
		};

	var authResponse = WL.Server.invokeHttp(input);

	WL.Logger.warn('QuotesAdapter: getSessionIdAndCookie: response: ' + JSON.stringify(authResponse));

	return {
		cookie : authResponse.responseHeaders['Set-Cookie'],
		r2oSessionId : authResponse.LoginUser.SessionId,
		emailAddress : authResponse.LoginUser.EmailAddress,
		IsInternal : authResponse.LoginUser.IsInternal,
		pid : pid,
		FullName : authResponse.LoginUser.FullName,
		LoginId : authResponse.LoginUser.LoginId,
		PartnerId : authResponse.LoginUser.PartnerId==null?"":authResponse.LoginUser.PartnerId,
		resp : authResponse
	};
}

/********** getPHID method   *******/ 

/**
 * getPHID - function to fetch the PHID 
 * @param pid
 * @param username
 * @param password 
 */
function getPHID(pid, username, password){

	var searchInput = {
			method : 'post',
			body : {
				contentType : "application/json",
				content : "username="+ username +"&password="+ password +"&login-form-type=pwd&host-request-type="
			},
			headers : {
				"Cookie" : pid
			},
			path : '/pkmslogin.form'
		};

		var searchResponse = WL.Server.invokeHttp(searchInput);


	WL.Logger.warn('QuotesAdapter: getPHID: response: ' + JSON.stringify(searchResponse));

	return searchResponse.responseHeaders['Set-Cookie'];
}


/**
 * Function to fetch the list of quotes from the R2O service
 * @param cookie
 * @param sessionId
 * @param IsInternal
 * @returns {object}
 */
function getQuotesList(cookie, sessionId, IsInternal) {
	var currentDate = new Date();
	var month = currentDate.getMonth() + 1;
	var day = currentDate.getDate();
	var year = currentDate.getFullYear();
	var createDateTo = month + "-" + day + "-" + year;

	// prev date - 30 days prior
	var prevDate = new Date();
	prevDate.setDate(prevDate.getDate() - 30);
	var prevmonth = prevDate.getMonth() + 1;
	var prevday = prevDate.getDate();
	var prevyear = prevDate.getFullYear();
	var createDateFrom = prevmonth + "-" + prevday + "-" + prevyear;

	var params = {
		"MyWorkOnlyFl" : !IsInternal,
		"CreateDateFrom" : createDateFrom,
		"CreateDateTo" : createDateTo
	};
	
	var searchInput = {
		method : 'put',
		body : {
			contentType : "application/json",
			content : params
		},
		headers : {
			"Cookie" : cookie,
			"R2oSessionId" : sessionId
		},
		path : 'api/requestsearch/search'
	};

	var searchResponse = WL.Server.invokeHttp(searchInput);
	
	if(searchResponse.responseHeaders!=undefined)
		searchResponse.cookie = searchResponse.responseHeaders['Set-Cookie'];
	else
		searchResponse.cookie = undefined;
	return {
		requests : searchResponse.Requests,
		cookie : searchResponse.cookie
	};
}

/**
 * function to get the quote Details for each Quote
 * @param cookie
 * @param sessionId
 * @param requestSk
 * @param getfilelist
 * @returns {object}
 */
function getQuotesDetails(cookie, sessionId, requestSk, getfilelist) {

	var quotesDetailResponse = initializeResponse();
	quotesDetailResponse.data = {};
	var quoteDetailInput = {
		method : 'get',
		headers : {
			"Cookie" : cookie,
			"R2oSessionId" : sessionId
		},
		path : 'api/request/' + requestSk + '/' + getfilelist
	};

	var quotesResponse = WL.Server.invokeHttp(quoteDetailInput);
	var requestTemplateParsers = [];
	requestTemplateParsers = getRequestTemplateParsers(cookie, sessionId);
	quotesDetailResponse.data.requestName = quotesResponse.RequestName;
	quotesDetailResponse.data.requestNumber = quotesResponse.RequestNumber;
	var contacts = quotesResponse.Contacts || [];
	quotesDetailResponse.data.enteredBy = null;
	var employees = quotesResponse.Employees || [];
	var partners = quotesResponse.Partners || [];
	quotesDetailResponse.data.products = [];
	quotesDetailResponse.data.status = quotesResponse.WorkflowStatus;
	quotesDetailResponse.data.createDate = quotesResponse.createDate;
	quotesDetailResponse.data.productNotes = quotesResponse.ProductNotes;
	quotesDetailResponse.data.requestNotes = quotesResponse.RequestNotes;
	quotesDetailResponse.data.requestName = quotesResponse.RequestName;
	quotesDetailResponse.data.entityFiles = quotesResponse.EntityFiles;
	//quotesDetailResponse.data.action = quotesResponse;
	quotesDetailResponse.data.contact = {};

	for (var i = 0; i < contacts.length; i++) {
		var contact = contacts[i];
		if (contact.PartnerRoleTypeCode == "SAPCRT") {
			quotesDetailResponse.data.enteredBy = {
				"firstName" : contact.FirstName,
				"lastName" : contact.LastName,
				"emailId" : contact.EmailAddress

			};

		}
		if (contact.PartnerRoleTypeCode == "SAPEUC") {
			quotesDetailResponse.data.contact = {
				"firstName" : contact.FirstName,
				"lastName" : contact.LastName,
				"emailId" : contact.EmailAddress

			};

		}
		
		if(contact.PartnerRoleTypeCode == "SAPSTO") {
			quotesDetailResponse.data.requestor = {
					"name" : contact.FirstName + " " + contact.LastName
			};
		}
	}
	
	if(quotesDetailResponse.data.contact == null || quotesDetailResponse.data.contact == undefined ||quotesDetailResponse.data.contact.firstName == null || quotesDetailResponse.data.contact.firstName == undefined || quotesDetailResponse.data.contact.firstName == ""){
		quotesDetailResponse.data.contact.firstName = "No contact specified";
	}
	
	if (quotesDetailResponse.data.enteredBy == null) {

		for (var i = 0; i < employees.length; i++) {
			var employee = employees[i];
			if (employee.PartnerRoleTypeCode == "AVTCRT") {
				quotesDetailResponse.data.enteredBy = {
					"firstName" : employee.FirstName,
					"lastName" : employee.LastName,
					"emailId" : employee.EmailAddress
				};
				break;
			}
		}
	}
	
	

	for (var i = 0; i < partners.length; i++) {
		var partner = partners[i];
		if (partner.PartnerRoleTypeCode == "SAPEUO") {
			quotesDetailResponse.data.partnerDetails = {
				"endUserAccountId" : partner.PartnerId,
				"endUser" : partner.PartnerName
			};
		}
		if (partner.PartnerRoleTypeCode == "SAPSTO") {
			quotesDetailResponse.data.varAccountID = partner.PartnerId;
			quotesDetailResponse.data.varAccount = partner.PartnerName;

		}
		if(quotesDetailResponse.data.requestor == null || quotesDetailResponse.data.requestor == undefined) {
			quotesDetailResponse.data.requestor = {
					"name" : partner.PartnerName
			};
		}
	}

	quotesDetailResponse.data.notes = [];

	if (quotesResponse.ProductNotes != null) {
		for (var i = 0; i < quotesResponse.ProductNotes.length; i++) {
			
			quotesDetailResponse.data.productNotes[i] = quotesResponse.ProductNotes[i];
			quotesDetailResponse.data.productNotes[i].CreateDate = formatDate(quotesResponse.ProductNotes[i].CreateDate);
			
			if(quotesResponse.ProductNotes[i].CreateUserName == null){
				quotesDetailResponse.data.productNotes[i].CreateUserName = quotesResponse.ProductNotes[i].CreateUserId;
				quotesDetailResponse.data.productNotes[i].isInternalUser = true;
			}else{
				if(validateEmail(quotesResponse.ProductNotes[i].CreateUserName)){
					quotesDetailResponse.data.productNotes[i].isInternalUser = false;
				}else{
					quotesDetailResponse.data.productNotes[i].isInternalUser = true;
				}
			}
			
			quotesDetailResponse.data.notes
					.push(quotesDetailResponse.data.productNotes[i]);
			//quotesDetailResponse.data.productNotes[i].type = "productNote";
		}

	} else {
		quotesDetailResponse.data.productNotes = null;
	}

	if (quotesResponse.RequestNotes != null) {

		for (var i = 0; i < quotesResponse.RequestNotes.length; i++) {
			//quotesDetailResponse.data.requestNotes[i].NoteText = quotesDetailResponse.data.requestNotes[i].NoteText.split("\n").join("<br>");
			quotesDetailResponse.data.requestNotes[i] = quotesResponse.RequestNotes[i];
			quotesDetailResponse.data.requestNotes[i].CreateDate = formatDate(quotesResponse.RequestNotes[i].CreateDate);
			
			if(quotesResponse.RequestNotes[i].CreateUserName == null){
				quotesDetailResponse.data.requestNotes[i].CreateUserName = quotesResponse.RequestNotes[i].CreateUserId;
				quotesDetailResponse.data.requestNotes[i].isInternalUser = true;
			}else{
				if(validateEmail(quotesResponse.RequestNotes[i].CreateUserName)){
					quotesDetailResponse.data.requestNotes[i].isInternalUser = false;
				}else{
					quotesDetailResponse.data.requestNotes[i].isInternalUser = true;
				}
			}
			
			quotesDetailResponse.data.notes
					.push(quotesDetailResponse.data.requestNotes[i]);
			//quotesDetailResponse.data.requestNotes[i].type = "requestNote";
		}
	} else {
		quotesDetailResponse.data.requestNotes = null;

	}
	
	//quote revised condition
	quotesDetailResponse.data.isRevised = false;
	if((quotesResponse.RequestActions || []).length > 1){
		for (var j=0; j< quotesResponse.RequestActions.length; j++) {
			var requestAction = quotesResponse.RequestActions[j];
			if(requestAction.ActionName == "Revise Quote" && requestAction.ActionGroup == "Revise") {
				quotesDetailResponse.data.isRevised = true;
			}
		}
	}
	

	if (quotesResponse.Quotes != null) {
		quotesDetailResponse.data.quotes = [];
		var action  = null;
		var productList = null;
		
		for (var i = 0; i < quotesResponse.Quotes.length; i++) {
			
			var productSkList = [];
			
			for (var j=0; j< quotesResponse.RequestActions.length; j++) {
				var requestAction = quotesResponse.RequestActions[j];
				if(requestAction.ActionSk == quotesResponse.Quotes[i].ActionSk) {
					action = requestAction.ActionName;
					productList = requestAction.ProductList; 
					//break;
				}
			}
			
			
			if(action == null && quotesResponse.ProductActions != null && quotesResponse.ProductActions.length > 0) {
				for (var j=0; j< quotesResponse.ProductActions.length; j++) {
					var productAction = quotesResponse.ProductActions[j];
					if(productAction.ActionSk == quotesResponse.Quotes[i].ActionSk) {
						action = productAction.ActionName;
						productList = productAction.ProductList;
						//break;
					}
				}
			}
			
			//if(quotesResponse.RequestSk != null && quotesResponse.RequestSk == "") {

				if(quotesResponse.ProductActions.length > 0){					
					for(var k=0; k<quotesResponse.ProductActions.length; k++) {
						
						if(quotesResponse.Quotes[i].ActionSk == quotesResponse.ProductActions[k].ActionSk) {
							//productSkList.push(quotesResponse.Products[k]);
							
							for(var s=0; s<quotesResponse.Products.length; s++) {
								if(quotesResponse.ProductActions[k].EntitySk == quotesResponse.Products[s].ProductSk){

									productSkList.push(quotesResponse.Products[s]);
								}
							}
							
						}
					}
				} else {
					
					for(var k=0; k<quotesResponse.RequestActions.length; k++) {
						
						if(quotesResponse.Quotes[i].ActionSk == quotesResponse.RequestActions[k].ActionSk) {
							//productSkList.push(quotesResponse.Products[k]);
							for(var s=0; s<quotesResponse.Products.length; s++) {
								if(quotesResponse.RequestActions[k].EntitySk == quotesResponse.Products[s].RequestSk){

									productSkList.push(quotesResponse.Products[s]);
								}
							}
							
						}
					}
				}
				
			//}
			
			quotesDetailResponse.data.quotes[i] = {
					"actionSk" : quotesResponse.Quotes[i].ActionSk,
					"action" : action,
					"quoteNumber" : quotesResponse.Quotes[i].QuoteNumber,
					"revisionDate" : formatDate(quotesResponse.Quotes[i].CreateDate),
					"expireDate" : quotesResponse.Quotes[i].ExpireDate,
					"revenue" : quotesResponse.Quotes[i].Revenue,
					"quoteRevisionNumber" : quotesResponse.Quotes[i].QuoteRevNumber,
					"productList" : productList,
					"customerViewActivated":quotesResponse.Quotes[i].CustomerViewActivated,
					"requestSk" : quotesResponse.Quotes[i].RequestSk,
					"productActions" : quotesResponse.ProductActions,
					"Products" : quotesResponse.Products,
					"productSkList" : productSkList,
					"requestAction" : quotesResponse.RequestActions,
					"description" : quotesResponse.Quotes[i].Description
				};
		}
	} else {
		quotesDetailResponse.data.quotes = [];
	}
	
	quotesDetailResponse.data.requestTemplateParser = requestTemplateParsers.LookupLists.RequestTemplateParsers;
	
	quotesDetailResponse.data.products = quotesResponse.Products || [];
	quotesDetailResponse.data.statusCode = quotesResponse.statusCode;
	quotesDetailResponse.data.message = quotesResponse.Message;
	quotesDetailResponse.data.IsRequestRevisable = quotesResponse.IsRequestRevisable;
	
	
	if (quotesDetailResponse.data.enteredBy == null) {
		if(quotesResponse.CreateUserId && quotesResponse.CreateUserId.indexOf('@') > -1) {
			for (var i = 0; i < contacts.length; i++) {
				var contact = contacts[i];
				if(contact.EmailAddress == quotesResponse.CreateUserId) {
					quotesDetailResponse.data.enteredBy = {
						"firstName" : contact.FirstName,
						"lastName" : contact.LastName,
						"emailId" : contact.EmailAddress

					};

				}
			}
        }else{
        	for (var i = 0; i < employees.length; i++) {
    			var employee = employees[i];
    			if (employee.EmployeeId == quotesResponse.CreateUserId) {
    				quotesDetailResponse.data.enteredBy = {
    					"firstName" : employee.FirstName,
    					"lastName" : employee.LastName,
    					"emailId" : employee.EmailAddress
    				};
    				break;
    			}
    		}
        }
	}
	
	if(quotesResponse.responseHeaders == undefined){
		quotesDetailResponse.cookie=undefined;
	}
	else{
		quotesDetailResponse.cookie = quotesResponse.responseHeaders['Set-Cookie'];
	}
	
	return quotesDetailResponse;
}


/**
 * function to get the lookup list
 * @param cookie
 * @param sessionId
 * @returns
 */
function getRequestTemplateParsers(cookie, sessionId) {
	var ReqTemplateLookUpListInput = {
	        method : 'put',
	        body : {
	            contentType : "application/json",
	            content : '["RequestTemplateParsers"]'
	        },
	        headers : {
				"Cookie" : cookie,
				"R2oSessionId" : sessionId
			},
	        path : 'api/lookuplist',
	    };

	    var lookUpListResp = WL.Server.invokeHttp(ReqTemplateLookUpListInput);
		return lookUpListResp;
	
}

/**
 * function to get the line items
 * @param cookie
 * @param sessionId
 * @param quoteNumber
 * @param quoteRevisionNumber
 * @returns {___anonymous14485_14499}
 */
function getLineItems(cookie, sessionId, quoteNumber, quoteRevisionNumber) {
	var lineItemReponse = initializeResponse();
	var quotesTabInput = {
			method : 'get',
			headers : {
				"Cookie" : cookie,
				"R2oSessionId" : sessionId
			},
			path : 'api/quote/lineitems/'+quoteNumber +'/'+quoteRevisionNumber
	};
	
	var quoteTabDetailRes = WL.Server.invokeHttp(quotesTabInput);
	lineItemReponse.lineItems = quoteTabDetailRes.QuoteLineItems;
	if(quoteTabDetailRes.responseHeaders == undefined){
		lineItemReponse.cookie=undefined;
	}
	else{
		lineItemReponse.cookie = quoteTabDetailRes.responseHeaders['Set-Cookie'];
	}
	return lineItemReponse;
}

/**
 * function to edit the request name
 * @param cookie
 * @param sessionId
 * @param requestSk
 * @param newRequestName
 * @returns {___anonymous15513_15534}
 */
function editRequestName(cookie, sessionId, requestSk, newRequestName) {
	var editRequestNameReponse = initializeResponse();
	
	var params = {
			"RequestSk" : requestSk,
			"RequestName" : newRequestName
		};
		
	var requestNameInput = {
			method : 'put',
			body : {
				contentType : "application/json",
				content : params
			},
			headers : {
				"Cookie" : cookie,
				"R2oSessionId" : sessionId
			},
			path : 'api/request/update'
	};
	
	var requestNameInputRes = WL.Server.invokeHttp(requestNameInput);
	//editRequestNameReponse.requestData = requestNameInputRes.QuoteLineItems;
	editRequestNameReponse.data = requestNameInputRes;
	editRequestNameReponse.cookie = requestNameInputRes.responseHeaders['Set-Cookie'];
	return editRequestNameReponse;
}

/**
 * function to add a note
 * @param cookie
 * @param sessionId
 * @param requestSk
 * @param noteValue
 * @param recipients
 * @param adHocRecipient
 * 
 */
function addNote(cookie, sessionId, requestSk, noteValue, recipients, adHocRecipients) {
	var addNoteResponse = initializeResponse();
	
	var params = {"Notes":
					[
					 {"EntityType":"",
						 "NoteSk":0,
						 "EntitySk":requestSk,
						 "NoteTypeSk":3,
						 "NoteText":noteValue,
						 "ActionSk":null,
						 "IsReportable":false,
						 "IsActive":false,
						 "IsDisplay":false,
						 "IsInternal":false,
						 "EntityTemplateName":"",
						 "EntityName":"",
						 "NoteType":"Task Note",
						 "CreateDate":null,
						 "UpdateDate":null,
						 "DeleteDate":null,
						 "CreateUserId":"",
						 "UpdateUserId":"",
						 "DeleteUserId":"",
						 "CreateUserName":""
						}
					 ],
					 "Notification":{
						 "adHocRecipients":adHocRecipients,
						 "ccRecipients":[],
						 "fileList":[],
						 "forceSend":"true",
						 "isNoteInternal":false,
						 "isNoteReportable":false,
						 "noteText":noteValue,
						 "recipients":recipients,
						 "requestSk":requestSk,
						 "shouldSend":false,
						 "subject":""
					 }
				};
		
	var addNoteInput = {
			method : 'post',
			body : {
				contentType : "application/json",
				content : params
			},
			headers : {
				"Cookie" : cookie,
				"R2oSessionId" : sessionId
			},
			path : 'api/note/create'
	};
	
	var httpResponse = WL.Server.invokeHttp(addNoteInput);
	//editRequestNameReponse.requestData = requestNameInputRes.QuoteLineItems;
	addNoteResponse.data = httpResponse;
	addNoteResponse.cookie = addNoteResponse.data.responseHeaders['Set-Cookie'];
	return addNoteResponse;
}

/**
 * Function to edit the user
 * @param cookie
 * @param sessionId
 * @param requestJSON
 * @param RequestSk
 */
function editEndUser(cookie, sessionId, requestJSON, requestSk){
	var endUserResponse = initializeResponse();
	var editEndUserInput = {
			method : 'put',
			body : {
				contentType : "application/json",
				content : requestJSON
			},
			headers : {
				"Cookie" : cookie,
				"R2oSessionId" : sessionId
			},
			path : 'api/partner/update/'+requestSk
	};
	endUserResponse.data = WL.Server.invokeHttp(editEndUserInput);
	endUserResponse.cookie = endUserResponse.data.responseHeaders['Set-Cookie'];
	return endUserResponse;
}

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

/**
 * function to validate the email
 * @param field
 * @returns
 */
function validateEmail(field) {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    return (regex.test(field)) ? true : false;
}

/**
 * function to format the date
 * @param date
 * @returns {String}
 */
function formatDate(date) {
	var newDate = date.split("T");

	var stringDate = newDate[0].split("-");
	var formattedDate = stringDate[1] + '/' + stringDate[2] + '/'
			+ stringDate[0].substr(2, 2);

	return formattedDate;
}