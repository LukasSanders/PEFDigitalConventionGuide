sap.ui.define([
	"./BaseController",
    "sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.App", {

		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */ 
		/**********************************************************************************************************************************************************/
		onInit: function () {

		},
		/**********************************************************************************************************************************************************/
		/* EVENT HANDLERS */
		/**********************************************************************************************************************************************************/
		onSubmit: function (oEvent) { 

			// read entered values 
			var sName 		= this.byId("userName").getValue();
			var sFirstName 	= this.byId("userFirstName").getValue();
			var bConsent 	= this.getView().byId("userConsent").getProperty("selected");

			// first, set the cookie consent according to the user input 
			this.getCookieHandler().setConsentCookie(bConsent);

			// if cookies are allowed, let the cookie handler set the user name 
			if (bConsent === true) {
				this.getCookieHandler().setName(sName, sFirstName, true);
				MessageToast.show("User data was saved!");

				// also update the local client model, so that it appears right now in the shell and app control 
				var oNewData = this.getModelHandler().createUserModel().getData();
				this.getOwnerComponent().getModel("user").setData(oNewData);

			// if cookies are not allowed, show an error message 
			} else {
				MessageBox.error("User data cannot be saved if cookies are not allowed.");
			}
		},
		/**********************************************************************************************************************************************************/
		onDownload: function(oEvent) {

			// writes user data to a CSV file and triggers the download 

			// build a dummy DOM element to the file to create 
			var oElement = document.createElement('a');
			var sFilename = "user.dat";

			// build HTML link element for downloading the data file 
			oElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this._getUserDataForExport()));
			oElement.setAttribute('download', sFilename);
			oElement.style.display = 'none';
			document.body.appendChild(oElement);

			// simulate click on the invisible link element - download dialog will show 
			oElement.click();

			// remove element 
			document.body.removeChild(oElement);
		},
		/**********************************************************************************************************************************************************/
		onUpload: function(oEvent) {

			// upload data from a CSV file 

			// get the selected file from the 
			var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];

			// if a file was selected 
			if(file && window.FileReader){  

				// get instance of a FileReader to process the CSV file content 
				var reader = new FileReader();  

				// self for later access in the asynchronous method - 'this'will be something else then, so we have to pass a reference 
				var that = this;

				// attach a new asynchronous function which processes the content 
				reader.onload = function(evn) {  

					// get the CSV data as string 
					var strCSV= evn.target.result; 

					// split to array 
					var aUserData = strCSV.split(";");

					// save user data - here we need the self reference to call the method to save user data 
					that._setUserData(aUserData); };

				// trigger file processing 
				reader.readAsText(file);
			}
		},
		/**********************************************************************************************************************************************************/
		onExport: function(oEvent) {

			// export user data to a hex string for fileless sharing 

			// get full user data as string and convert it to hex code 
			var sString = this._toHex(this._getUserDataForExport());

			// set the value to the input field 
			this.byId("userString").setValue(sString);

			// also copy data to clipboard 
			this.copyToClipboard(sString);

			// show a confirmation message 
			MessageToast.show("User code generated and copied to clipboard!");

		},
		/**********************************************************************************************************************************************************/
		onImport: function(oEvent) {

			// import user data from a hex string (fileless sharing)

			// get the input from the sharing field 
			var sHex = this.byId("userString").getValue();

			// check if there is something to import 
			if (sHex == "") {
				MessageToast.show("Please enter a valid string!");
				return;
			}

			// convert to string 
			var sString = this._toString(sHex);

			// split to array (data is really CSV) 
			var aUserData = sString.split(";");

			// set the user data 
			this._setUserData(aUserData);

		},
		/**********************************************************************************************************************************************************/
		/* UTILITY FUNCTIONS */ 
		/**********************************************************************************************************************************************************/
		_toString: function(sHex) {

			// converts any hex value to a string 

			var sString = '';
			for (var i = 0; i < sHex.length; i += 2) {
				sString += String.fromCharCode(parseInt(sHex.substr(i, 2), 16));
			}
			return sString;
		},
		/**********************************************************************************************************************************************************/
		_toHex: function(sString) {

			// converts any string to hex code 

			var sHex = '';
			for(var i=0;i<sString.length;i++) {
				sHex += ''+sString.charCodeAt(i).toString(16);
			}
			return sHex;
		},
		/**********************************************************************************************************************************************************/
		_getUserDataForExport: function() {

			// prepare user data for export as a CSV string 

			// user data is already in the model, so we can get it from the input fields and do not need to read the cookie 
			var sName 		= this.byId("userName").getValue();
			var sFirstName 	= this.byId("userFirstName").getValue();
			var bConsent 	= this.getView().byId("userConsent").getProperty("selected");

			// list of favorite events in raw format must be fetched from the owner component 
			// stored in array, so convert to string 
			var sFavEvents = this.getOwnerComponent().getModel("user").getData().favevents.toString()

			// build an empty string for txt file 
			var sText = "";

			// concatenate all data to a CSV string  
			sText = sName + ";" + sFirstName + ";" + bConsent + ";" + sFavEvents;

			// return this CSV string  
			return sText;

		},
		/**********************************************************************************************************************************************************/
		_setUserData: function(aUserData) {

			// save imported user data in cookies and model 

			// check if all array fields are defined - if not, the CSV string has more or less fields than expected 
			if (aUserData.length !== 4 || !aUserData[0] || !aUserData[1] || !aUserData[2] || !aUserData[3]) {
				MessageToast.show("Invalid data!")
				return;
			}

			// check if minimum data is given 
			if (aUserData[0] == "" || aUserData[1] == "" || aUserData[2] == "" ) {
				MessageToast.show("No data found to import!")
				return;
			}

			// no further checks for data consistency implemented - any user input will be accepted 

			// write array contents to variables 
			var sName = aUserData[0];
			var sFirstName = aUserData[1];
			var bConsent = false;
			var sFavEvents = aUserData[3];

			// convert the boolean state to a real boolean value - if true, overwrite default false value 
			// JavaScript thinks that 'true == "true"', but using the string 'true' will lead to problems later so we have to convert the value here 
			if (aUserData[2] == "true") {
				bConsent = true;
			};

			// set consent cookie first 
			this.getCookieHandler().setConsentCookie(bConsent);

			// if consent was given, set the imported values to cookies 
			if (bConsent === true) {
				this.getCookieHandler().setName(sName, sFirstName, true);
				this.getCookieHandler().setValue(this.getCookieHandler().getFullHandle() + "_FAVEVENTS", sFavEvents);
				MessageToast.show("User data imported!");

				// also update the local client model by receiving data from the cookies again - this also handles converting favorite events to an array again 
				var oNewData = this.getModelHandler().createTicketModel().getData();
				this.getOwnerComponent().getModel("ticket").setData(oNewData);

			// if consent was not given, display an error message 
			} else {
				MessageBox.error("User data cannot be saved if cookies are not allowed.");
			}
		}
		/**********************************************************************************************************************************************************/
	});
});