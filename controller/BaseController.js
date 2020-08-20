sap.ui.define([

	// general 
	"sap/ui/core/mvc/Controller",

	// navigation 
	"sap/ui/core/routing/History",

	// message handling 
	"sap/m/MessageToast",


	// external and legacy content 
	"sap/ui/core/HTML",

	// custom modules 
	"./../customlibrary/CookieController",
	"./../model/models"
	
], function (Controller, History, MessageToast, HTML, CookieHandler, ModelHandler) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.BaseController", {

		/**********************************************************************************************************************************************************/
		/* GETTER FUNCTIONS */
		/**********************************************************************************************************************************************************/
		getModelHandler: function() {
			return ModelHandler;
		},
		/**********************************************************************************************************************************************************/
		getCookieHandler: function() {
			return CookieHandler;
		},
		/**********************************************************************************************************************************************************/
        getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this); 
		},
		/**********************************************************************************************************************************************************/
		getCurrentHash : function() {
			var oRouter = this.getRouter();
			return oRouter.getHashChanger().getHash();
		},
        /**********************************************************************************************************************************************************/
        getModel : function (sName) {
			return this.getView().getModel(sName);
		},
		/**********************************************************************************************************************************************************/
		getI18nModel: function() {
			return this.getOwnerComponent().getModel("i18n"); 
		},
        /**********************************************************************************************************************************************************/
        getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		/**********************************************************************************************************************************************************/
		getDeviceModel: function() {
			return this.getOwnerComponent().getModel("device"); 
		},
		/**********************************************************************************************************************************************************/
		/* UTILITY METHODS */
		/**********************************************************************************************************************************************************/
		openExternal: function(sUrl, bNewTab) {
			var sTarget = "";

			// map boolean for new tab to target 
			if (bNewTab == true) {
				sTarget = "_blank";
			} else {
				sTarget = "_self";
			}; 

			window.open(sUrl, sTarget);
		},
		/**********************************************************************************************************************************************************/
		showMessageToast: function(sMessage) {
			MessageToast.show(sMessage);
		},
		/**********************************************************************************************************************************************************/
		copyCurrentUrl: function() {

			// create a dummy element in the DOM to execute copy command 
			var dummy = document.createElement('input'),
			text = window.location.href;
			document.body.appendChild(dummy);

			// write text to dummy element 
			dummy.value = text;
			dummy.select();

			// execute ctrl+c 
			document.execCommand('copy');

			// remove dummy element 
			document.body.removeChild(dummy);
		},
		/**********************************************************************************************************************************************************/
		copyToClipboard: function(sText) {

			// create a dummy element in the DOM to execute copy command 
			var el = document.createElement('textarea');

			// write text to dummy element 
			el.value = sText;
			document.body.appendChild(el);
			el.select();

			// execute ctrl+c 
			document.execCommand('copy');

			// remove dummy element
			document.body.removeChild(el);
		},
		/**********************************************************************************************************************************************************/
        onNavBack : function() {

			// try to get the buffered previous hash from the history 
			var sPreviousHash = History.getInstance().getPreviousHash();

			// if this is not accessible or not defined, return to the start page 
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("overview", {}, true);
			}
		}
		/**********************************************************************************************************************************************************/
    });
    
});