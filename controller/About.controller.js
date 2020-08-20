sap.ui.define([
	"pef/Philomena/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.About", {
		onInit: function () {

			/* GENERAL INITIALIZATION*/

			// create views based on URL hash 
			this.getRouter().initialize(); 


			/* LOAD MODELS */

			// load i18n model 
			this.getView().setModel(this.getI18nModel(), "i18n");

			// set HTML content model
			var oModel = new JSONModel({
				HTML : 
				"<h3>About</h3>" +
				"<p>Brought to you by the Pony Events Fedeartion e.V. as host of galacon.</p><br>" +
				"<h3>Terms of use</h3>" +
				"<p>This app may be used for free as-is without any liability. No user or usage data is stored on our servers. If allowed, cookies will be set on your device to locally store user information and favorites.</p>" +
				"<p>Our general terms of service and privacy terms apply.</p>" +
				"<p>Please visit <a href=\"//www.pony-events.eu/legal\" style=\"font-weight:600;\">our website</a> for full imprint and privacy information.</p>" +
				"<h3>Attribution</h3>" +
				"<ul><li><a href=\"https://www.deviantart.com/patchnpaw\">Art by PatchNPaw</a></li>" +
				"<li><a href=\"https://openui5.hana.ondemand.com/\">OpenUI5 Framework & Development Toolkit by SAP SE</a> <a href=\"https://openui5.hana.ondemand.com/LICENSE.txt\">(Apache Licenese, version 2.0 2004)</a></li>" +
				"<li><a href=\"https://leafletjs.com/\">Leaflet.js Library by Vladimir Agafonkin</a></li>" + 
				"<li><a href=\"https://mapicons.mapsmarker.com/\">Map Icons by Nicolas Mollet</a> <a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">(CC BY-SA 3.0)</a></li>"  +
				"<li><a href=\"https://www.deviantart.com/vervex\">Social Icons by vervex @deviantart </a><a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">(CC BY-SA 3.0)</a></li>" +
				"<li><a href=\"https://www.openstreetmap.org/copyright\">Map data by OpenStreetMap.org Contributors (ODbL)</a></li><ul/><br>" +
				"<p>Editorial contents, images and all other content Copyright by Pony Events Federation e.V.</p>"
			});
			this.getView().setModel(oModel, "html");
	},
	
    /* EVENT HANDLERS */

    onPress: function(oEvent) {
        var sBtn  = oEvent.getSource().sId.split("--")[1];
        var sUrl  = "";

		// determine the URL parameters to add 
		switch(sBtn) {
			case "btnEmail": 
				sap.m.URLHelper.triggerEmail("support@pony-events.eu", "Request from Digital Convention Guide");
                break;
			
			case "btnWebsite": 
                sUrl = "https://pony-events.eu/legal";
                this.openExternal(sUrl, true)
				break;
		};	
		}
});
});