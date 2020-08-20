sap.ui.define([
	"./BaseController",
	"sap/ui/Device",
	"sap/m/Button",
	"sap/m/MessageToast"
], function (Controller, Device, Button, MessageToast) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.App", {

		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */
		/**********************************************************************************************************************************************************/
		onInit: function () {

			/* LOAD MODELS */

			// load popover contents 
			this.getView().setModel(this.getModelHandler().createModelFromURL("pef/Philomena/model/popover.json"), "popover");


			/* 
			 * POPOVER INITIALIZATION 
			 */

			// initialize popover 
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("pef.Philomena.view.Popover", this);
				this.getView().addDependent(this._oPopover);

				// the popover also needs a close button on phones to not become persistent 
				if (Device.system.phone) {
					this._oPopover.setEndButton(new Button({text: "Close", type: "Emphasized", press: this.fnClose.bind(this)}));
				}
			}

			/*
			 * INITIALIZE EVENT CHECKER 
			 */

			// initialize new trigger 
			var that = this;    
			that.eventTrigger = new sap.ui.core.IntervalTrigger(0);   

			// let it run every 5 minutes 
			that.eventTrigger.setInterval(300000); 
			that.eventTrigger.addListener(function(){
				// method checks if favorite events are starting within the next hour 
				that.checkUpcomingEvents();
			});
		},
		/**********************************************************************************************************************************************************/
		onAfterRendering: function() {
			// the data should be loaded until now, so we can try again to check for upcoming events 
			this.checkUpcomingEvents();
		},
		/**********************************************************************************************************************************************************/
		/* SHELL BAR EVENT HANDLERS 
		/**********************************************************************************************************************************************************/
		onAvatarPress: function(oEvent) {
			this.getRouter().navTo("user", false); 
		},
		/**********************************************************************************************************************************************************/
		onHomeIconPress: function (oEvent) { 
			this.getRouter().navTo("overview", false); 
		},
		/**********************************************************************************************************************************************************/
		onNavButtonPress: function (oEvent) { 
			var oHistory = sap.ui.core.routing.History.getInstance();
			var sPrevHash = oHistory.getPreviousHash(); 

			if (sPrevHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("overview", false);
			};
		}, 
		/**********************************************************************************************************************************************************/
		/* POPOVER EVENT HANDLERS */ 
		/**********************************************************************************************************************************************************/
		fnChange: function (oEvent) {

				// if target source is internal or not given, try to navigate to target 
				if (oEvent.getParameter("itemPressed").getTargetSrc() == "" || oEvent.getParameter("itemPressed").getTargetSrc() == "App" ) {
					this.getRouter().navTo(oEvent.getParameter("itemPressed").getTarget());
				} else {
				// else open external window 
					window.open(oEvent.getParameter("itemPressed").getTargetSrc(), oEvent.getParameter("itemPressed").getTarget())
				};
		},
		/**********************************************************************************************************************************************************/
		fnOpen: function (oEvent) {
			this._oPopover.openBy(oEvent.getParameter("button"));
		},
		/**********************************************************************************************************************************************************/
		fnClose: function () {
			this._oPopover.close();
		},
		/**********************************************************************************************************************************************************/
		/* UTILITY FUNCTIONS */ 
		/**********************************************************************************************************************************************************/
		checkUpcomingEvents: function() {

			// get current time with offset 
			var sOffset = (new Date()).getTimezoneOffset() * 60000;
			var sCurrentISOTime = (new Date(Date.now() - sOffset)).toISOString().slice(0, -1);

			// get the time in 1 hour with offset 
			sOffset -= (60 * 60000);
			var sISOTime = (new Date(Date.now() - sOffset)).toISOString().slice(0, -1);
			
			var that = this;
			console.log("Checking for upcoming favorite events...");
			var sMsg = "";

			// read the favorite events from the cookie 
			var sCookieName = that.getCookieHandler().getFullHandle() + "_FAVEVENTS";
			var aEvents = that.getCookieHandler().toArray(that.getCookieHandler().getValue(sCookieName));

			// try to get the model from the component 
			var oModel = that.getOwnerComponent().getModel("events");

			// before the component is loaded, so on first run, there will be no data and we let it fail here 
			// the onAfterRendering hook method will call this function again 
			if (!oModel) { 
				console.log("Event model not ready, will try again later.");
				return; 
			};

			var aAllEvents = oModel.getData().events;

			// might also not work if data is missing  
			if (!aAllEvents) { 
				console.log("Event model not ready, will try again later.");
				return; 
			};

			// loop over all saved events 
			for ( var i=0; i<aEvents.length; i++ ) {
				
				// loop over all events to check the time 
				for ( var j=0; j<aAllEvents.length; j++ ) {
				
					// match fitting event by id 
					if (aAllEvents[j].eventId == aEvents[i] && aEvents[i] !== "") {
						
						// if the panel is starting before the set time, but not in the past
						if (aAllEvents[j].begin <= sISOTime && aAllEvents[j].begin > sCurrentISOTime) {
							sMsg = "Your marked event " + aAllEvents[j].eventname + " starts in less than 1 hour!";
							MessageToast.show(sMsg);
						}
					}
				}
			}
		}
		/**********************************************************************************************************************************************************/
	});
});