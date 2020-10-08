/************************************************************************************************************************************************************************************
 *  General Data 
 * **********************************************************************************************************************************************************************************/ 

// Directory of map contents for easier customization 
const subDir = ''; 

// Read URL parameters for individual behavior 
var urlParams = new URLSearchParams(window.location.search);


/************************************************************************************************************************************************************************************
 *  Custom Marker Icons 
 * **********************************************************************************************************************************************************************************/ 

var CustIcon = L.Icon.extend({
    options: {
        iconSize:     [50, 50],
        shadowSize:   [50, 64],
        iconAnchor:   [25, 50],
        shadowAnchor: [4, 62],
        popupAnchor:  [0, -50]
    }
});

var iconBath = new CustIcon({iconUrl: subDir + 'icons/icon_bathroom.png'});
var iconHelp = new CustIcon({iconUrl: subDir + 'icons/icon_help.png'});
var iconElev = new CustIcon({iconUrl: subDir + 'icons/icon_elevator.png'});
var iconInfo = new CustIcon({iconUrl: subDir + 'icons/icon_info.png'});
var iconEntr = new CustIcon({iconUrl: subDir + 'icons/icon_entrance.png'});
var iconFood = new CustIcon({iconUrl: subDir + 'icons/icon_food.png'});
var iconShop = new CustIcon({iconUrl: subDir + 'icons/icon_shop.png'});
var iconTag = new CustIcon({iconUrl: subDir + 'icons/icon_tag.png'});
var iconPen = new CustIcon({iconUrl: subDir + 'icons/icon_pen.png'});
var iconFlag = new CustIcon({iconUrl: subDir + 'icons/icon_flag.png'});


/************************************************************************************************************************************************************************************
 *  Layer Groups 
 * **********************************************************************************************************************************************************************************/ 

var groupRoom = L.layerGroup(); 
var groupServ = L.layerGroup(); 
var groupFood = L.layerGroup(); 
var groupBath = L.layerGroup();
var groupElev = L.layerGroup();
var groupHigh = L.layerGroup();


/************************************************************************************************************************************************************************************
 *  POI Markers 
 * **********************************************************************************************************************************************************************************/ 

/* Elevators */
L.marker(L.latLng([ 627, 379.5 ]), {icon: iconElev}).bindPopup("<b>Elevator</b><br>to Vendor Area, Main Hall, Gallery").addTo(groupElev);
L.marker(L.latLng([ 370.5, 186 ]), {icon: iconElev}).bindPopup("<b>Elevator</b><br>to Main Hall, Gallery").addTo(groupElev);
L.marker(L.latLng([ 509.5, 886 ]), {icon: iconElev}).bindPopup("<b>Elevator</b><br>to Vendor Area, Exit, Conference Rooms").addTo(groupElev);
L.marker(L.latLng([ 251, 705 ]), {icon: iconElev}).bindPopup("<b>Elevator</b><br>to Vendor Area, Convention Office, Panel Rooms").addTo(groupElev);

/* Bathrooms */
L.marker(L.latLng([ 334.25, 570.25 ]), {icon: iconBath}).bindPopup("<b>Bathroom</b>").addTo(groupBath);
L.marker(L.latLng([ 400, 150 ]), {icon: iconBath}).bindPopup("<b>Bathroom</b>").addTo(groupBath);
L.marker(L.latLng([ 593, 445 ]), {icon: iconBath}).bindPopup("<b>Bathroom</b><br><i>not fully accessible</i>").addTo(groupBath);

/* Service */
L.marker(L.latLng([ 361.5, 596.5 ]), {icon: iconHelp}).bindPopup("<b>First Aid</b>").addTo(groupServ);
L.marker(L.latLng([ 231.5, 738.5 ]), {icon: iconEntr}).bindPopup("<b>Reception & Box Office</b>").addTo(groupServ);
L.marker(L.latLng([ 246, 347 ]), {icon: iconEntr}).bindPopup("<b>Fast Lane</b><br>only open on Saturday morning").addTo(groupServ);
L.marker(L.latLng([ 225, 632 ]), {icon: iconTag}).bindPopup('<b>PlushieCon Hand-In Counter</b><br>on Saturday<br><a href="../../index.html#/general" target="_parent">further information and hand-in / pick-up times</a>').addTo(groupServ);
L.marker(L.latLng([ 609, 699.5 ]), {icon: iconTag}).bindPopup('<b>PlushieCon Pick-Up Counter</b><br>on Sunday<br><a href="./../index.html#/general" target="_parent">further information and hand-in / pick-up times</a>').addTo(groupServ);
L.marker(L.latLng([ 205.75, 667.5 ]), {icon: iconPen}).bindPopup("<b>Open Art Corner</b><br>drawing for everyone").addTo(groupServ);
L.marker(L.latLng([ 423, 946.5 ]), {icon: iconInfo}).bindPopup('Convention Office').addTo(groupServ);
L.marker(L.latLng([ 711, 22 ]), {icon: iconShop}).bindPopup('<b>Merchandise Shop</b><br>and Goodie Pick-Up<br><a href="./../index.html#/general" target="_parent">show offers</a>').addTo(groupServ);

/* Food & Drinks */
L.marker(L.latLng([ 578, 345]), {icon: iconFood}).bindPopup("<b>KUBUS Restaurant</b><br>with Burger Station").addTo(groupFood);
L.marker(L.latLng([ 480, 917 ]), {icon: iconFood}).bindPopup("<b>Snack Point</b>").addTo(groupFood);
L.marker(L.latLng([ 264, 233 ]), {icon: iconFood}).bindPopup("<b>Snack Point</b>").addTo(groupFood);


/************************************************************************************************************************************************************************************
 *  Room Polygons 
 * **********************************************************************************************************************************************************************************/ 

var polyTheater = L.polygon([
    [710.1875, 255.375],
    [740.75, 238.625],
    [794.625, 255.875],
    [820.125, 338.875],
    [826.6875, 346.3125],
    [812.9375, 465.8125],
    [736.6875, 512.5],
    [683.125, 432.125],
    [685.4375, 420.1875],
    [674.0625, 327.375],
    [710.25, 255.3125]
], { color: 'blue', fillColor: '#0000FF' }).bindPopup('<b>Theatersaal</b><br>Main Hall<br><a href="../../index.html#/eventsinroom/Main Hall" target="_parent">show events</a>').addTo(groupRoom);

var polyWKZ = L.polygon([
    [443.125, 966.125],
    [413.625, 983.625],
    [405.375, 935.625],
    [431.75, 898.75]
], { color: 'red', fillColor: '#f03' } ).bindPopup('<b>Wilhelm-Krämer-Zimmer</b><br>Convention Office').addTo(groupRoom); 

var polySilcher = L.polygon([
    [547, 512.75],
    [546, 601],
    [499, 621.5],
    [498.25, 500.5]
], { color: 'blue', fillColor: '#0000FF' } ).bindPopup('<b>Silchersaal</b><br>Panel Room I<br><a href="../../index.html#/eventsinroom/Panel Room I" target="_parent">show events</a>').addTo(groupRoom);

var polyBueSaII = L.polygon([
    [522.75, 848],
    [535, 909.5],
    [624.25, 855.25],
    [588, 764.25],
    [556.5, 781.75],
    [539.5, 773.5]
], { color: 'blue', fillColor: '#0000FF' }).bindPopup('<b>Bürgersaal II</b><br>Panel Room II<br><a href="../../index.html#/eventsinroom/Panel Room II" target="_parent">show events</a>').addTo(groupRoom);

var polyBueSaI = L.polygon([
    [624.25, 855.25],
    [588, 764.25],
    [556.5, 781.75],
    [539.5, 773.5],
    [553, 629.5],
    [642.25, 575],
    [691.5, 815.5]
], { color: 'yellow', fillColor: '#FFFF00' } ).bindPopup('<b>Bürgersaal I</b><br>Party Hall<br><a href="../../index.html#/eventsinroom/Party Hall" target="_parent">show sets</a>').addTo(groupRoom);

var polyStage = L.polygon([
    [740.75, 238.625],
    [794.625, 255.875],
    [770.25, 146.75]
], { color: 'yellow', fillColor: '#FFFF00' } ).bindPopup('<b>Theaterfoyer</b><br>Gala Ball Stage<br><a href="../../index.html#/eventsinroom/Gala Ball Stage" target="_parent">show sets</a>').addTo(groupRoom);

var polyAuto = L.polygon([
    [722, 60],
    [694.75, 55],
    [685, 91.25],
    [713.75, 112]
], { color: 'yellow', fillColor: '#FFFF00' } ).bindPopup('<b>Theaterfoyer</b><br>Autograph Session Area<br><a href="../../index.html#/eventsinroom/Main Hall" target="_parent">show sessions</a>').addTo(groupRoom);

var polyGames = L.polygon([
[376.25, 616.5],
[385.25, 659],
[407.75, 645.5],
[388, 546.75],
[365.25, 561]
], { color: 'yellow', fillColor: '#FFFF00' } ).bindPopup('<b>Games Room</b><br>').addTo(groupRoom);

var polyKaraoke = L.polygon([
[376.25, 616.5],
[385.25, 659],
[346, 682.75],
[335.75, 639.75]
], { color: 'yellow', fillColor: '#FFFF00' } ).bindPopup('<b>Karaoke Room</b><br>').addTo(groupRoom);

var polyWorkshop = L.polygon([
[346, 682.75],
[335.75, 639.75],
[303.5, 658.5],
[295, 683.25],
[280, 688.25],
[286.25, 719.25]
], { color: 'yellow', fillColor: '#FFFF00' } ).bindPopup('<b>Workshop Room</b><br><a href="../../index.html#/eventsinroom/Workshop Room" target="_parent">show events</a>').addTo(groupRoom);


/************************************************************************************************************************************************************************************
 *  Build Map 
 * **********************************************************************************************************************************************************************************/ 

var mapLayers = []; 

// Check if another single highlighted point should  be added to the map 
if (urlParams.get('singlePoint') == 'X' && urlParams.has('singlePointLat') && urlParams.has('singlePointLng')) {
    
    var sPLat = urlParams.get('singlePointLat');
    var sPLng = urlParams.get('singlePointLng');
    var sPDes = urlParams.get('singlePointTxt');

    L.marker(L.latLng([ sPLat, sPLng ]), {icon: iconFlag}).bindPopup(sPDes).addTo(groupHigh);

    mapLayers[0] = groupHigh;
} 

// Check if single layer should be highlighted or all layers should be shown 
else if  (urlParams.get('highlightLayer') == 'X' && urlParams.has('visibleLayer')) {
    mapLayers[0] = eval(urlParams.get('visibleLayer'));
} else { mapLayers = [groupRoom, groupBath, groupElev, groupServ, groupFood] }; 



var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -1,
    layers: mapLayers
});

// Definition of selectable layers 
var overlays = {
        "Event Rooms": groupRoom, 
        "General & Service": groupServ,
        "Food & Drinks": groupFood,
        "Elevators": groupElev, 
        "Bathrooms": groupBath
        };

// Add layer control to map 
L.control.layers({}, overlays).addTo(map);

// Map units equals pixel count for better usability 
var bounds = [[0,0], [1000,1000]];
var image = L.imageOverlay(subDir + 'plan.svg', bounds).addTo(map);

map.fitBounds(bounds);


/************************************************************************************************************************************************************************************
 *  Event Handlers 
 * **********************************************************************************************************************************************************************************/ 

map.on('click', onMapClick);

function onMapClick(e) {
    console.log('Clicked at position: ' + e.latlng.toString());

    /*L.popup()
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);*/
}