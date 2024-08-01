import type { PlasmoMessaging } from '@plasmohq/messaging';

let hiddenItems = 0;

const setBadge = (text: string, tabId: number) => {
	chrome.action.setBadgeBackgroundColor({
		color: '#9688F1',
		tabId: tabId,
	});
	chrome.action.setBadgeText({
		text: text,
		tabId: tabId,
	});
};

// Reset extension badge on navigation
chrome.tabs.onUpdated.addListener(tabId => {
	hiddenItems = 0;
	setBadge('', tabId);
});

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
	const entries = Object.values(req.body);

	entries.forEach((entry: string) => {
		hiddenItems += parseInt(entry);
	});

	if (hiddenItems > 0) {
		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
		setBadge(hiddenItems.toString(), tab.id);
	}

	return res.send(null);
};

export default handler;