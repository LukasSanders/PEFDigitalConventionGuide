/* Custom Icons */ 

// Extending Icon class for standard size 
var CustIcon = L.Icon.extend({
    options: {
        iconSize:     [50, 50],
        shadowSize:   [50, 64],
        iconAnchor:   [50, 50],
        shadowAnchor: [4, 62],
        popupAnchor:  [-50, -50]
    }
});

// Defining icons 
var atmIcon = new CustIcon({iconUrl: 'icons/icon_atm.png'});
var traIcon = new CustIcon({iconUrl: 'icons/icon_transport.png'});
var trnIcon = new CustIcon({iconUrl: 'icons/icon_train.png'});
var fodIcon = new CustIcon({iconUrl: 'icons/icon_food.png'});
var barIcon = new CustIcon({iconUrl: 'icons/icon_bar.png'});
var shoIcon = new CustIcon({iconUrl: 'icons/icon_shopping.png'});

// Icons for single purposes (category 'general') 
var incIcon = new CustIcon({iconUrl: 'icons/icon_information.png'});
var phaIcon = new CustIcon({iconUrl: 'icons/icon_pharmacy.png'});
var resIcon = new CustIcon({iconUrl: 'icons/icon_rescue.png'});
var polIcon = new CustIcon({iconUrl: 'icons/icon_police.png'});
var plaIcon = new CustIcon({iconUrl: 'icons/icon_place.png'});
var galIcon = new CustIcon({iconUrl: 'icons/icon_gc.png', iconSize: [50, 50]});

/* General Map Settings */ 
var centerLatitude = 48.8924813;
var centerLongigude = 9.1952492; 
var zoom = 15; 

/* Object Categories */ 

var general     = L.layerGroup();
var food        = L.layerGroup();
var transport   = L.layerGroup();
var atm         = L.layerGroup();
var shopping    = L.layerGroup();



/* Get Center Point and Map Size*/ 

// Read URL parameters 
var urlParams = new URLSearchParams(window.location.search);

// Replace default values with URL parameters, if delivered 
if (urlParams.has('zoom')) {
    zoom = parseFloat(urlParams.get('zoom'));
};

if (urlParams.has('latitude')) {
    centerLatitude = parseFloat(urlParams.get('latitude')); 
};

if (urlParams.has('longitude')) {
    centerLongigude = parseFloat(urlParams.get('longitude')); 
};



/* Load Data and start building map*/ 

loadMapData();


/* AJAX Request */ 
function loadMapData() {
    $.ajax({
        type: "GET",
        url: "markers.csv",
        dataType: "text",
        success: function(data) {buildMap(data);}, 
        error: function (xhr, ajaxOptions, thrownError) {
            alert('An error has occured! Please notify the webmaster.')
            console.log(xhr.status);
            console.log(thrownError);
            } 
        });
}; 


/* Import Data and Build Map*/ 

function buildMap(csvContent) {

    // build array where each line is represented by one item 
    var arrLines = csvContent.split(/\r\n|\n/);

    // variables for calling the Leafy.js marker object 
    var iconLf; 
    var groupLf; 
    var htmlContentLf;
    var polygonLf= []; 
    var polygonRawLf = [];
    var polygonSingleLf = [];

    // loop over all CSV lines, but skip first line with header information 
    for (var i=1; i<arrLines.length-1; i++) {

        // split CSV line into data array 
        var arrData = arrLines[i].split(';');
        
        /* epected position in array: 
         * 0    = name of location 
         * 1    = group 
         * 2    = additional description 
         * 3    = icon name 
         * 4    = latitude  
         * 5    = longitude
         * 6    = website link 
         * 7    = flag for polygons 
         * 8    = coordinate set for polygons 
         * 9    = polygon fill and frame color 
         * 10   = name of custom link 
         */

        iconLf          = arrData[3];
        groupLf         = arrData[1];

        // build first part of HTML content - link to Google Maps 
        htmlContentLf   =  '<a href="https://www.google.de/maps/@' + arrData[4] + ',' + arrData[5] + ',19z" target="_blank">';
        htmlContentLf   =  htmlContentLf + '<b>' + arrData[0] + '</b></a><br>';
        
        // add description 
        htmlContentLf   =  htmlContentLf + arrData[2];

        // usual marker, flag for polygon is not set 
        if (arrData[7] !== 'X') {

            if (arrData[6] !== '') {
                htmlContentLf   =  htmlContentLf + '<br><a href="' + arrData[6] + '" target="_blank">' + arrData[10] + '</a>';
            };

            // add map marker 
            L.marker([parseFloat(arrData[4]), parseFloat(arrData[5])], {icon: eval(iconLf)}).bindPopup(htmlContentLf).addTo(eval(groupLf));

        // polygon marker 
        } else {

            // clear arrays 
            polygonLf = []; 
            polygonRawLf = []; 
            polygonSingleLf = []; 
            
            // get coordinates in a row 
            polygonRawLf = arrData[8].split(',');

            // combine each pair of coordinates 
            var k = 0; 
            var l = 0; 

            // loop over raw values 
            for (var j=0; j<polygonRawLf.length; j++) {

                // push data parsed as float into single coordinate array 
                polygonSingleLf.push(parseFloat(polygonRawLf[j])); 

                // if coordinate array is full, append it to polygon array and reset 
                if (k == 1) { 
                    polygonLf[l] = polygonSingleLf.slice(); 
                    polygonSingleLf = []; 
                    l++; 
                    k = 0; 
                } else {
                    k++;
                };

            }; 

            // add polygon to map
            var polygon = L.polygon(polygonLf, {color: arrData[9], fillColor: arrData[9], fillOpacity: 0.5}).bindPopup(htmlContentLf).addTo(eval(groupLf)); 

        }; 

    }; 

    
    /* Building the map */ 

    // Standard part - please no changes unless you know what you are doing 
	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
        streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

    // Definition of the map 
    var map = L.map('map', {
                center: [centerLatitude, centerLongigude],
                zoom: zoom,
                layers: [grayscale, streets, general, transport, food, atm, shopping]
                });

    // Definition of map layers 
    var baseLayers = {
                    "Grayscale": grayscale,
                    "Streets": streets
                    };

    // Definition of selectable 
    var overlays = {
                    "General": general, 
                    "Food & Drinks": food, 
                    "Transportation": transport, 
                    "ATM": atm, 
                    "Shopping": shopping
                    };

    // Add layer control to map 
    L.control.layers(baseLayers, overlays).addTo(map);

}


