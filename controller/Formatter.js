sap.ui.define([], function() {
    "use strict";
    
    /* 
     * Attention: 
     * The following functions look heavily like something that could/should be modularized because they are mostly doing the same just returning 
     * the answer in a different style. 
     * There was an attempt which lead to the following issue: 
     * During filtering, 'this' is not really a reference to this class, so it is not possible to call functions of this formatter here by 
     * using 'this.function()'. 
     * For any unknown reason, 'this' references the control which requested the formatted value which is the label or object page. 
     * It is also not possible to require this formatter itself and call it because this will simply be ignored. 
     * The only possibility to call a function of this formatter from this formatter itself is: 
     * 1. defining a function 'getFormatter()' in all controllers of each and every view which use this formatter 
     * 2. get through the DOM to access controller of the the parent-parent-parent 
     * 3. call the before-mentioned function to get the formatter 
     * 4. call the desired method 
     * 
     * This leads to: 
     * var oFormatter = this.getParent().getParent().getParent().oController.getFormatter(); 
     * switch (oFormatter._getEventStatus(sDate)) { ...} 
     * 
     * This of course only works if the requesting control is exactly 3 levels below the view and we have to remember not only this, but also 
     * defining the getFormatter()-function in every view controller. 
     * 
     * Because this is bullshit, the following formatting functions are repititive as they are until the developer finds another way to do this. 
     */

	return {
		/**********************************************************************************************************************************************************/
		/* FORMATTING METHODS FOR EVENT VIEWS */
		/**********************************************************************************************************************************************************/
		eventbeginstatus :  function (sDate) {

            var sCode = 0;

            // get current time as a timestamp 
            var dNow = Date.parse(Date());

            // get the timestamp for the given date 
            var dStart = Date.parse(sDate);

            // calculate the difference between start time and current time 
            var iDiff = dStart - dNow;

            // convert difference (milliseconds) in hours as float 
            var fHours = iDiff / 60 / 60 / 1000;

            // determine the status 
            if (fHours > 0.5) {
                // difference is positive and greater than 30 minutes 
                sCode = 0;
            } else if (fHours > 0) {
                // difference is positive, but event is starting in 30 minutes or less 
                sCode =  1;
            } else if (fHours > -0.25){
                // difference is negative; event has started, but has been running no longer than 15 minutes 
                sCode =  2;
            } else {
                // event is over or no entry is granted anymore 
                sCode =  3;
            }

            // evaluate time difference and return a matching description to display in the object list 
            switch (sCode) {
                case 0:
                    return "Scheduled";
                    break; 
                case 1: 
                return "Starting soon";
                    break;
                case 2:
                    return "Running";
                    break;
                case 3:
                    return "Entry closed";
                    break;
            }
        },
        /**********************************************************************************************************************************************************/
		eventbeginstatusstate :  function (sDate) {

            var sCode = 0;

            // get current time as a timestamp 
            var dNow = Date.parse(Date());

            // get the timestamp for the given date 
            var dStart = Date.parse(sDate);

            // calculate the difference between start time and current time 
            var iDiff = dStart - dNow;

            // convert difference (milliseconds) in hours as float 
            var fHours = iDiff / 60 / 60 / 1000;

            // determine the status 
            if (fHours > 0.5) {
                // difference is positive and greater than 30 minutes 
                sCode = 0;
            } else if (fHours > 0) {
                // difference is positive, but event is starting in 30 minutes or less 
                sCode =  1;
            } else if (fHours > -0.25){
                // difference is negative; event has started, but has been running no longer than 15 minutes 
                sCode =  2;
            } else {
                // event is over or no entry is granted anymore 
                sCode =  3;
            }

            // evaluate time difference and return a matching state for the sap.m.ObjectStatus control  
            switch (sCode) {
                case 0:
                    return "None";      // text is gray 
                    break; 
                case 1: 
                return "Success";       // text is greem 
                    break;
                case 2:
                    return "Warning";   // text is yellow 
                    break;
                case 3:
                    return "Error";     // text is red 
                    break;
            }
        },
        /**********************************************************************************************************************************************************/
		eventbeginstatusicon :  function (sDate) {

            var sCode = 0;

            // get current time as a timestamp 
            var dNow = Date.parse(Date());

            // get the timestamp for the given date 
            var dStart = Date.parse(sDate);

            // calculate the difference between start time and current time 
            var iDiff = dStart - dNow;

            // convert difference (milliseconds) in hours as float 
            var fHours = iDiff / 60 / 60 / 1000;

            // determine the status 
            if (fHours > 0.5) {
                // difference is positive and greater than 30 minutes 
                sCode = 0;
            } else if (fHours > 0) {
                // difference is positive, but event is starting in 30 minutes or less 
                sCode =  1;
            } else if (fHours > -0.25){
                // difference is negative; event has started, but has been running no longer than 15 minutes 
                sCode =  2;
            } else {
                // event is over or no entry is granted anymore 
                sCode =  3;
            }

            // evaluate time difference and return the matching icon 
            switch (sCode) {
                case 0:
                    return "sap-icon://lateness";           // hour glass 
                    break; 
                case 1: 
                return "sap-icon://pending";                // clock 
                    break;
                case 2:
                    return "sap-icon://message-warning";    // warning symbol 
                    break;
                case 3:
                    return "sap-icon://locked";             // lock 
                    break;
            }
        },
        /**********************************************************************************************************************************************************/
		eventbegincolor :  function (sDate) {
            
            var sCode = 0;

            // get current time as a timestamp 
            var dNow = Date.parse(Date());

            // get the timestamp for the given date 
            var dStart = Date.parse(sDate);

            // calculate the difference between start time and current time 
            var iDiff = dStart - dNow;

            // convert difference (milliseconds) in hours as float 
            var fHours = iDiff / 60 / 60 / 1000;

            // determine the status 
            if (fHours > 0.5) {
                // difference is positive and greater than 30 minutes 
                sCode = 0;
            } else if (fHours > 0) {
                // difference is positive, but event is starting in 30 minutes or less 
                sCode =  1;
            } else if (fHours > -0.25){
                // difference is negative; event has started, but has been running no longer than 15 minutes 
                sCode =  2;
            } else {
                // event is over or no entry is granted anymore 
                sCode =  3;
            }

            // evaluate time difference and return the matching semantic color 
            // property colorScheme for control sap.tnt.InfoLabel 
            switch (sCode) {
                case 0:
                    return 7;   // some kind of turquoise-ish green 
                    break; 
                case 1: 
                    return 8;   // light green 
                    break;
                case 2:
                    return 1;   // slightly brown-ish orange 
                    break;
                case 3:
                    return 2;   // dark red with an orange hue 
                    break;
            }
        },
        /**********************************************************************************************************************************************************/
        eventday : function (sDate) {

            // get the current date 
            var dToday = new Date();

            // parse the given date 
            var dEventBegin = new Date(Date.parse(sDate));

            // when the event is not sharing same month or year, it is neither today nor tomorrow 
            // false match on same day number in different month eliminated 
            if (dEventBegin.getFullYear() !== dToday.getFullYear() || dEventBegin.getMonth() !== dToday.getMonth()) {
                return dEventBegin.toDateString();

            // same month and year, day number matches so it is today 
            } else if  (dEventBegin.getUTCDay() === dToday.getUTCDay()) {
                return "Today"; 

            // same month and year, day number matches today + 1 so tomorrow 
            } else if ( dEventBegin.getUTCDay() === dToday.getUTCDay + 1) {
                return "Tomorrow"; 

            // same month, but any other day so just return the date 
            } else {
                return dEventBegin.toDateString();
            };

        },
        /**********************************************************************************************************************************************************/
        /* FORMATTING METHODS FOR VENDOR VIEWS */ 
        /**********************************************************************************************************************************************************/
        vendorurllink: function(sUrl) {

            // check if the url is supplied and return a link text if yes 
            if (sUrl != "") {
                return "Click to visit website";
            } else {
                return "";
            }
        },
        /**********************************************************************************************************************************************************/
        vendorurlicon: function(sUrl) {

            // check if the url is supplied and return a link text if yes 
            if (sUrl != "") {
                return "sap-icon://chain-link";
            } else {
                return "";
            }
        }
    }
    /**********************************************************************************************************************************************************/
},  /* bExport= */ true);