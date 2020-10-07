/**
 * Register the service worker
 */

window.onload = () => {
	'use strict';

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('./service-worker.js')
			.then(function () { console.log('Service Worker Registered'); });
	}
}



