sap.ui.define([
	"./BaseController",
	'./Formatter',
    "sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, Formatter, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.GuestDetail", {

		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */
		/**********************************************************************************************************************************************************/
		onInit: function () {

			// attach event to the router which binds the correct dataset to this page after navigation 
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("guestdetail").attachMatched(function(oEvent) {
				this._onAfterNavigation(oEvent.getParameter("arguments").guestId);
				}, this);
		},
		/**********************************************************************************************************************************************************/
		onAfterRendering: function(){

			// if the owner component has not yet loaded it's data, get own model 
			// only necessary in case of direct access, usual navigation will not trigger this function 
			if (!this.getOwnerComponent().getModel("guests").getData().guests) {

				// get the path and requested guest id 
				var sHash = this.getCurrentHash();
				var aHash = sHash.split("/");

				// load the full model to this view 
				this.getView().setModel(this.getModelHandler().createModelFromURL("pef/Philomena/model/guests.json"), "guests");

				// attention: the guest id does not always match the dataset id! 
				// binding must name the dataset number within the JSON file, while the event id can differ 
				// (for example event id 8 is in 5th place) - binding must be done with element number 5 and not 8 
				var oModel = this.getView().getModel("guests");
				var oData = oModel.getData();
				var sRealId = "";

				// we iterate over all events and compare the hash value to the actual event id 
				for (var i in oData.guests) {

					// if we have a match, the dataset number is found and we can bind to that dataset 
					if (oData.guests[i].guestId == aHash[1]) {
						sRealId = i;
						break;
					}
				} 

				// bind to dataset number 
				this.getView().bindElement({
					path: ("guests>/" + "guests/" + sRealId)
				});
			}
		},
		/**********************************************************************************************************************************************************/
		/* EVENT HANDLERS */
		/**********************************************************************************************************************************************************/
		_onAfterNavigation: function(sId) {

			// try to get toe model from owner component 
			var oModel = this.getOwnerComponent().getModel("guests");

			// fails if component is not yet loaded (direct link access)
			// fallback is onAfterRendering
			if (oModel) {
				
				// attention: the guest id does not always match the dataset id! 
				// binding must name the dataset number within the JSON file, while the event id can differ 
				// (for example event id 8 is in 5th place) - binding must be done with element number 5 and not 8 
				var oData = oModel.getData();
				var sRealId = "";

				// we iterate over all events and compare the hash value to the actual event id 
				for (var i in oData.guests) {

					// if we have a match, the dataset number is found and we can bind to that dataset 
					if (oData.guests[i].guestId == sId) {
						sRealId = i;
						break;
					}
				} 
				
				// bind to dataset number 
				this.getView().bindElement({
					path: ("guests>/" + "guests/" + sRealId)
				});
			}
		},
		/**********************************************************************************************************************************************************/
		onShowEvents: function(oEvent) {

			// filtered event list for guest id requested - trigger navigation 
			var sId = oEvent.getSource().getBindingContext("guests").getObject().guestId;
			this.getRouter().navTo("eventswithguest", { guestId: sId });
		}
		/**********************************************************************************************************************************************************/
	});
});