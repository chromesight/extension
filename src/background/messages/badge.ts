import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
	const ignoratedItems = req.body.ignoratedItems ?? '0';
	const keywordItems = req.body.keywordItems ?? '0';
	const hiddenItems = parseInt(ignoratedItems) + parseInt(keywordItems);

	if (hiddenItems) {
		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
		chrome.action.setBadgeBackgroundColor({
			color: '#9688F1',
			tabId: tab.id,
		});
		chrome.action.setBadgeText({
			text: hiddenItems.toString(),
			tabId: tab.id,
		});
	}

	return res.send(null);
};

export default handler;