function login(){
	
	return {
		"data" : WL.Server.getActiveUser("HeaderAuthRealm") || "none",
		"data1" : WL.Server.getCurrentDeviceIdentity("HeaderAuthRealm")
	};
}

function logout(cookie, r2oSessionId) {
	var logoutResponse = initializeResponse();
	var input = {
			method : 'put',
			body : {
				contentType : "application/json",
				content : ""
		},
			headers: {
				"Cookie": cookie,
				"R2oSessionId" : r2oSessionId
				},
			path : 'pkmslogout'
	};

	var response = WL.Server.invokeHttp(input);
	//logoutResponse.isSuccessful = response.isSuccessful;
	//logoutResponse.message = response.html.body.font.b;
	
	return response;
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