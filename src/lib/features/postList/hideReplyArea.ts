import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';

const quoteLinkSelector = '.message-top > a[href*="/quote/"]';
const replyArea: HTMLElement = document.querySelector('#reply-area');
const replyContent: HTMLTextAreaElement = replyArea.querySelector('#reply-content');

const showReplyArea = () => {
	replyArea.style.display = 'inherit';
	replyContent.focus();
};
const toggleReplyArea = () => {
	if (replyArea.style.display === 'none') {
		showReplyArea();
	}
	else {
		replyArea.style.display = 'none';
	}
};

export default createFeature(
	'hideReplyArea',
	async () => {
		logDebugMessage('Feature Enabled: Hide reply box until keyboard shortcut activated');

		const links = document.querySelectorAll(quoteLinkSelector);
		links.forEach(link => link.addEventListener('click', showReplyArea));
		document.addEventListener('keydown', (event) => {
			if (event.key === '`') toggleReplyArea();
		});

		replyArea.style.display = 'none';
	},
	async (addedNode) => {
		const link = addedNode.querySelector(quoteLinkSelector);
		link.addEventListener('click', showReplyArea);
	},
);