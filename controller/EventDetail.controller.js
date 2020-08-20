sap.ui.define([
	"./BaseController",
	'./Formatter',
    "sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, Formatter, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.EventDetail", {

		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */
		/**********************************************************************************************************************************************************/
		onInit: function () {

			// attach event handler to the router which binds the correct dataset to this page after navigation 
			var oRouter = this.getRouter();
			oRouter.getRoute("eventdetail").attachMatched(function(oEvent) {
				this._onAfterNavigation(oEvent.getParameter("arguments").eventId);
				}, this);
		},
		/**********************************************************************************************************************************************************/
		onAfterRendering: function(){

			// if the owner component has not yet loaded it's data, get own model 
			// only necessary in case of direct access; during usual navigation, the component will be loaded 
			if (!this.getOwnerComponent().getModel("events").getData().events) {

				// extract the actual hash which holds the event id 
				var sHash = this.getCurrentHash();
				var aHash = sHash.split("/");

				// load the full data model 
				this.getView().setModel(this.getModelHandler().createModelFromURL("pef/Philomena/model/events.json"), "events");

				// attention: the event id does not match the dataset id! 
				// binding must name the dataset number within the JSON file, while the event id can differ 
				// (for example event id 8 is in 5th place) - binding must be done with element number 5 and not 8 
				var oModel = this.getView().getModel("events");
				var oData = oModel.getData();
				var sRealId = "";

				// we iterate over all events and compare the hash value to the actual event id 
				for (var i in oData.events) {

					// if we have a match, the dataset number is found and we can bind to that dataset 
					if (oData.events[i].eventId == aHash[1]) {
						sRealId = i;
						break;
					}
				} 

				// bind to dataset number 
				this.getView().bindElement({
					path: ("events>/" + "events/" + sRealId)
				});
			}
		},
		/**********************************************************************************************************************************************************/
		/* UTILITY FUNCTIONS */
		/**********************************************************************************************************************************************************/
		_onAfterNavigation: function(sId) {

			// read the shared event model from the component 
			var oModel = this.getOwnerComponent().getModel("events");

			// this fails if component is not yet loaded (direct link access) - views and controllers load before the component is ready, 
			// so if someone accesses this site directly, there will be no data 
			// fallback is given in  onAfterRendering
			if (oModel) {

				// attention: the event id does not match the dataset id! 
				// binding must name the dataset number within the JSON file, while the event id can differ 
				// (for example event id 8 is in 5th place) - binding must be done with element number 5 and not 8 
				var oData = oModel.getData();
				var sRealId = "";

				// we iterate over all events and compare the hash value to the actual event id 
				for (var i in oData.events) {

					// if we have a match, the dataset number is found and we can bind to that dataset 
					if (oData.events[i].eventId == sId) {
						sRealId = i;
						break;
					}
				} 

				// bind to dataset number 
				this.getView().bindElement({
					path: ("events>/" + "events/" + sRealId)
				});
			} else {
				console.log("Event model of owner component not accessible, will retry after rendering.");
			}
		},
		/**********************************************************************************************************************************************************/
		getFormatter: function() {
			return Formatter;
		},
		/**********************************************************************************************************************************************************/
		/* EVENT HANDLERS */ 
		/**********************************************************************************************************************************************************/
		onPanelistPress: function(oEvent) {
			
			// get the binding context of the event source which is the list item 
			var oCtx = oEvent.getSource().getBindingContext("events");

			// from this binding context, we extract the guest id 
			var sId = oCtx.getObject().guestId;

			// trigger navigation to guest detail page 
			this.getRouter().navTo("guestdetail", { guestId: sId });
		},
		/**********************************************************************************************************************************************************/
		onPanelistEventsPress: function(oEvent) {

			// get the binding context of the event source which is the button in the list item 
			var oCtx = oEvent.getSource().getBindingContext("events");

			// from this binding context, we extract the guest id 
			var sId = oCtx.getObject().guestId;

			// trigger navigation to the event list with filter on guest id 
			this.getRouter().navTo("eventswithguest", { guestId: sId });
		},
		/**********************************************************************************************************************************************************/
		onMarkFavorite: function(oEvent) {

			// initialize cookie handler 
			var oCookieHandler = this.getCookieHandler(); 
			var sCookieName = oCookieHandler.getFullHandle() + "_FAVEVENTS";

			// read event id 
			var sEventId = oEvent.getSource().data("eventId");
			
			// push the id to cookie value 
			oCookieHandler.appendArrValue(sCookieName, sEventId);

			// also update the local client model by receiving data from the cookies again - this also handles converting favorite events to an array again 
			var oNewData = this.getModelHandler().createUserModel().getData();
			this.getOwnerComponent().getModel("user").setData(oNewData);

			MessageToast.show("Event marked as favorite!");
		},
		/**********************************************************************************************************************************************************/
		onUnmarkFavorite: function(oEvent) {

			// initialize cookie handler 
			var oCookieHandler = this.getCookieHandler(); 
			var sCookieName = oCookieHandler.getFullHandle() + "_FAVEVENTS";

			// read event ID 
			var sEventId = oEvent.getSource().data("eventId");
			
			// delete from cookie value 
			oCookieHandler.deleteArrValue(sCookieName, sEventId);

			// also update the local client model by receiving data from the cookies again - this also handles converting favorite events to an array again 
			var oNewData = this.getModelHandler().createUserModel().getData();
			this.getOwnerComponent().getModel("user").setData(oNewData);

			MessageToast.show("Event removed from favorite list!");
		},
		/**********************************************************************************************************************************************************/
		onShare: function(oEvent) {

			// copy url to clipboard and notify the user 
			this.copyCurrentUrl();
			MessageToast.show("URL copied to clipboard!");
			
		}
		/**********************************************************************************************************************************************************/
	});
});