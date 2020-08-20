sap.ui.define([
	"./BaseController",
	'./Formatter',
    "sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Formatter, MessageToast, MessageBox, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.Guests", {

		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */
		/**********************************************************************************************************************************************************/
		onInit: function () {

		},
		/**********************************************************************************************************************************************************/
		/* EVENT HANDLERS */
		/**********************************************************************************************************************************************************/
		onFilterTitle: function(oEvent) {

			// event handler for name filtering 

			// build empty filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");

			// add filter according to user entry 
			if (sQuery) {
				aFilter.push(new Filter("guestname", FilterOperator.Contains, sQuery));
			}

			// apply filter 
			var oList = this.getView().byId("guestList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		onGuestPress: function (oEvent) { 

			// detail page requested - trigger navigation 
			var sId = oEvent.getSource().data("guestId");
			this.getRouter().navTo("guestdetail", { guestId: sId });
		}
		/**********************************************************************************************************************************************************/
	});
});