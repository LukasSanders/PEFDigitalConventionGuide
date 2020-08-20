sap.ui.define([
	"sap/ui/core/UIComponent", 
	"./model/models" ],
function (UIComponent, ModelHandler) {
	"use strict";

	return UIComponent.extend("pef.Philomena.Component", {

		metadata: {
			manifest: "json"
		},

	/**********************************************************************************************************************************************************/
	/* HOOK METHODS */
	/**********************************************************************************************************************************************************/ 
	init: function () {

		// call the base component's init function
		UIComponent.prototype.init.apply(this, arguments);

		// enable routing
		this.getRouter().initialize();

		// set the device model
		this.setModel(ModelHandler.createDeviceModel(), "device");

		// set the i18n model 
		this.setModel(ModelHandler.createI18nModel(), "i18n");

		// set the user model 
		this.setModel(ModelHandler.createUserModel(), "user");

		// set the other shared models used in different views and controllers  
		this.setModel(ModelHandler.createModelFromURL("pef/Philomena/model/events.json"), "events");
		this.setModel(ModelHandler.createModelFromURL("pef/Philomena/model/guests.json"), "guests");

	}
	/**********************************************************************************************************************************************************/
	});
});
