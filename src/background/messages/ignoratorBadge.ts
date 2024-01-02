import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
	const number = req.body.hiddenPosts;
	if (parseInt(number)) {
		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
		chrome.action.setBadgeBackgroundColor({
			color: '#9688F1',
			tabId: tab.id,
		});
		chrome.action.setBadgeText({
			text: number,
			tabId: tab.id,
		});
	}

	return res.send(null);
};

export default handler;