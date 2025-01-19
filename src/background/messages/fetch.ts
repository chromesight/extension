import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
	try {
		if (!req.body?.url) {
			throw new Error('URL is required');
		}

		const response = await fetch(req.body.url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
		return res.send(result);
	}
	catch (error) {
		console.error('Fetch handler error:', error);
		return res.send({
			error: error instanceof Error ? error.message : 'An unknown error occurred',
			success: false
		});
	}
};

export default handler;