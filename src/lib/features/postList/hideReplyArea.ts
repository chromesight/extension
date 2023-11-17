import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';

const quoteLinkSelector = '.message-top > a[href*="/quote/"], a[href*="#reply-area"]';
const replyArea: HTMLElement = document.querySelector('#reply-area');
const replyContent: HTMLTextAreaElement = replyArea.querySelector('#reply-content');

const showReplyArea = () => {
	replyArea.style.display = 'inherit';
	replyContent.focus();
};

const hideReplyArea = () => {
	if (document.activeElement !== replyContent) {
		replyArea.style.display = 'none';
	}
};

const toggleReplyArea = () => {
	if (replyArea.style.display === 'none') {
		showReplyArea();
	}
	else {
		hideReplyArea();
	}
};

const handleToggleReplyArea = (event) => {
	if (event.key === '`') toggleReplyArea();
};

export default createFeature(
	'hideReplyArea',
	async () => {
		logDebugMessage('Feature Enabled: Hide reply box until backtick');

		document.addEventListener('keydown', handleToggleReplyArea);

		const links = document.querySelectorAll(quoteLinkSelector);
		links.forEach(link => link.addEventListener('click', showReplyArea));

		replyArea.style.display = 'none';
	},
	async (addedNode) => {
		const link = addedNode.querySelector(quoteLinkSelector);
		link.addEventListener('click', showReplyArea);
	},
);