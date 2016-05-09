
/**
 * function to prepare the sample request
 * @param request
 * @param adHocRecipients
 * @param ccRecipients
 * @returns {String}
 */
function getSampleRequest(request, adHocRecipients, ccRecipients){
	var sampleReqInput = '------WebKitFormBoundarySpdKInP2SDS5vQbI\n'+
	'Content-Disposition: form-data; name="Request"'+'\n\n'+
	JSON.stringify(request) +
	'\n'+'------WebKitFormBoundarySpdKInP2SDS5vQbI'+'\n'+
	'Content-Disposition: form-data; name="Notification"'+'\n\n'+

	'{"adHocRecipients":' +JSON.stringify(adHocRecipients)+',"ccRecipients":' +JSON.stringify(ccRecipients)+',"fileList":[],"forceSend":"true","isNoteInternal":false,"isNoteReportable":false,"noteText":"","recipients":[],"requestSk":0,"shouldSend":false,"subject":""}'+
	'\n'+'------WebKitFormBoundarySpdKInP2SDS5vQbI'+'\n'+
	'Content-Disposition: form-data; name="RequestFiles"'+'\n\n'+

	'[]'+'\n'+
	'------WebKitFormBoundarySpdKInP2SDS5vQbI--';
	
	return sampleReqInput;
}

/**
 *Function to submit the request
 *@param cookie
 *@param sessionId
 *@param request
 *@param adHocRecipients
 *@param ccRecipients
 *
 */
function submitRequest(cookie, sessionId, request, adHocRecipients, ccRecipients){
	
	if(request.Partners.length > 1){
		var partnerData =  getSalesOrgData(cookie, sessionId, request.Partners[1].PartnerId);
		request.Partners[1] = partnerData.Partner;
	}
	
	var newRequestInput = {
		method : 'post',
		body : {
			contentType : "multipart/form-data; boundary=----WebKitFormBoundarySpdKInP2SDS5vQbI",
			content : getSampleRequest(request, adHocRecipients, ccRecipients)
		},
		headers : {
			"Cookie" : cookie,
			"R2oSessionId" : sessionId,
			"Accept-Encoding" : "gzip, deflate, sdch",
			"Content-Type" : "multipart/form-data; boundary=----WebKitFormBoundarySpdKInP2SDS5vQbI",
			"Accept" : "application/json, text/plain, */*",
			"Accept-Language" : "en-US,en;q=0.8"
		},
		path : 'api/request/create',
	};
	
	var submitRequestResponse=WL.Server.invokeHttp(newRequestInput);
	submitRequestResponse.cookie = submitRequestResponse.responseHeaders['Set-Cookie'];

	return submitRequestResponse;
}

/**
 * function to get the product specific questions
 * @returns {___anonymous2151_30570}
 */
function getProductSpecificQuestions(){
	return {
		hashId : 3000,
		data : [/*{
					EntityTemplateName : "New ServiceElite",
					EntityTemplateSk : 21,
					productAttributes : {
	                    EntityType: 'ProductIBMService',
	                    ProductSk: 0,
	                    IsAA: false,
	                    IsAlert: false,
	                    IsAS: false,
	                    IsASAlert: false,
	                    IsContractTerm12Months: false,
	                    IsContractTerm24Months: false,
	                    IsContractTerm36Months: false,
	                    IsContractTerm48Months: false,
	                    IsContractTerm60Months: false,
	                    IsContractTermOddTerm: false,
	                    IsContractTermReoccuring: false,
	                    ContractRecurrence: null,
	                    IsCTechSupport: false,
	                    IsCTS: false,
	                    IsETS: false,
	                    IsHardware: false,
	                    IsHardware24x7: false,
	                    IsHardware9x5: false,
	                    IsHDR: false,
	                    IsHWMA: false,
	                    IsMachineTypeNew: false,
	                    IsMachineTypeUsed: false,
	                    IsMS: false,
	                    IsOPD: false,
	                    IsQuote: false,
	                    IsQuoteContract: false,
	                    IsQuoteForAttachedHDWConfigFile: false,
	                    IsQuoteForAttachedList: false,
	                    IsQuoteForAvnetHDWCurrentR2O: false,
	                    IsQuoteForAvnetHDWPreviousR2O: false,
	                    IsQuoteForMachineDetail: false,
	                    IsSL: false,
	                    IsSoftware: false,
	                    IsSoftware24x7: false,
	                    IsSoftware9x5: false,
	                    IsSSSE: false,
	                    IsSWMA: false,
	                    IsWSU: false,
	                    HWGroup: '0d738300-895d-41e0-9ec7-bdced42a607d',
	                    MachineGroup: '0e12de92-491a-41aa-9da3-370f2e22dd1e',
	                    ResponseGroup: '0a8609de-8a24-470e-b379-cd257aff0a74',
	                    SWGroup: 'f4c51023-bb29-4067-8bb2-f2d804145932',
	                    TermGroup: '79c0dd6a-20e8-425b-bc98-8d148e2b1bab',
	                    AlertCumulativeLevel: null,
	                    AlertQuantityRequired: null,
	                    AlertVersionRel: null,
	                    ContractOddTerm: null,
	                    EquipmentInstallDate: null,
	                    RequestContractEffectiveDate : null,
	                    SolutionSummary: null
	                },
					questions : [{
									title : "Offerings",
									max : 1,
									message : "Select One Option",
									questionType : "multiSelect",
									isMandatory : false,
									answer : [],
									options : [{
												"option" : "HWMA",
												"attributeProperty" : "IsHWMA"
											},
											{
												"option" : "SWMA",
												"attributeProperty" : "IsSWMA"
											},
											{
												"option" : "WSU",
												"attributeProperty" : "IsWSU"
											},
											{
												"option" : "Advanced Services",
												"attributeProperty" : "IsAS"
											}]
								},
								{
									title : "Required Response",
									max : 1,
									message : "Select One Option",
									questionType : "radio",
									isMandatory : false,
									answer : [],
									options : [{
												"option" : "Quote",
												"attributeProperty" : "IsQuote"
											},
											{
												"option" : "Quote w/Contract",
												"attributeProperty" : "IsIsQuoteContractAS"
											}]
								},
								{
									title : "Machine Type",
									max : 1,
									message : "Select One Option",
									questionType : "radio",
									isMandatory : false,
									answer : [],
									options : [{
												"option" : "New",
												"attributeProperty" : "IsMachineTypeNew"
											},
											{
												"option" : "Used",
												"attributeProperty" : "IsMachineTypeUsed"
											}]
								},
								{
									title : "Request Contract Effective Date",
									questionType : "date",
									isMandatory : false,
									answer : "",
									"attributeProperty" : "RequestContractEffectiveDate"
								},
								{
									title : "Equipment Install Date",
									questionType : "date",
									isMandatory : false,
									answer : "",
									"attributeProperty" : "EquipmentInstallDate"
								},
								{
									title : "Quote Options",
									message : "Select One or Two Quote Options",
									max : 2,
									questionType : "multiSelect",
									isMandatory : false,
									answer : [],
									options : [{
													"option" : "Quote for Avnet HDW/SD on this R2O request",
													"attributeProperty" : "IsQuoteForAvnetHDWCurrentR2O"
												},
												{
													"option" : "Quote for Avnet HDW/SD on previous R2O request",
													"attributeProperty" : "IsQuoteForAvnetHDWPreviousR2O"
												},
												{
													"option" : "Quote for attached list of machines/SN#s with install dates(Attach list using files tab)",
													"attributeProperty" : "IsQuoteForAttachedList"
												},
												{
													"option" : "Quote for machine detail provided in detail tab",
													"attributeProperty" : "IsQuoteForMachineDetail"
												},
												{
													"option" : "Quote for attached HDW/SD configuration file(Attach list using files tab)",
													"attributeProperty" : "IsQuoteForAttachedHDWConfigFile"
												}]
								},
								{
									title : "Desired Contract Terms",
									questionType : "multiSelect",
									message : "select at Least One Option",
									max : 7,
									isMandatory : false,
									answer : [],
									options : [{
													"option" : "1 Year",
													"attributeProperty" : "IsContractTerm12Months"
												},
												{
													"option" : "2 Year",
													"attributeProperty" : "IsContractTerm24Months"
												},
												{
													"option" : "3 Year",
													"attributeProperty" : "IsContractTerm36Months"
												},
												{
													"option" : "4 Year",
													"attributeProperty" : "IsContractTerm48Months"
												},
												{
													"option" : "5 Year",
													"attributeProperty" : "IsContractTerm60MonthsAS"
												},
												{
													"option" : "Odd Year",
													"attributeProperty" : "IsContractTermOddTerm"
												},
												{
													"option" : "Reoccuring",
													"attributeProperty" : "IsContractTermReoccuring"
												}]
								}]
				},*/
				{
					EntityTemplateName : "IBM Renewal",
					EntityTemplateSk : 22,
					productAttributes : {
	                    EntityType: 'ProductIBMRenewal',
	                    ProductSk: 0,
	                    IsAA: false,
	                    IsAlert: false,
	                    IsAS: false,
	                    IsASAlert: false,
	                    IsChange: false,
	                    IsContractTerm12Months: false,
	                    IsContractTerm24Months: false,
	                    IsContractTerm36Months: false,
	                    IsContractTerm48Months: false,
	                    IsContractTerm60Months: false,
	                    IsContractTermOddTerm: false,
	                    IsContractTermReoccuring: false,
	                    ContractRecurrence: null,
	                    IsCTechSupport: false,
	                    IsCTS: false,
	                    IsETS: false,
	                    IsHardware: false,
	                    IsHardware24x7: false,
	                    IsHardware9x5: false,
	                    IsHDR: false,
	                    IsHWMA: false,
	                    IsMS: false,
	                    IsNoChange: false,
	                    IsOPD: false,
	                    IsSL: false,
	                    IsSoftware: false,
	                    IsSoftware24x7: false,
	                    IsSoftware9x5: false,
	                    IsSSSE: false,
	                    IsSWMA: false,
	                    HWGroup: '94dd6cdd-68da-4d1d-8b2d-49f7353452ce',
	                    RenewalGroup: '715caeb8-c87e-4f8a-9476-68885f9a8e50',
	                    SWGroup: '42e2bd32-b5fd-4fab-9816-9d6f31a22436',
	                    TermGroup: 'd9b722fa-4cf0-42f3-a088-801b1da23cc0',
	                    AlertCumulativeLevel: null,
	                    AlertQuantityRequired: null,
	                    AlertVersionRel: null,
	                    ContractNumber: null,
	                    ContractOddTerm: null,
	                    SolutionNumber: null
	                },
					questions : [{
									title : "Offerings",
									questionType : "multiSelect",
									message : "Select One Option",
									max : 1,
									isMandatory : true,
									answer : [],
									options : [{
												"option" : "HWMA",
												"attributeProperty" : "IsHWMA"
											},
											{
												"option" : "SWMA",
												"attributeProperty" : "IsSWMA"
											},
											{
												"option" : "Advanced Services",
												"attributeProperty" : "IsAS"
											}]
								},
								{
									title : "Renewal Type",
									questionType : "radio",
									message : "Select One Option",
									max : 1,
									isMandatory : true,
									answer : [{
												"option" : "No Change",
												"attributeProperty" : "IsNoChange"
											}],
									options : [{
												"option" : "Change",
												"attributeProperty" : "IsChange"
											},
											{
												"option" : "No Change",
												"attributeProperty" : "IsNoChange"
											}]
								},
								{
									title : "Existing Contract Number",
									questionType : "text",
									isMandatory : true,
									answer : "",
									"attributeProperty" : "ContractNumber"
								}/*,
								{
									title : "Request Contract Effective Date",
									questionType : "date",
									isMandatory : true,
									answer : "",
									"attributeProperty" : "RequestContractEffectiveDate"
								},
								{
									title : "Desired Contract Terms",
									questionType : "multiSelect",
									message : "Select at Least One Option",
									max : 7,
									isMandatory : true,
									answer : [],
									options : [{
													"option" : "1 Year",
													"attributeProperty" : "IsContractTerm12Months"
												},
												{
													"option" : "2 Year",
													"attributeProperty" : "IsContractTerm24Months"
												},
												{
													"option" : "3 Year",
													"attributeProperty" : "IsContractTerm36Months"
												},
												{
													"option" : "4 Year",
													"attributeProperty" : "IsContractTerm48Months"
												},
												{
													"option" : "5 Year",
													"attributeProperty" : "IsContractTerm60Months"
												},
												{
													"option" : "Odd Term",
													"attributeProperty" : "IsContractTermOddTerm"
												},
												{
													"option" : "Reoccuring",
													"attributeProperty" : "IsContractTermReoccuring"
												}]
								}*//*,
								{
									title : "Solution Summary ID Nunber",
									questionType : "text",
									isMandatory : false,
									answer : "",
									"attributeProperty" : "SolutionNumber"
								}*/]
				},
				{
					EntityTemplateName : "IBM MES",
					EntityTemplateSk : 23,
					productAttributes : {
	                    EntityType: 'ProductIBMServiceAddOn',
	                    ProductSk: 0,
	                    IsAA: false,
	                    IsAlert: false,
	                    IsAS: false,
	                    IsASAlert: false,
	                    IsContractTerm12Months: false,
	                    IsContractTerm24Months: false,
	                    IsContractTerm36Months: false,
	                    IsContractTerm48Months: false,
	                    IsContractTerm60Months: false,
	                    IsContractTermOddTerm: false,
	                    ContractRecurrence: null,
	                    IsCTechSupport: false,
	                    IsCTS: false,
	                    IsETS: false,
	                    IsHardware: false,
	                    IsHardware24x7: false,
	                    IsHardware9x5: false,
	                    IsHDR: false,
	                    IsHWMA: false,
	                    IsMachineTypeNew: false,
	                    IsMachineTypeUsed: false,
	                    IsMS: false,
	                    IsOPD: false,
	                    IsQuoteForAttachedHDWConfigFile: false,
	                    IsQuoteForAttachedList: false,
	                    IsQuoteForAvnetHDWCurrentR2O: false,
	                    IsQuoteForAvnetHDWPreviousR2O: false,
	                    IsQuoteForMachineDetail: false,
	                    IsSL: false,
	                    IsSoftware: false,
	                    IsSoftware24x7: false,
	                    IsSoftware9x5: false,
	                    IsSSSE: false,
	                    IsSWMA: false,
	                    IsWSU: false,
	                    ContractTermGroup: 'e631413c-7410-4241-85f5-14a8ff3d0d24',
	                    HWGroup: '9f791b0b-3439-4dad-b7cb-a933d03b608b',
	                    MachineTypeGroup: '3722d4e6-b51f-419d-ab25-1a846bb68287',
	                    SWGroup: 'f46125b8-c188-4eab-89be-ebea00af0784',
	                    AlertCumulativeLevel: null,
	                    AlertQuantityRequired: null,
	                    AlertVersionRel: null,
	                    ContractNumber: null,
	                    ContractOddTerm: null,
	                    RequestContractEffectiveDate : null,
	                    SolutionNumber: null
	                },
					questions : [{
									title : "Offerings",
									questionType : "multiSelect",
									message : "Select One Option",
									max : 1,
									isMandatory : true,
									answer : [],
									options : [{
												"option" : "HWMA",
												"attributeProperty" : "IsHWMA"
											},
											{
												"option" : "SWMA",
												"attributeProperty" : "IsSWMA"
											},
											{
												"option" : "WSU",
												"attributeProperty" : "IsWSU"
											},
											{
												"option" : "Advanced Services",
												"attributeProperty" : "IsAS"
											}]
								},
								{
									title : "Machine Type",
									questionType : "radio",
									message : "Select One Option",
									max : 1,
									isMandatory : true,
									answer : [{
												"option" : "Used",
												"attributeProperty" : "IsMachineTypeUsed"
											}],
									options : [{
												"option" : "New",
												"attributeProperty" : "IsMachineTypeNew"
											},
											{
												"option" : "Used",
												"attributeProperty" : "IsMachineTypeUsed"
											}]
								},
								{
									title : "Existing Contract Number",
									questionType : "text",
									isMandatory : true,
									answer : "",
									"attributeProperty" : "ContractNumber"
								},
								{
									title : "Request Contract Effective Date",
									questionType : "date",
									isMandatory : true,
									answer : "",
									"attributeProperty" : "RequestContractEffectiveDate"
								},
								{
									title : "Quote Options",
									message : "Select One or Two Quote Options",
									max : 2,
									questionType : "multiSelect",
									isMandatory : true,
									answer : [],
									options : [{
													"option" : "Quote for Avnet HDW/SD on this R2O request",
													"attributeProperty" : "IsQuoteForAvnetHDWCurrentR2O"
												},
												{
													"option" : "Quote for Avnet HDW/SD on previous R2O request",
													"attributeProperty" : "IsQuoteForAvnetHDWPreviousR2O"
												},
												{
													"option" : "Quote for attached list of machines/SN#s with install dates(Attach list using files tab)",
													"attributeProperty" : "IsQuoteForAttachedList"
												},
												{
													"option" : "Quote for machine detail provided in detail tab",
													"attributeProperty" : "IsQuoteForMachineDetail"
												},
												{
													"option" : "Quote for attached HDW/SD configuration file(Attach list using files tab)",
													"attributeProperty" : "IsQuoteForAttachedHDWConfigFile"
												}]
								},
								{
									title : "Desired Contract Terms",
									questionType : "multiSelect",
									message : "Select at Least One Option",
									max : 7,
									isMandatory : true,
									answer : [],
									options : [{
													"option" : "1 Year",
													"attributeProperty" : "IsContractTerm12Months"
												},
												{
													"option" : "2 Year",
													"attributeProperty" : "IsContractTerm24Months"
												},
												{
													"option" : "3 Year",
													"attributeProperty" : "IsContractTerm36Months"
												},
												{
													"option" : "4 Year",
													"attributeProperty" : "IsContractTerm48Months"
												},
												{
													"option" : "5 Year",
													"attributeProperty" : "IsContractTerm60Months"
												},
												{
													"option" : "Odd Term",
													"attributeProperty" : "IsContractTermOddTerm"
												},
												{
													"option" : "Reoccuring",
													"attributeProperty" : "IsContractTermReoccuring"
												}]
								}/*,
								{
									title : "Solution Summary ID Nunber",
									questionType : "text",
									isMandatory : false,
									answer : "",
									"attributeProperty" : "SolutionNumber"
								}*/]
				},
				{
					EntityTemplateName : "IBM Add-On",
					EntityTemplateSk : 24,
					productAttributes : {
	                    EntityType: 'ProductIBMServiceAddOn',
	                    ProductSk: 0,
	                    IsAA: false,
	                    IsAlert: false,
	                    IsAS: false,
	                    IsASAlert: false,
	                    IsContractTerm12Months: false,
	                    IsContractTerm24Months: false,
	                    IsContractTerm36Months: false,
	                    IsContractTerm48Months: false,
	                    IsContractTerm60Months: false,
	                    IsContractTermOddTerm: false,
	                    ContractRecurrence: null,
	                    IsCTechSupport: false,
	                    IsCTS: false,
	                    IsETS: false,
	                    IsHardware: false,
	                    IsHardware24x7: false,
	                    IsHardware9x5: false,
	                    IsHDR: false,
	                    IsHWMA: false,
	                    IsMachineTypeNew: false,
	                    IsMachineTypeUsed: false,
	                    IsMS: false,
	                    IsOPD: false,
	                    IsQuoteForAttachedHDWConfigFile: false,
	                    IsQuoteForAttachedList: false,
	                    IsQuoteForAvnetHDWCurrentR2O: false,
	                    IsQuoteForAvnetHDWPreviousR2O: false,
	                    IsQuoteForMachineDetail: false,
	                    IsSL: false,
	                    IsSoftware: false,
	                    IsSoftware24x7: false,
	                    IsSoftware9x5: false,
	                    IsSSSE: false,
	                    IsSWMA: false,
	                    IsWSU: false,
	                    ContractTermGroup: 'e631413c-7410-4241-85f5-14a8ff3d0d24',
	                    HWGroup: '9f791b0b-3439-4dad-b7cb-a933d03b608b',
	                    MachineTypeGroup: '3722d4e6-b51f-419d-ab25-1a846bb68287',
	                    SWGroup: 'f46125b8-c188-4eab-89be-ebea00af0784',
	                    AlertCumulativeLevel: null,
	                    AlertQuantityRequired: null,
	                    AlertVersionRel: null,
	                    ContractNumber: null,
	                    ContractOddTerm: null,
	                    RequestContractEffectiveDate : null,
	                    SolutionNumber: null
	                },
					questions : [{
						title : "Offerings",
						questionType : "multiSelect",
						message : "Select One Option",
						max : 1,
						isMandatory : true,
						answer : [],
						options : [{
									"option" : "HWMA",
									"attributeProperty" : "IsHWMA"
								},
								{
									"option" : "SWMA",
									"attributeProperty" : "IsSWMA"
								},
								{
									"option" : "WSU",
									"attributeProperty" : "IsWSU"
								},
								{
									"option" : "Advanced Services",
									"attributeProperty" : "IsAS"
								}]
					},
					{
						title : "Machine Type",
						questionType : "radio",
						message : "Select One Option",
						max : 1,
						isMandatory : true,
						answer : [],
						options : [{
									"option" : "New",
									"attributeProperty" : "IsMachineTypeNew"
								},
								{
									"option" : "Used",
									"attributeProperty" : "IsMachineTypeUsed"
								}]
					},
					{
						title : "Existing Contract Number",
						questionType : "text",
						isMandatory : true,
						answer : "",
						"attributeProperty" : "ContractNumber"
					},
					{
						title : "Request Contract Effective Date",
						questionType : "date",
						isMandatory : true,
						answer : "",
						"attributeProperty" : "RequestContractEffectiveDate"
					},
					{
						title : "Quote Options",
						message : "Select One or Two Quote Options",
						max : 2,
						questionType : "multiSelect",
						isMandatory : true,
						answer : [],
						options : [{
										"option" : "Quote for Avnet HDW/SD on this R2O request",
										"attributeProperty" : "IsQuoteForAvnetHDWCurrentR2O"
									},
									{
										"option" : "Quote for Avnet HDW/SD on previous R2O request",
										"attributeProperty" : "IsQuoteForAvnetHDWPreviousR2O"
									},
									{
										"option" : "Quote for attached list of machines/SN#s with install dates(Attach list using files tab)",
										"attributeProperty" : "IsQuoteForAttachedList"
									},
									{
										"option" : "Quote for machine detail provided in detail tab",
										"attributeProperty" : "IsQuoteForMachineDetail"
									},
									{
										"option" : "Quote for attached HDW/SD configuration file(Attach list using files tab)",
										"attributeProperty" : "IsQuoteForAttachedHDWConfigFile"
									}]
					},
					{
						title : "Desired Contract Terms",
						questionType : "multiSelect",
						message : "Select at Least One Option",
						max : 7,
						isMandatory : true,
						answer : [],
						options : [{
										"option" : "1 Year",
										"attributeProperty" : "IsContractTerm12Months"
									},
									{
										"option" : "2 Year",
										"attributeProperty" : "IsContractTerm24Months"
									},
									{
										"option" : "3 Year",
										"attributeProperty" : "IsContractTerm36Months"
									},
									{
										"option" : "4 Year",
										"attributeProperty" : "IsContractTerm48Months"
									},
									{
										"option" : "5 Year",
										"attributeProperty" : "IsContractTerm60Months"
									},
									{
										"option" : "Odd Term",
										"attributeProperty" : "IsContractTermOddTerm"
									},
									{
										"option" : "Reoccuring",
										"attributeProperty" : "IsContractTermReoccuring"
									}]
					}/*,
					{
						title : "Solution Summary ID Nunber",
						questionType : "text",
						isMandatory : false,
						answer : "",
						"attributeProperty" : "SolutionNumber"
					}*/]
				},
				{
					EntityTemplateName : "IBM Cancellation/Estimated Credit",
					EntityTemplateSk : 26,
					productAttributes : {
	                    EntityType: 'ProductIBMCancellation',
	                    ProductSk: 0,
	                    MachineGroup: '3a1e4a56-44c1-4ad3-9db9-3ab9be2f36a2',
	                    RequestContractEffectiveDate : null,
	                    ContractNumber: null,
	                    IsFiles: false,
	                    IsNotes: false
	                },
					questions : [{
									title : "Existing Contract #",
									questionType : "text",
									isMandatory : true,
									answer : "",
									"attributeProperty" : "ContractNumber"
								}/*,
								{
									title : "Cancellation Effective Date",
									questionType : "date",
									isMandatory : false,
									answer : "",
									"attributeProperty" : "RequestContractEffectiveDate"
								},
								{
									title : "Machine Type / Modal Information",
									questionType : "radio",
									message : "select one option",
									max : 1,
									isMandatory : false,
									answer : [],
									options : [{
												"option" : "Included In Notes",
												"attributeProperty" : "IsNotes"
											},
											{
												"option" : "Included In Attachment",
												"attributeProperty" : "IsFiles"
											}]
								}*/]
				},
				{
					EntityTemplateName : "HP Add on Services",
					EntityTemplateSk : 45,
					productAttributes : HP_PRODUCT_ATTRIBUTES,
					questions : HP_PRODUCT_SPECIFIC_QUESTIONS
				},
				{
					EntityTemplateName : "HP New Service Contract",
					EntityTemplateSk : 46,
					productAttributes : HP_PRODUCT_ATTRIBUTES,
					questions : HP_PRODUCT_SPECIFIC_QUESTIONS
				},
				{
					EntityTemplateName : "HP Renewal",
					EntityTemplateSk : 47,
					productAttributes : HP_PRODUCT_ATTRIBUTES,
					questions : HP_PRODUCT_SPECIFIC_QUESTIONS
				}/*,
				{
					EntityTemplateName : "IBM Managed Services (LBS)",
					EntityTemplateSk : 69,
					productAttribute : {
	                    EntityType: 'ProductIBMManagedService',
	                    ProductSk: 0,
	                    IsIS: false,
	                    IsMS: false,
	                    IsERMI: false,
	                    IsTivoli: false,
	                    IsMobility: false,
	                    IsSL: false,
	                    IsSA: false,
	                    IsStorage: false,
	                    IsNovus: false,
	                    IsBCS: false,
	                    IsSFS: false,
	                    IsRelocation: false,
	                    IsCabling: false,
	                    IsFAD: false,
	                    IsEM: false,
	                    IsCS: false,
	                    IsMRS: false,
	                    IsSR: false,
	                    IsMBC: false,
	                    IsRDP: false,
	                    IsFO: false,
	                    IsDPA: false,
	                    IsEME: false,
	                    IsSBC: false,
	                    IsSBD: false,
	                    Is1Yr: false,
	                    Is2Yr: false,
	                    Is3Yr: false,
	                    RDPYearGroup: '467fdcd0-7b32-4998-b474-ca5f83af00af'
	                },
					questions : [{
									title : "IBM Managed Services",
									questionType : "multiSelect",
									message : "Select at Least One Option",
									max : 9,
									isMandatory : false,
									answer : [],
									options : [{
												"option" : "Implementation Services",
												"attributeProperty" : "IsIS"
											},
											{
												"option" : "Migration Services",
												"attributeProperty" : "IsMS"
											},
											{
												"option" : "Express Remote Managed Infrastructure",
												"attributeProperty" : "IsERMI"
											},
											{
												"option" : "IBM Tivoli Live",
												"attributeProperty" : "IsTivoli"
											},
											{
												"option" : "Data Mobility Services",
												"attributeProperty" : "IsMobility"
											},
											{
												"option" : "Storage Optimization",
												"attributeProperty" : "IsStorage"
											},
											{
												"option" : "Business Community & Resiliency Services",
												"attributeProperty" : "IsBCS"
											},
											{
												"option" : "Site & Facilities Services",
												"attributeProperty" : "IsSFS"
											},
											{
												"option" : "IBM Cloud Services",
												"attributeProperty" : "IsCS"
											}]
								}]
				}*/]
	};
}

var HP_PRODUCT_SPECIFIC_QUESTIONS = [
	/*{
		title : "Contract Effective Date",
		questionType : "date",
		isMandatory : false,
		answer : "",
		"attributeProperty" : "ContractEffectiveDate"
	},*/
	{
		title : "Current Contract?",
		questionType : "radio",
		message : "Select One Option",
		max : 1,
		isMandatory : true,
		answer : false,
		options : [{
					"option" : "No",
					"attributeProperty" : "CurrentContractNo"
				},
				{
					"option" : "Yes",
					"attributeProperty" : "CurrentContractYes"
				}]
	},
	{
		title : "Term Length",
		questionType : "radio",
		message : "Select One Option",
		max : 1,
		isMandatory : true,
		answer : [],
		options : [{
					"option" : "1 Year",
					"attributeProperty" : "SelectedTerm1Yr"
				},
				{
					"option" : "2 Year",
					"attributeProperty" : "SelectedTerm2Yr"
				},
				{
					"option" : "3 Year",
					"attributeProperty" : "SelectedTerm3Yr"
				}]
	},
	/*
	{
		title : "Is This Channel or HP Direct",
		questionType : "radio",
		message : "Select One Option",
		max : 1,
		isMandatory : false,
		answer : [],
		options : [{
					"option" : "Channel",
					"attributeProperty" : "Channel"
				},
				{
					"option" : "HP Direct",
					"attributeProperty" : "HPDirect"
				}]
	}*/
	{
		title : "Support Type",
		message : "Select Up to 2 Options",
		max : 2,
		questionType : "multiSelect",
		isMandatory : true,
		answer : [],
		options : [{
					"option" : "HP Critical Service",
					"attributeProperty" : "IsHA112ACCritical"
				},{
					"option" : "HP Education Service",
					"attributeProperty" : "IsHA119AC"
				},{
					"option" : "HP Foundation Care NBD",
					"attributeProperty" : "IsH7J32AC"
				},{
					"option" : "HP Foundation Care NBD w DMR",
					"attributeProperty" : "IsH7J33AC"
				},{
					"option" : "HP Foundation Care 24x7",
					"attributeProperty" : "IsH7J34AC"
				},{
					"option" : "HP Foundation Care 24x7 w DMR",
					"attributeProperty" : "IsH7J35AC"
				},{
					"option" : "HP Foundation Care CTR",
					"attributeProperty" : "IsH7J36AC"
				},{
					"option" : "HP Foundation Care CTR w DMR",
					"attributeProperty" : "IsH7J37AC"
				},{
					"option" : "HP Hardware Replacement Support",
					"attributeProperty" : "IsHA360AC"
				},{
					"option" : "HP Hardware Maintenance Offsite",
					"attributeProperty" : "IsHA152AC"
				},{
					"option" : "HP Hardware Maintenance Onsite",
					"attributeProperty" : "IsHA151AC"
				},{
					"option" : "HP Prior SW Version with Sust Eng Support",
					"attributeProperty" : "IsHJ903AC"
				},{
					"option" : "HP Prior SW Version without Sust Eng Support",
					"attributeProperty" : "IsHJ904AC"
				},{
					"option" : "HP Mission Critical Partnership",
					"attributeProperty" : "IsHA120CC"
				},{
					"option" : "HP Proactive 24 Service",
					"attributeProperty" : "IsHA111AC"
				},{
					"option" : "HP Proactive Essentials",
					"attributeProperty" : "IsHA112ACProactive"
				},{
					"option" : "HP Proactive Essentials - HW/SW package",
					"attributeProperty" : "IsHA121AC"
				},{
					"option" : "HP Proactive Essentials Incident SVC",
					"attributeProperty" : "IsHA327AC"
				},{
					"option" : "HP Proactive Essentials Unlimited SVC",
					"attributeProperty" : "IsHA326AC"
				},{
					"option" : "HP Software Technical Incident-Based Support",
					"attributeProperty" : "IsHA159AC"
				},{
					"option" : "HP Software Technical Unlimited Support",
					"attributeProperty" : "IsHA158AC"
				},{
					"option" : "HP Software Updates Support",
					"attributeProperty" : "IsHA156AC"
				},{
					"option" : "HP SW Enterprise Basic Support",
					"attributeProperty" : "IsHM611AC"
				},{
					"option" : "HP SW Enterprise Standard Support",
					"attributeProperty" : "IsHM610AC"
				},{
					"option" : "HP User Advisory Incident Support",
					"attributeProperty" : "IsHA180AC"
				},{
					"option" : "HP User Advisory Unlimited Support",
					"attributeProperty" : "IsHA163AC"
				}]
	}
];

var HP_PRODUCT_ATTRIBUTES = {
        EntityType: 'ProductHPService',
        ProductSk: 0,
        ModeNumber1: null,
        ModeNumber2: null,
        ModeNumber3: null,
        SerialNumber1: null,
        SerialNumber2: null,
        SerialNumber3: null,
        SelectedTerm1Yr: false,
        SelectedTerm2Yr: false,
        SelectedTerm3Yr: false,
        CurrentContractYes: false,
        CurrentContractNo: false,
        ChannelHPDirect: false,
        SAIdNumber: null,
        ModelSerial: false,
        ContractEffectiveDate: null,
        IsHA101AC: false,
        IsHA103AC: false,
        IsHA104AC: false,
        IsHA105AC: false,
        IsHA106AC: false,
        IsHA107AC: false,
        IsHA108AC: false,
        IsHA109AC: false,
        IsHA110AC: false,
        IsHA111AC: false,
        IsHA112ACCritical: false,
        IsHA112ACProactive: false,
        IsHA116AC: false,
        IsHA117AC: false,
        IsHA118AC: false,
        IsHA119AC: false,
        IsHA120A: false,
        IsHA120AC: false,
        IsHA121AC: false,
        SelectedTermGroupID: 'e879e52b-e6dc-4aca-b533-e3530f9a3159',
        CurrentContractGroupID: 'c8a0c074-5290-49d9-98e8-73a0d13d7f3a',
        ChannelDirectGroupID: 'dce72914-df39-4d45-b2ac-c86562a35ce8',
        ModelSerialGroupID: 'cae2bd25-3ca1-4a7e-89d8-fd96c7a9439e'
    };

/**
 * function to get the recent users
 * @param cookie
 * @param sessionId
 * @param emailAddress
 * @param isInternal
 * @returns {___anonymous36427_36434}
 */
function getRecentUsers(cookie, sessionId, emailAddress, isInternal) {

	if(emailAddress == undefined || emailAddress == null){
		//emailAddress = "paulc@americandigital.com";
	}
	var newRequestInput = {
		method : 'get',
		headers : {
			"Cookie" : cookie,
			"R2oSessionId" : sessionId
		},
		path : 'api/request/new/'+emailAddress,
	};

	var newReqResponse = WL.Server.invokeHttp(newRequestInput);
	var response = initializeResponse();
	response.data = newReqResponse;
	response.data.LookupLists = [];
	
	var lookUpLists = (getAllProducts(cookie, sessionId).LookupLists || {}).EntityTemplates || [];
	
	for(var i=0; i < lookUpLists.length; i++){
		if(isInternal == "true"){
			if(!lookUpLists[i].IsPrimaryTemplate && lookUpLists[i].IsUserDisplay){
				response.data.LookupLists.push(lookUpLists[i]);
			}
		}else{
			if(!lookUpLists[i].IsPrimaryTemplate && lookUpLists[i].IsExternalDisplay && lookUpLists[i].IsUserDisplay){
				response.data.LookupLists.push(lookUpLists[i]);
			}
		}
	}
	
	if(isInternal == "false"){
		var recentProducts = [];
		for(var i=0; i < response.data.RecentProducts.length; i++){
			var temp = response.data.LookupLists.filter(function(e){return e.EntityTemplateSk==response.data.RecentProducts[i].EntityTemplateSk;});
			if(temp.length != 0)
				recentProducts.push(response.data.RecentProducts[i]);
		}
		response.data.RecentProducts = recentProducts;
	}
	
	response.cookie = newReqResponse.responseHeaders['Set-Cookie'];
	return response;

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
 * function to get all users
 * @param cookie
 * @param r2oSessionId
 * @param searchTerm
 * @param partnerId
 * @returns {___anonymous38832_38847}
 */
function getAllUsers(cookie, r2oSessionId, searchTerm, partnerId) {
	var allusersResponse = initializeResponse();
	var sampleReqInput = {

		"PartnerRoleTypeCode" : "SAPEUO",
		"AddressLine1" : "",
		"CityName" : "",
		"StateProvinceCode" : null,
		"PostalCode" : "",
		"CountryCode" : "",
		"SiteId" : "",
		"PartnerName" : searchTerm,
		"PartnerId" : "",
		"RelatedPartnerId" : partnerId
	};
	
	var newRequestInput = {
		method : 'put',
		body : {
			contentType : "application/json",
			content : sampleReqInput
		},
		headers : {
			"Cookie" : cookie,
			"R2oSessionId" : r2oSessionId
		},
		path : 'api/partner/search',
	};

	var newReqResponse = WL.Server.invokeHttp(newRequestInput);
	allusersResponse.data = newReqResponse;
	allusersResponse.cookie = newReqResponse.responseHeaders['Set-Cookie'];
	return allusersResponse;

}

/**
 * function to get the sales org data
 * @param cookie
 * @param r2oSessionId
 * @param partnerId
 * @returns
 */
function getSalesOrgData(cookie, r2oSessionId, partnerId) {
	
	var salesOrgInput = {
			method : 'get',
			body : {
				contentType : "application/json",
				content : ""
			},
			headers : {
				"Cookie" : cookie,
				"R2oSessionId" : r2oSessionId
			},
			path : 'api/partner/' + partnerId + '/salesorgs/SAPEUO',
		};

		var salesOrgResponse = WL.Server.invokeHttp(salesOrgInput);
	
	return salesOrgResponse;
	
}

/**
 * function to get disclaimers
 * @param cookie
 * @param r2oSessionId
 * @returns {___anonymous40156_40233}
 */
function getDisclaimers(cookie, r2oSessionId) {
	var disclaimerInput = {
	        method : 'put',
	        body : {
	            contentType : "application/json",
	            content : '["ProductDisclaimers"]'
	        },
	        headers : {
				"Cookie" : cookie,
				"R2oSessionId" : r2oSessionId
			},
	        path : 'api/lookuplist',
	    };

	var discalimersResponse = WL.Server.invokeHttp(disclaimerInput);
	
	var cookie = discalimersResponse.responseHeaders['Set-Cookie'];
	return {
		ProductDisclaimers : discalimersResponse.LookupLists,
		cookie : cookie
	}
	
}


function initializeResponse(){
	return {};
}