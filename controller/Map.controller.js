sap.ui.define([
	"./BaseController",
    "sap/ui/core/HTML"
], function (Controller, HTML) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.Map", {

		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */
		/**********************************************************************************************************************************************************/
		onInit: function () {

			/*
			 * Important: 
			 * This only embeds the exterior map as an iframe. Please see ./../assets/map for logic 
			 */

			// get html container control 
            var oHtml = this.byId("htmlControl");

			// if no such thing exists, create one with the id 
			if (!oHtml) {
				var sId = this.createId("htmlControl");
				oHtml = new HTML(sId, {
					
					// embed map in iframe 
					content: "<iframe height=\"400px\" width=\"100%\" src=\"./assets/map/map.html\" frameborder=\"no\ scrolling=\"no\"></iframe>",
					preferDOM : false,
				});

				// get VBox which should hold the control and add the html container control 
				var oVBox= this.getView().byId("mapIFrame");
				oVBox.addItem(oHtml);

				console.log("iframe loading URL " + "./assets/map/map.html");
			}
			
			// attach event handler for after-navigation-event if single highlighted spot is requested 
			this.getRouter().getRoute("maplocation").attachMatched(function(oEvent) {
				this._onHighlightLocation(oEvent.getParameter("arguments").location);
			}, this);
    },
	/**********************************************************************************************************************************************************/
	/* EVENT HANDLERS */
	/**********************************************************************************************************************************************************/
    onToggle: function(oEvent) {

		// react to requested filtering by room type 

		/* 
		 * Important: 
		 * Because we have no better way to communicate with the map control, we will just reload the iframe content with different URL parameters. 
		 * The map control reacts to the given URL parameters by setting the requested filter. 
		 */

		var oHtml = this.byId("htmlControl");
		var sUrl  = "./assets/map/map.html";

		// get the id of the pressed menu item 
		var sBtn  = oEvent.getParameters().item.getId().split("--")[1];

		// determine the URL parameters to add 
		switch(sBtn) {

			// URL does not need to have parameters in that case, all room types should be shown 
			case "btnAll": 
				break;
			
 			// for all other cases, set the parameter 'highlightLayer' true and supply the 'visibleLayer' parameter 
			case "btnService": 
				sUrl += "?highlightLayer=X&visibleLayer=groupServ";
				break;

			case "btnEvent": 
				sUrl += "?highlightLayer=X&visibleLayer=groupRoom";
				break;

			case "btnFood": 
				sUrl += "?highlightLayer=X&visibleLayer=groupFood";
				break;

			case "btnBath": 
				sUrl += "?highlightLayer=X&visibleLayer=groupBath";
				break;

			case "btnElev": 
				sUrl += "?highlightLayer=X&visibleLayer=groupElev";
				break;
		};

		// set new HTML content for iframe 
		oHtml.setContent("<iframe height=\"400px\" width=\"100%\" src=\"" + sUrl + "\" frameborder=\"no\ scrolling=\"no\"></iframe>");   
		
		console.log("iframe loading URL " + sUrl);
		
		},
		/**********************************************************************************************************************************************************/
		onClearFilter: function(oEvent) {

			var oHtml = this.byId("htmlControl");
			var sUrl  = "./assets/map/map.html";

			// set new HTML content for iframe without any filtering parameters 
			oHtml.setContent("<iframe height=\"400px\" width=\"100%\" src=\"" + sUrl + "\" frameborder=\"no\ scrolling=\"no\"></iframe>");   
			
			console.log("iframe loading URL " + sUrl);
			
		},
		/**********************************************************************************************************************************************************/
		_onHighlightLocation: function(sArgs) {

			// highlighting single point on the map was requested 
			// this is controlled via a manipulation of the URL parameters for the embedded iframe 

			// get HTML control - should be initialized by now 
			var oHtml = this.byId("htmlControl");
			var sUrl  = "./assets/map/map.html";
			if (!oHtml) { return; };

			// get the routing parameters 
			var aParams = sArgs.split("--");

			// convert to URL parameters 
			var sParams = "&singlePointLat=" + aParams[0] + "&singlePointLng=" + aParams[1] + "&singlePointTxt=" + aParams[2];
			
			sUrl += "?singlePoint=X";
			sUrl += sParams;

			// set new content 
			oHtml.setContent("<iframe height=\"400px\" width=\"100%\" src=\"" + sUrl + "\" frameborder=\"no\ scrolling=\"no\"></iframe>");  
			
			console.log("iframe loading URL " + sUrl);

		},
		/**********************************************************************************************************************************************************/
		onViewExternal: function(oEvent) {

			// external opening of map in fullscreen requested 
			// load in same window, returning via navigation is possible 
			this.openExternal("./assets/map/map.html", false);
		}
		/**********************************************************************************************************************************************************/
    }
    );
});