**Project retired!** After evaluation at GalaCon 2022, we have decided to use a different approach for the Digital Convention Guide. The project files will still be available for you, but the public demo is no longer reachable. Thanks to all supporters and testers!

# Pony Events Federation - DigitalConventionGuide

Digital convention guide for GalaCon (www.galacon.eu) built mainly on SAP OpenUI5 and Leaflet.js. The application is currently still under development and should be extended to a PWA in it's final state. 

## Features 

### Venue Map 

The guide features a venue map built on Leaflet.js. All rooms and POIs are marked and arranged in semantic layers. Users can either use the built-in layer selection of Leaflet.js or a touch-friendly filter bar. 

Some rooms, especially event rooms, feature pop-ups which link to respective detail pages. The pop-ups for event rooms link to the event list which is then filtered by the room name so that it only shows events running in the selected room. 

The venue map can be opened in full-page mode independently from the app. The map application itself is controlled via URL parameters and can be called with pre-selected layers (this is how the filter works). With special parameters, a single POI can be marked on the map. This feature is used to highlight vendor stalls when linked from the vendor list. 

### City Map 

Another map built on Leaflet.js showing the surroundings. POIs are marked and show pop-ups with links when pressed. 

The city map may also be opened in full-screen mode independently from the app. It can be controlled using URL parameters (especially for setting the map center). 

### Event List 

The event ist is a simple list of all events with filter options. It can be called from different routes to preset filters e.g. for rooms or guests. A search function for the title is included. 

Based on the starting time, a marker shows the current state of the event (Scheduled, Starting Soon, Running or Entry Closed). It is possible to hide past events with a toggle filter button. 

Klicking on an entry leads to a detail page showing event details and involved guests. 

The user can mark events as favorites (if cookies are allowed) which will then be shown under "My favorite events" or after filtering by favorites from the event list. Favorite events are stored locally in a cookie. 

The app will check regularly if any marked favorite events are starting soon and will notify the user with a pop-up message (Message Toast). Push messages are currently not implemented. 

### List of Guests and Panelists 

Another simple list displaying all current guests and panelists featuring a search functionality. Klicking on an entry leads to a detail page including a link to the event list which is then filtered so that it only shows events which involve the selected guest. 

### Restaurant Menu 

A grouped list showing the menu of the venue caterer. Furthermore, general information and a link to the map with the restaurant in focus are included. 

### Merchandise List 

A grouped list showing the merchandise items offered at the convention shop. Furthermore, general information and a link to the map with the shop location in focus are included. 

### Vendor List 

The vendor list shows all vendors. It features searching by name and filtering by product category. Furthermore, it is possible to only select vendors who offer commissions. 

Clicking on a list item links to the map highlighting the location of the vendor stall. 

### Public Transport 

This landing page features an embedded trip planner for local public transport as well as links to bus and train services, a phone link to a cab company and a link to a list of upcoming departures from Ludwigsbug station. 

### User Settings 

The app only stores data locally using cookies which are administered via a cookie handler. This way, the app works without any kind of tracking or data processing on our side. Given the user has granted consent, it is possible to store the user name and favorite events (except for storing favorites, there is currently no special use). 

All user data (including favorite events) can be manually transfered to other devices using two methods: Converting it to an encoded string and copy-pasting it or downloading it as a data file. 

The data file contains a CSV string (text file). For the encoded string, this CSV string is simply converted to hexadecimal code. The import functions read (and decode) these values and store them in a cookie on the new device.  

### Other Content 

The app also features static content like general information and social media links. 

## Known Issues and TODO 

The app is currently in an early state of development. It lacks PWA and push notification functionality as well as a proper backend (it reads data from text files). All data is basic mock data. 

We would like to include the following features before moving to beta testing: 

- Full PWA functionality with offline compatibility 
- Push notifications for upcoming favorite events 
- Backend (get data from actual database) 
- Functionality for on-site screens 
- Notifications and news 
- Favorites for vendors and guests 
- Optimize the venue map for displaying and highlighting vendor stalls
- Optimize the design 
- Add internationalization 

Anyways, we are open for any suggestions and error notifications. Thank you for your support! 
