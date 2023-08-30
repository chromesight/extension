import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';

export default createFeature(
	'hideReplyArea',
	async () => {
		logDebugMessage('Feature Enabled: Hide reply box until keyboard shortcut activated');

		const replyArea: HTMLElement = document.querySelector('#reply-area');
		const replyBox: HTMLTextAreaElement = replyArea.querySelector('#reply-box');
		const links = document.querySelectorAll('.message-top > a[href*="/quote/"]');

		const showReplyArea = () => {
			replyArea.style.display = 'inherit';
			replyBox.focus();
		};
		const toggleReplyArea = () => {
			if (replyArea.style.display === 'none') {
				showReplyArea();
			}
			else {
				replyArea.style.display = 'none';
			}
		};
		links.forEach(link => link.addEventListener('click', showReplyArea));
		document.addEventListener('keydown', (event) => {
			if (event.key === '`') toggleReplyArea();
		});

		replyArea.style.display = 'none';
	},
);