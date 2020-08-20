sap.ui.define([
	"sap/ui/model/json/JSONModel",
    "sap/ui/Device",
	"sap/ui/model/resource/ResourceModel",
	"./../customlibrary/CookieController"
], function (JSONModel, Device, ResourceModel, CookieHandler) {
	return {

		/**********************************************************************************************************************************************************/
		/* METHODS TO CREATE MODELS */ 
		/**********************************************************************************************************************************************************/
		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
        },
        /**********************************************************************************************************************************************************/
        createI18nModel: function() {
            var oModel = new ResourceModel({bundleName: "pef.Philomena.i18n.i18n", async: true}); 
            return oModel;
		},
		/**********************************************************************************************************************************************************/
		createModelFromURL: function(sUrl) {
			var oModel = new JSONModel(sap.ui.require.toUrl(sUrl));
			return oModel;
		},
		/**********************************************************************************************************************************************************/
		createUserModel: function() {
			
			// get data from cookies via cookie handler 
			var bConsent = CookieHandler.checkConsent();
			var aName = CookieHandler.getName();

			// get favorite events 
			var sCookieName = CookieHandler.getFullHandle() + "_FAVEVENTS";
			var aFavEvents = CookieHandler.toArray(CookieHandler.getValue(sCookieName));

			// if consent was granted, set data to a new JSON model and generate initials 
			if (bConsent && aName[1] !== undefined) {
				
				var sInitials = aName[0].substring(0,1) + aName[1].substring(0,1);

				var oModel = new JSONModel( 
						{
							"name": aName[1],
							"firstname": aName[0],
							"initials": sInitials,
							"consent": bConsent,
							"favevents": aFavEvents
						}
					);

					return oModel;

			// if consent was not granted, build and bind an empty model 
			} else {

				var oEmptyModel = new JSONModel( 
					{
						"name": "",
						"firstname": "",
						"initials": "",
						"consent": bConsent,
						"favevents": [ ]
					}
				);

				return oEmptyModel;

			}
		}
		/**********************************************************************************************************************************************************/
	};
});