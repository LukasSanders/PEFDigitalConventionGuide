sap.ui.define([
	"./BaseController",
], function (Controller) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.Social", {

        /**********************************************************************************************************************************************************/
        /* HOOK METHODS */
        /**********************************************************************************************************************************************************/
		onInit: function () {
			
		},
        /**********************************************************************************************************************************************************/
        /* EVENT HANDLERS */
        /**********************************************************************************************************************************************************/
		onPress: function (oEvent) { 

            // get the id of the pressed tile 
            var sTile  = oEvent.getSource().sId.split("--")[1];
            
            // action according to tile id 
            switch(sTile) {
                case "twitter": 
                    window.open("https://www.twitter.com/gala_con", "_blank");
                    break;
                case "facebook":
                    window.open("https://www.facebook.com/GalaConEU/", "_blank");
                    break;
                case "website":
                    window.open("https://www.galacon.eu/", "_blank");
                    break;
                case "youtube":
                    window.open("https://www.youtube.com/channel/UCBW8vqXpgo7PPoXsn1T5dig", "_blank");
                    break;
                case "sms":
                    sap.m.URLHelper.triggerSms("+4915127040053");
                    break;
                case "email":
                    sap.m.URLHelper.triggerEmail("support@pony-events.eu", "Request from Digital Convention Guide");
                    break;
            }
        }
        /**********************************************************************************************************************************************************/
	});
});