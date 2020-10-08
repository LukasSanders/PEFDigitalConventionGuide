sap.ui.define([
	"./BaseController",
    "sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/HTML"
], function (Controller, MessageToast, MessageBox, HTML) {
	"use strict";

	return Controller.extend("pef.Philomena.controller.Ticket", {

		/**********************************************************************************************************************************************************/
		/* HOOK METHODS */ 
		/**********************************************************************************************************************************************************/
		onInit: function () {

			// load QR code, if a value exists 
			this._setQrCode();

		},
		/**********************************************************************************************************************************************************/
		/* EVENT HANDLERS */
		/**********************************************************************************************************************************************************/
		onImport: function (oEvent) { 

			this.codeScanned = false;
			var container = new sap.m.VBox({
				"width": "512px",
				"height": "384px"
			});
			var button = new sap.m.Button("", {
				text: "Cancel",
				type: "Reject",
				press: function() {
					dialog.close();
				}
			});
			var dialog = new sap.m.Dialog({
				title: "Scan your ticket QR code",
				content: [
					container,
					button
				]
			});
			dialog.open();
			var video = document.createElement("video");
			video.autoplay = true;
			var that = this;
			qrcode.callback = function(data) {
				if (data !== "error decoding QR Code") {
					this.codeScanned = true;
					that._oScannedInspLot = data;
					console.log(data);
					sap.m.MessageBox.success("Code scanned!");
					that._setData(data);
					dialog.close();
				
				}
			}.bind(this);

			var canvas = document.createElement("canvas");
			canvas.width = 512;
			canvas.height = 384;
			navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						facingMode: "environment",
						width: {
							ideal: 512
						},
						height: {
							ideal: 384
						}
					}
				})
				.then(function(stream) {
					video.srcObject = stream;
					var ctx = canvas.getContext('2d');
					var loop = (function() {
						if (this.codeScanned) {
							//video.stop();
							return;
						} else {
							ctx.drawImage(video, 0, 0);
							setTimeout(loop, 1000 / 30); // drawing at 30fps
							qrcode.decode(canvas.toDataURL());
						}
					}.bind(this));
					loop();
				}.bind(this))
				.catch(function(error) {
					sap.m.MessageBox.error("Unable to get Video Stream");
				});

			container.getDomRef().appendChild(canvas);
            
		},
		/**********************************************************************************************************************************************************/
        /* UTILITY METHODS */ 
		/**********************************************************************************************************************************************************/
		_setData: function(sData) {

			// save imported ticket code in cookies and model 

			// check if code is valid - must be a 18 digit number starting with 1 - 9 
			var sRegex = /[1-9]{1}[0-9]{17}/i;

			if (!sData.match(sRegex)) {
				MessageBox.error("Invalid ticket number. Make sure to scan the correct code!");
				return;
			}

			// if consent was given, set the imported values to cookies 
			if (this.getCookieHandler().checkConsent()) {

				// save data in cookie 
				this.getCookieHandler().setValue(this.getCookieHandler().getFullHandle() + "_TICKETCODE", sData);
				MessageToast.show("Data saved!");

				// update QR code display 
				this._setQrCode();

			// if consent was not given, display an error message 
			} else {

				MessageBox.error("Ticket data cannot be saved if cookies are not allowed.", {
					actions: ["Allow cookies", MessageBox.Action.CLOSE],
					emphasizedAction: "Allow cookies",
					onClose: function (sAction) {

						
						if (sAction == "Allow cookies") {

							// grant cookie consent 
							this.getCookieHandler().setConsentCookie(true);

							// save data in cookie 
							this.getCookieHandler().setValue(this.getCookieHandler().getFullHandle() + "_TICKETCODE", sData);
							MessageToast.show("Data saved!");

							// update QR code display 
							this._setQrCode();

						} else {

							MessageToast.show("Action canceled!");

						}

					}
				});
			}
		},
		/**********************************************************************************************************************************************************/
		_setQrCode: function() {

			// get ticket number via cookie handler 
			var sTicketNo = this.getCookieHandler().getValue(this.getCookieHandler().getFullHandle() + "_TICKETCODE");
			var sHtmlContent = "";

			if (sTicketNo == "") {
				sHtmlContent = `<span style="font-family: Verdana, Geneva, sans-serif">No ticket number found</span>`;
			} else {

				// TODO must be offline for PWA 
				sHtmlContent = `<iframe height="400px" width="100%" src="https://chart.googleapis.com/chart?cht=qr&choe=UTF-8&chld=L|0&chs=200x200&chl=${sTicketNo}" frameborder="no scrolling="no"></iframe>`;
			}

			// get html container control 
			var oHtml = this.byId("htmlControl");

			// if no such thing exists, create one with the id 
			if (!oHtml) {
				var sId = this.createId("htmlControl");
				oHtml = new HTML(sId, {
					
					// embed map in iframe 
					content: sHtmlContent,
					preferDOM : false,
				});

				// get VBox which should hold the control and add the html container control 
				var oVBox= this.getView().byId("qrContainer");
				oVBox.addItem(oHtml);

				console.log("API call for QR code generation executed in iFrame...");
			}
		}
		/**********************************************************************************************************************************************************/
	});
});