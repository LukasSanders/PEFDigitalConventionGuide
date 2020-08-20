sap.ui.define([
	"./BaseController",
    "sap/ui/core/HTML"
], function (Controller, HTML) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.Explore", {
		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */
		/**********************************************************************************************************************************************************/
		onInit: function () {

			/*
			 * Important: 
			 * This only embeds the exterior map as an iframe. Please see ./../assets/explore for logic 
			 */

            // try to get the html control (maybe created earlier)
            var oHtml = this.byId("htmlControl");

			// no html control found, so we make one 
			if (!oHtml) {

				// create valid control id 
				var sId = this.createId("htmlControl");

				// build a new HTML control holding an iframe containing the exterior map 
				oHtml = new HTML(sId, {

					// the static content as a long string literal - we want no scrolling and no frameborder 
					content: "<iframe height=\"400px\" width=\"100%\" src=\"./assets/explore/map.html\" frameborder=\"no\ scrolling=\"no\"></iframe>",
					preferDOM : false,
				});

				// add the HTML control to the empty VBox 
				var oVBox= this.getView().byId("mapIFrame");
				oVBox.addItem(oHtml);

				console.log("iframe loading URL " + "./assets/explore/map.html");

            }
    },
	/**********************************************************************************************************************************************************/
	/* EVENT HANDLERS */
	/**********************************************************************************************************************************************************/
	onViewExternal: function(oEvent) {

		// open the map in fullscreen via Base controller method - browser navigation will still work 
		this.openExternal("./assets/explore/map.html", false);

		}
	}
	/**********************************************************************************************************************************************************/
    );
});