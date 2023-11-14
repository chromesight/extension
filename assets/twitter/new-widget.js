window.addEventListener('message', (event) => {
	if (event.source !== window) {
		return;
	}

	if (event.data.type && (event.data.type === 'load_twitter_widgets')) {
		const addedNode = document.getElementById(event.data.addedNodeId);
		if (window.twttr.init) {
			window.twttr.widgets.load(addedNode);
		} 
		else {
			window.twttr.ready(twttr => twttr.widgets.load(addedNode));
		}
	}
});