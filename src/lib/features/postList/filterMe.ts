import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import getUserId from '~lib/getUserIdFromTopicBar';

function getTopicId() {
	const topic: HTMLElement = document.querySelector('.post');
	const topicId = topic.dataset.thread;
	return topicId;
}

export default createFeature(
	'filterMe',
	async () => {
		logDebugMessage('Feature Enabled: Filter me');

		const topicBar: HTMLElement = document.querySelector('.userbar:nth-of-type(n+2)');
		const topicId = getTopicId();
		const userId = getUserId(topicBar);

		const link = document.createElement('a');
		link.href = `/thread/${topicId}?filter=${userId}`;
		link.innerText = 'Filter Me';

		const wrapper = document.createElement('span');
		wrapper.insertAdjacentText('beforeend', ' | ');
		wrapper.insertAdjacentElement('beforeend', link);
		topicBar.insertAdjacentElement('beforeend', wrapper);
	},
);