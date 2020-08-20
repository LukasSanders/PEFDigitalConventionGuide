sap.ui.define([
	"./BaseController",
    "sap/ui/core/HTML"
], function (Controller, HTML) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.Transport", {
		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */ 
		/**********************************************************************************************************************************************************/
		onInit: function () {

			// VVS connection search will be placed in an iframe 

			// check if there is already a html control 
            var oHtml = this.byId("htmlControl");

			// if none exists, build one 
			if (!oHtml) {
				var sId = this.createId("htmlControl");
				oHtml = new HTML(sId, {
					
					// place iframe with VVS connection search in it 
					content: "<iframe title=\"VVS Verbindungswidget\"frameborder=\"no\ scrolling=\"no\" style=\"border: 0;\" width=\"100%\" height=\"400\" src=\"https://www.vvs.de/services/efaaufhp/widgets/a-nach-b.html?startId=de%3A08118%3A7516&start=Ludwigsburg%2C%20Forum%20am%20Schlosspark&type=train\"></iframe>",
					preferDOM : false,
				});

				// add html control to VBox 
				var oVBox= this.getView().byId("vvsIFrame");
				oVBox.addItem(oHtml);
            }
    },
	/**********************************************************************************************************************************************************/
    /* EVENT HANDLERS */
	/**********************************************************************************************************************************************************/
    onPress: function(oEvent) {

		// get the id of the pressed button 
        var sBtn  = oEvent.getSource().sId.split("--")[1];
        var sUrl  = "";

		// determine the URL to open according to the button 
		switch(sBtn) {
			case "btnBahn": 
				sUrl = "https://reiseauskunft.bahn.de/bin/query.exe/en?revia=yes&existOptimizePrice-deactivated=1&country=GBR&dbkanal_007=L04_S02_D002_KIN0059_qf-bahn-svb-kl2_lz03&start=1&protocol=https%3A&REQ0JourneyStopsS0A=1&S=Ludwigsburg&REQ0JourneyStopsSID=A%3D1%40O%3DLudwigsburg%40X%3D9185420%40Y%3D48891862%40U%3D80%40L%3D008000235%40B%3D1%40p%3D1588012710%40&REQ0JourneyStopsZID=&timesel=depart&returnDate=&returnTime=&returnTimesel=depart&optimize=0&auskunft_travelers_number=1&tariffTravellerType.1=E&tariffTravellerReductionClass.1=0&tariffClass=2&rtMode=DB-HYBRID&externRequest=yes&HWAI=JS%21js%3Dyes%21ajax%3Dyes%21";
				this.openExternal(sUrl, true);
                break;
			
			case "btnVVS": 
                sUrl = "https://www3.vvs.de/mng/#!/XSLT_TRIP_REQUEST2@init?language=en";
				this.openExternal(sUrl, true);
				break;

			case "btnDeparture": 
                sUrl += "https://dbf.finalrewind.org/Ludwigsburg?hide_opts=1&show_realtime=1";
				this.openExternal(sUrl, true);
				break;

			case "btnCab": 
                sap.m.URLHelper.triggerTel("+49714190000");
				break;
		};	
		}
		/**********************************************************************************************************************************************************/
    }
    );
});