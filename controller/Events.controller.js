sap.ui.define([
	"./BaseController",
	'./Formatter',
    "sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Formatter, MessageToast, MessageBox, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.Events", {

		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */
		/**********************************************************************************************************************************************************/
		onInit: function () {

			// attach event handlers for after-navigation-events to the router 
			this.getRouter().getRoute("myevents").attachMatched(function(oEvent) {
				this._onMyEvents();
				}, this);

			this.getRouter().getRoute("events").attachMatched(function(oEvent) {
				this._onEvents();
				}, this);

			this.getRouter().getRoute("eventswithguest").attachMatched(function(oEvent) {
				this._onEventsGuest(oEvent.getParameter("arguments").guestId);
				}, this);

			this.getRouter().getRoute("eventsinroom").attachMatched(function(oEvent) {
				this._onEventsRoom(oEvent.getParameter("arguments").roomName);
				}, this);
		},
		/**********************************************************************************************************************************************************/
		onAfterRendering: function() {

			var aHash = this.getCurrentHash().split("/");

			switch (aHash[0]) {
				case "events": 
					this._onEvents();
					break;
				case "eventswithguest": 
					this._onEventsGuest(aHash[1]);
					break;
				case "eventsinroom":
					this._onEventsRoom(aHash[1]);
					break;
			}

			// hide past events by default 
			this.hidePast();
		},
		/**********************************************************************************************************************************************************/
		/* NAVIGATION EVENT HANDLERS */
		/**********************************************************************************************************************************************************/
		/* 
		 * Important: 
		 * This view can be accessed in several perspectives (indicated by the navigation route). These decide how the event list will be filtered. 
		 * 
		 * Attention: 
		 * All of these methods will fail if the event model is not yet loaded by the component. This will be the case when the user accesses this page 
		 * directly without starting via the overview page. 
		 * The following methods will thus return when this error is detected. 
		 * The hook method onAfterRendering is a fallback handler for this case. It will get the desired perspective and call the navigation handler method again. 
		 */
		/**********************************************************************************************************************************************************/
		_onEvents: function() {

			// default perspective needs no filtering, so build empty filter array and leave it empty 
			var aFilter = [];			
			
			var oList = this.getView().byId("eventList");
			var oBinding = oList.getBinding("items");

			// in case of direct access, the list is not yet bound, so oBinding will be undefined and filtering fails 
			// fallback is onAfterRendering 
			if (!oBinding) {
				console.log("View Events: Could not access the event model... retry once after rendering.");
				return;
			}

			// attach empty filter to the model binding 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		_onEventsRoom: function(sRoom) {

			// perspective requires filtering by room 

			// build empty filter array
			var aFilter = [];

			// apply new filter for room name 
			aFilter.push(new Filter("room", FilterOperator.EQ, sRoom));
			
			var oList = this.getView().byId("eventList");
			var oBinding = oList.getBinding("items");

			// in case of direct access, the list is not yet bound, so oBinding will be undefined and filtering fails 
			// fallback is onAfterRendering 
			if (!oBinding) {
				console.log("View Events: Could not access the event model... retry once after rendering.");
				return;
			}

			// attach filter to the model binding 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		_onEventsGuest: function(sGuest) {

			// perspective requires filtering by guest id 
			// because deep filtering in JSON models is not yet supported, the guest ids are stored seperately in a field 'guestids' with a hash before and after 
			// each id 

			// build empty filter array
			var aFilter = [];			
			var sQuery = "#" + sGuest + "#";

			// apply new filter 
			aFilter.push(new Filter("guestids", FilterOperator.Contains, sQuery));
			
			var oList = this.getView().byId("eventList");
			var oBinding = oList.getBinding("items");

			// in case of direct access, the list is not yet bound, so oBinding will be undefined and filtering fails 
			// fallback is onAfterRendering 
			if (!oBinding) {
				console.log("Could not access the event model... retry once after rendering.");
				return;
			}

			// attach filter to the model binding 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		_onMyEvents: function() {

			// perspective requires filtering by favorite event ids 

			// get favorite events from the user model which was built by the App view controller on startup 
			try { 
				aFavEvents = this.getOwnerComponent().getModel("user").getData().favevents;
			
			// fallback if component is not yet ready to deliver data 
			} catch (oError) {
				console.log("Could not access the user model... creating own model.");
				this.getView().setModel(this.getModelHandler().createUserModel(), "user");
				aFavEvents = this.getView().getModel("user").getData().favevents;
			};

			// if this also fails, try to access the cookie directly 
			if (!aFavEvents || (aFavEvents.length == 1 && aFavEvents[0] == undefined)) {
				var oCookieHandler = this.getCookieHandler();
				var sCookieName = oCookieHandler.getFullHandle() + "_FAVEVENTS";
				var aFavEvents = oCookieHandler.toArray(oCookieHandler.getValue(sCookieName));

				console.log("Fetching cookie data...");
			}

			// build empty filter array
			var aFilter = [];	
			
			// apply a filter on the event id for each valid given favorite id 
			// the cookie may store empty ids 
			for ( var i=0; i<aFavEvents.length; i++ ) {
				
				if (aFavEvents[i] !== "") {
					aFilter.push(new Filter("eventId", FilterOperator.EQ, aFavEvents[i]));
				}

			}

			// if no events matched, send user message 
			if (aFilter.length == 0) {

				// error message 
				MessageToast.show("You have no favorite events! All events will be loaded.");

			} else { 

				var oList = this.getView().byId("eventList");
				var oBinding = oList.getBinding("items");

				// in case of direct access, the list is not yet bound, so oBinding will be undefined and filtering fails 
				// fallback is onAfterRendering 
				if (!oBinding) {
					console.log("Could not access the event model... retry once after rendering.");
					return;
				}

				// attach filter to the model binding 
				oBinding.filter(aFilter);

			}
		},
		/**********************************************************************************************************************************************************/
		/* CONTROL EVENT HANDLERS */
		/**********************************************************************************************************************************************************/
		onFilterTitle: function(oEvent) {

			// event handler for the search field 
			// clears other filters 

			// build empty filter array 
			var aFilter = [];

			// read query input 
			var sQuery = oEvent.getParameter("query");

			// if query is supplied, add filter to model 
			if (sQuery) {
				aFilter.push(new Filter("eventname", FilterOperator.Contains, sQuery));
			}

			var oList = this.getView().byId("eventList");
			var oBinding = oList.getBinding("items");

			// it is not necessary to check if oBinding is supplied, as the full app has been rendered here (user input)

			// attach filter to the model binding 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		onRoomSelected: function(oEvent) {

			// event handler for room button choice 
			// clears other filters 

			// build empty filter array
			var aFilter = [];

			// read the button text which equals the room name 
			var sQuery = oEvent.getParameters().item.mProperties.text;

			// only exception is the 'All' button which should undo the filter 
			if (sQuery == "All") {
				sQuery = "";
			}

			// if there is still something to filter, add filter for room name 
			if (sQuery) {
				aFilter.push(new Filter("room", FilterOperator.EQ, sQuery));
			}

			var oList = this.getView().byId("eventList");
			var oBinding = oList.getBinding("items");

			// attach filter to the model binding 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		onHidePast: function(oEvent) {

			// event handler for hide past events button 
			// keeps other filters 

			// if the toggle button is now in pressed state, filter events which start in the past 
			// (comparing local ISO string with begin datetime) 
			if (oEvent.getSource().getPressed()) {
				this.hidePast();
			} else {
			// if the toggle button is not in pressed state, the time filter will be reset 
			// all other filters will be kept 
				this.showPast();
			}
		},
		/**********************************************************************************************************************************************************/
		onClearFilter: function(oEvent) {

			// event handler for clear filter button 

			// build empty filter array
			var aFilter = [];

			var oList = this.getView().byId("eventList");
			var oBinding = oList.getBinding("items");

			// attach this empty filter to clear all existing filters 
			oBinding.filter(aFilter);

		},
		/**********************************************************************************************************************************************************/
		onListItemPress: function (oEvent) { 

			// get id of the selected event 
			var sId = oEvent.getSource().data("eventId");

			// trigger navigation 
			this.getRouter().navTo("eventdetail", { eventId: sId });
		},
		/**********************************************************************************************************************************************************/
		/* UTILITY FUNCTIONS */
		/**********************************************************************************************************************************************************/
		getFormatter: function() {
			return Formatter;
		},
		/**********************************************************************************************************************************************************/
		hidePast: function() {
			
			// convenience method for hide past events button 
			// keeps other filters 

			// event times are stored in local CEST, so the ISO string will not match 
			// we have to get the current time as an ISO string, but in CEST and not GMT 

			// get the time zone offset according to user agent and convert to milliseconds 
			var sOffset = (new Date()).getTimezoneOffset() * 60000; 

			// bild ISO timestamp from now - offset 
			var sLocalISOTime = (new Date(Date.now() - sOffset)).toISOString().slice(0, -1);

			// build empty filter array
			var aFilter = [];

			var oList = this.getView().byId("eventList");
			var oBinding = oList.getBinding("items");
			
			// combining filters should be possible, so get old filters 
			aFilter = oBinding.aFilters;

			// filter events which start in the past 
			aFilter.push(new Filter("begin", FilterOperator.GT, sLocalISOTime));

			// attach filter to the model binding 
			oBinding.filter(aFilter);
		},
		/**********************************************************************************************************************************************************/
		showPast: function() {
		
			// build empty filter array
			var aFilter = [];

			var oList = this.getView().byId("eventList");
			var oBinding = oList.getBinding("items");
			
			// get all current filters 
			aFilter = oBinding.aFilters;

			// delete time related filter  
			aFilters.forEach(function(item, index) { 
				if (item.sPath == "begin") {
					delete aFilters[index];
				} 
			});

			// attach new (reduced) filter to the model binding 
			oBinding.filter(aFilter);
		}
		/**********************************************************************************************************************************************************/
	});
});