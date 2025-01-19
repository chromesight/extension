import type { PlasmoCSConfig } from 'plasmo';

// Content script configuration
export const config: PlasmoCSConfig = {
	matches: ['*://*.websight.blue/thread/*', '*://*.websight.blue/pm/*'],
	world: 'MAIN',
};

window.addEventListener('message', (event) => {
	if (event.source !== window) {
		return;
	}

	if (event.data.type && (event.data.type === 'load_bsky_widget')) { 
		if (window.bluesky.scan) {
			const addedNode = document.getElementById(event.data.id);
			window.bluesky.scan(addedNode);
		}
	}
});