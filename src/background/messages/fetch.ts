import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
	try {
		const response = await fetch(req.body.url);
		const result = await response.json();
		return res.send({
			...result,
		});
	}
	catch (error) {
		console.log(error);
	}

	return res.send(null);
};

export default handler;