const CACHE_NAME = 'pwa-ui5-todo-v1.0.07';
const RESOURCES_TO_PRELOAD = [
	'index.html',
	'logo.svg',
	'register-worker.js',
    'manifest.json',
    'pwa-manifest.json',
    'controller/About.controller.js',
    'controller/App.controller.js',
    'controller/BaseController.js',
    'controller/EventDetail.controller.js',
    'controller/Events.controller.js',
    'controller/Explore.controller.js',
    'controller/Formatter.js',
    'controller/General.controller.js',
    'controller/GuestDetail.controller.js',
    'controller/Guests.controller.js',
    'controller/Map.controller.js',
    'controller/Overview.controller.js',
    'controller/Restaurant.controller.js',
    'controller/Shop.controller.js',
    'controller/Social.controller.js',
    'controller/Transport.controller.js',
    'controller/User.controller.js',
    'controller/Vendors.controller.js',
];

/*
const cdnBase = 'https://openui5.hana.ondemand.com/resources/';
resourcesToCache = resourcesToCache.concat([
    `${cdnBase}sap-ui-core.js`,
    `${cdnBase}sap/ui/core/library-preload.js`,
    `${cdnBase}sap/ui/core/themes/sap_belize_plus/library.css`,
    `${cdnBase}sap/ui/core/themes/base/fonts/SAP-icons.woff2`,
    `${cdnBase}sap/m/library-preload.js`,
    `${cdnBase}sap/m/themes/sap_belize_plus/library.css`
]);
*/

// Preload some resources during install
self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(RESOURCES_TO_PRELOAD);
		// if any item isn't successfully added to
		// cache, the whole operation fails.
		}).catch(function(error) {
			console.error(error);
		})
	);
});

// Delete obsolete caches during activate
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (key !== CACHE_NAME) {
					return caches.delete(key);
				}
			}));
		})
	);
});

// During runtime, get files from cache or -> fetch, then save to cache
self.addEventListener('fetch', function (event) {
	// only process GET requests
	if (event.request.method === 'GET') {
		event.respondWith(
			caches.match(event.request).then(function (response) {
				if (response) {
					return response; // There is a cached version of the resource already
				}
	
				let requestCopy = event.request.clone();
				return fetch(requestCopy).then(function (response) {
					// opaque responses cannot be examined, they will just error
					if (response.type === 'opaque') {
						// don't cache opaque response, you cannot validate it's status/success
						return response;
					// response.ok => response.status == 2xx ? true : false;
					} else if (!response.ok) {
						console.error(response.statusText);
					} else {
						return caches.open(CACHE_NAME).then(function(cache) {
							cache.put(event.request, response.clone());
							return response;
						// if the response fails to cache, catch the error
						}).catch(function(error) {
							console.error(error);
							return error;
						});
					}
				}).catch(function(error) {
					// fetch will fail if server cannot be reached,
					// this means that either the client or server is offline
					console.error(error);
				});
			})
		);
	}
});