import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';

let userId: string;

export async function getTopicCreator(): Promise<string | null> {
	try {
		const response = await fetch(`${window.location.pathname}?json=1`);
		const result = await response.json();
		return result.Thread.UserID;
	}
	catch (error) {
		logDebugMessage(error);
	}
	return null;
}

function handlePostHeader(postHeader: Element) {
	const indicator = document.createElement('span');
	indicator.innerHTML = ' <strong>(TC)</strong>';
	postHeader.insertAdjacentElement('afterend', indicator);
}

export default createFeature(
	'markTopicCreator',
	async () => {
		logDebugMessage('Feature Enabled: Mark topic creator\'s posts');

		userId = await getTopicCreator();

		const postHeaders = document.querySelectorAll(`.post[data-user="${userId}"] .message-top .post-author, .msg-quote[data-user="${userId}"] > p:first-of-type > a:first-of-type`);
		for (const postHeader of postHeaders) {
			handlePostHeader(postHeader);
		}
	},
	async (addedPost) => {
		console.log(addedPost.dataset);
		if (addedPost.dataset['user'] === userId) {
			const postHeaders = addedPost.querySelectorAll(`.message-top .post-author, .msg-quote[data-user="${userId}"] > p:first-of-type > a:first-of-type`);
			for (const postHeader of postHeaders) {
				handlePostHeader(postHeader);
			}
		}
	},
);