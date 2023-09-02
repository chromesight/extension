import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';

export async function getTopicCreator() {
	try {
		const response = await fetch(`${window.location.pathname}?json=1`);
		const result = await response.json();
		return result.Thread.UserID;
	}
	catch (error) {
		logDebugMessage(error);
	}
}

export default createFeature(
	'markTopicCreator',
	async () => {
		logDebugMessage('Feature Enabled: Mark topic creator\'s posts');

		const userId = await getTopicCreator();

		const elements = document.querySelectorAll(`.post[data-user="${userId}"] .message-top .post-author, .msg-quote[data-user="${userId}"] > p:first-of-type > a:first-of-type`);
		for (const element of elements) {
			const indicator = document.createElement('span');
			indicator.innerHTML = ' <strong>(TC)</strong>';
			element.insertAdjacentElement('afterend', indicator);
		}
	},
);