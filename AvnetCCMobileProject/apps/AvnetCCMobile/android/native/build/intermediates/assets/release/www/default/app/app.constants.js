
/* JavaScript content from app/app.constants.js in folder common */
angular.module("ccMobile.constants", [])

.constant("CONST", {
	"VERSION": "2.2",
	"LOCAL": false,
	"TOOLS": [
		{
			"id": "requests",
			"displayName": "Requests",
			"state": "quotes",
			"role": "R2O_Allow_Submit_Request",
			"enabled": true
		},
		{
			"id": "orders",
			"displayName": "Orders",
			"state": "orders",
			"role": "Order_Status_NA",
			"enabled": true
		},
		{
			"id": "invoices",
			"displayName": "Invoices",
			"state": "invoices",
			"role": "Order_Status_NA",
			"enabled": false
		}
	]
})

;