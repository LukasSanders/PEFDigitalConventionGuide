sap.ui.define([
	"./BaseController",
	'./Formatter',
    "sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Formatter, MessageToast, MessageBox, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.Vendors", {

		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */
		/**********************************************************************************************************************************************************/
		onInit: function () {

			// load vendor list 
			this.getView().setModel(this.getModelHandler().createModelFromURL("pef/Philomena/model/vendors.json"), "vendors");

		},
		/**********************************************************************************************************************************************************/
		onAfterRendering: function() {

		},
		/**********************************************************************************************************************************************************/
		/* CONTROL EVENT HANDLERS */
		/**********************************************************************************************************************************************************/
		onFilter: function(oEvent) {

			// event handler for the search field 

			// build empty filter array 
			var aFilter = [];

			// read query input 
			var sQuery = oEvent.getParameter("query");

			// if query is supplied, add filter to model 
			if (sQuery) {
				aFilter.push(new Filter("name", FilterOperator.Contains, sQuery));
			}

			var oList = this.getView().byId("vendorList");
			var oBinding = oList.getBinding("items");

			// it is not necessary to check if oBinding is supplied, as the full app has been rendered here (user input)

			// attach filter to the model binding 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		onCategorySelected: function(oEvent) {

			// event handler for category button choice 

			// build empty filter array
			var aFilter = [];

			// read the button text which equals the room name 
			var sQuery = oEvent.getParameters().item.mProperties.text;

			// only exception is the 'All' button which should undo the filter 
			if (sQuery == "All") {
				sQuery = "";
			}

			// if there is still something to filter, add filter for category
			if (sQuery) {
				aFilter.push(new Filter("room", FilterOperator.Contains, sQuery));
			}

			var oList = this.getView().byId("vendorList");
			var oBinding = oList.getBinding("items");

			// attach filter to the model binding 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		onCommissionsOnly: function(oEvent) {

			// event handler for commissions only button 

			// build empty filter array
			var aFilter = [];

			// if the toggle button is now in pressed state, filter for commissions
			// (comparing local ISO string with begin datetime) 
			if (oEvent.getSource().getPressed()) {
				aFilter.push(new Filter("commissions", FilterOperator.EQ, true));
			} 

			var oList = this.getView().byId("vendorList");
			var oBinding = oList.getBinding("items");

			// attach filter to the model binding 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		onClearFilter: function(oEvent) {

			// event handler for clear filter button 

			// build empty filter array
			var aFilter = [];

			var oList = this.getView().byId("vendorList");
			var oBinding = oList.getBinding("items");

			// attach this empty filter to clear all existing filters 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		onListItemPress: function(oEvent) { 

			// get parameters 
			var aLatLng = oEvent.getSource().data("stallLatLng");
			var sVendorName = oEvent.getSource().data("vendorName");

			// build routing string 
			var sLocation = aLatLng[0] + "--" + aLatLng[1] + "--" + sVendorName;
			// trigger navigation 
			this.getRouter().navTo("maplocation", { location: sLocation });
		},
		/**********************************************************************************************************************************************************/
		/* UTILITY FUNCTIONS */
		/**********************************************************************************************************************************************************/
		getFormatter: function() {
			return Formatter;
		}
	});
});