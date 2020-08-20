sap.ui.define([	], function() {

    return {
        
    
            /* Attributes as getter functions in UI5 context */
    
            getDefaultExpiry: function() { return 30 },

            getPrefix: function() { 
                return "PEF_";
            },

            getEvent: function() { 
                return "GALACON"; 
            },

            getHandle: function() { 
                return "2021";

            },
            
            getVerbosity: function() { return "all" },

    
            /* Ulility Methods */

    
            // generate expiration timestamp 
            getExpiryString: function (iDuration) {
                // set duration to 30 days if none specified 
                if (iDuration == 0) {
                    iDuration = this.getDefaultExpiry();
                }
                ;
                var dExpiry = new Date();
                dExpiry.setTime(dExpiry.getTime() + (iDuration * 24 * 60 * 60 * 1000));
                return "expires=" + dExpiry.toUTCString();
            },

            // convert array to csv for storage 
            toCSVString: function (arrValues) {
                var sValue = "";
                sValue = arrValues.join(",");
                return sValue;
            },

            // convert csv string to array 
            toArray: function (sValue) {
                var arrValues = sValue.split(",");
                return arrValues;
            },

            // get full user name 
            getName: function () {
                var sFullName = this.getValue(this.getFullHandle() + "_USERNAME");
                var aName = sFullName.split("--");
                return [aName[0], aName[1]];
            },

            // set full user name 
            setName: function (sName, sForename, bUpdateCookie) {
    
                if (bUpdateCookie == true) {
                    var sFullName = sForename + "--" + sName;
                    return this.setValue(this.getFullHandle() + "_USERNAME", sFullName, this.getDefaultExpiry());
                } else {
                    return true; 
                };
            },

            // get full handle 
            getFullHandle: function () {
                // handle as a preset always follows the following scheme: 
                // PEF_EVENT_HANDLE_COOKIENAME 
                return this.getPrefix() + this.getEvent() + "_" + this.getHandle();
            },

            // logger for events 
            log: function (sMsg, sType) {
    
                switch(this.getVerbosity()) {
                    case "errors":
                        // show only errors 
                        if (sType == "E") {
                            console.log("PEF Cookie Handler: " + sMsg);
                        };
                        break;
                    case "warnings":
                        if (sType == "E" || sType == "W") {
                            console.log("PEF Cookie Handler: " + sMsg);
                        };
                        break;
                    case "all":
                        // show everything 
                        console.log("PEF Cookie Handler: " + sMsg);
                        break;
                    default:
                        // show everything by default 
                        console.log("PEF Cookie Handler: " + sMsg);
                };
                
            },
    
    
            /* Service Methods */
    
            // set consent for current event and handle 
            setConsentCookie: function (bConsent) {
                var sCookieName = this.getFullHandle() + "_" + "CONSENT";
                var sConsent = "";
                if (bConsent === true) {
                    sConsent = "true";
                    this.log("Cookie consent granted");
                }
                else {
                    sConsent = "false";
                    this.log("Cookie consent revoked");
                }
                ;
                // hard set overwrites old value, so no need for extra invoking method 
                this.setValue(sCookieName, sConsent, this.getDefaultExpiry());
            },

            // check if consent was given 
            checkConsent: function () {
                if (this.getValue(this.getFullHandle() + "_" + "CONSENT") == "true") {
                    this.log("Consent asserted");
                    return true;
                }
                else {
                    this.log("Consent assertion failed", "W");
                    this.log("Consent cookie and clearing will ignore this assertion failure");
                    return false;
                }
                ;
            },

            // append value to generic array cookie 
            appendArrValue: function (sCookieName, sValue) {
                var arrValues = this.toArray(this.getValue(sCookieName));
                arrValues.push(sValue);
                return this.setValue(sCookieName, this.toCSVString(arrValues), this.getDefaultExpiry());
            },

            // delete value from generic array cookie 
            deleteArrValue: function (sCookieName, sValue) {
                var arrValues = this.toArray(this.getValue(sCookieName));
                var arrNewValues = [];
                for (var i=0; i<arrValues.length; i++) {

                    // only push values to new array that do not match the pattern to exclude 
                    if (arrValues[i] != sValue && arrValues[i] != "") {
                        arrNewValues.push(arrValues[i]);
                    };
                };

                return this.setValue(sCookieName, this.toCSVString(arrNewValues), this.getDefaultExpiry());
            },

            // get value of generic cookie 
            getValue: function (sCookieName) {
    
                var sFullName = sCookieName + "=";
                var oDecodedCookie = decodeURIComponent(document.cookie);
                var arrCookieContents = oDecodedCookie.split(';');
                for (var i = 0; i < arrCookieContents.length; i++) {
                    var oCookieContent = arrCookieContents[i];
                    while (oCookieContent.charAt(0) == ' ') {
                        oCookieContent = oCookieContent.substring(1);
                    }
                    if (oCookieContent.indexOf(sFullName) == 0) {
                        this.log("Read and returned value " + oCookieContent.substring(sFullName.length, oCookieContent.length) + " of cookie " + sCookieName);
                        return oCookieContent.substring(sFullName.length, oCookieContent.length);
                    }
                }
                return "";
            },

            // set value of generic cookie 
            setValue: function (sCookieName, sValue, sExpiry) {
                if (this.checkConsent() === false && sValue !== "" && sCookieName !== this.getFullHandle() + "_" + "CONSENT") {
                    // if consent was not granted, cookie can only be cleared and not set to a specific value 
                    // the consent cookie of course can always be set 
                    this.log("Cannot set cookie unless consent was granted", "E");
                    return false;
                }
                else {
                    document.cookie = sCookieName + "=" + sValue + ";" + this.getExpiryString(sExpiry) + ";path=/";
                    this.log("Cookie " + sCookieName + " set to value " + sValue + ", expires in " + sExpiry + " days");
                    return true;
                }
                ;
            },

            // clear cookie value 
            clearValue: function (sCookieName) {
                // clear by overwriting with null value 
                return this.setValue(sCookieName, "", 1);
            },

            // check if a specific cookie is set 
            isSet: function(sCookieName) {
                if (document.cookie.includes(sCookieName + "=")) {
                    return true; 
                } else {
                    return false;
                }; 
            },

            // get array of all cookies 
            getAll: function() {
    
                // get list of all cookies (COOKIE1=VALUE1;COOKIE2=VALUE2...)
                var arrCookies = document.cookie.split(";");
                var arrValuePair = [];
                var arrCookieSet = [];
    
                for (var i = 0; i < arrCookies.length; i++) {
    
                    // split string in key-value-pairs ([COOKIE1,VALUE1])
                    arrValuePair = arrCookies[i].split("=");
    
                    // delete any whitespaces in the key 
                    arrValuePair[0] = arrValuePair[0].replace(/\s+/g, '');
    
                    // push into string 
                    arrCookieSet.push(arrValuePair);
                };
    
                return arrCookieSet;
            },

            clearAll: function() {
    
                var arrCookies = this.getAll(); 
    
                for (var i = 0; i < arrCookies.length; i++) {
    
                    if ( arrCookies[i][0].substring(0,4) == this.getPrefix()) {
                        this.clearValue(arrCookies[i][0]);
                    };
                };
    
            
        }
    };

});
