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

	if (event.data.type && (event.data.type === 'load_twitter_widget')) {
		const addedNode = document.getElementById(event.data.addedNodeId);
		if (window.twttr.init) {
			window.twttr.widgets.load(addedNode);
		}
		else {
			window.twttr.ready(twttr => twttr.widgets.load(addedNode));
		}
	}
});