import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import insertStyles from '~lib/insertStyles';
import { CSS_PREFIX } from '~constants';

const className = `${CSS_PREFIX}emoji-wrap`;

const wrapEmojis = (element: HTMLElement) => {
	const pattern = /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu;
	const regex = new RegExp(pattern);
	element.innerHTML = element.innerHTML.replaceAll(regex, str => `<span class="${className}">${str}</span>`);
};

export default createFeature(
	'biggerEmojis',
	async () => {
		logDebugMessage('Feature Enabled: Bigger emojis');

		const scale = 2;
		const percentage = scale * 100;
		const trackSizing = scale >= 1.5 ? '5rem' : '4rem';
		const rules = `
			.message .emoji-box,
			.message .emoji-bar > span[id*="emojis-"] { display: inline-block; }
			.message .emoji-bar { bottom: 2px; right: 3px; }
			.message .emoji-bar a,
			.emoji-picker > *,
			.message-contents span.${className} { font-size: ${percentage}%; }
			.message-contents blockquote span.${className} { font-size: ${percentage * 0.75}%; }
			.message-contents:not(.preview) { margin-bottom: 30px }
			.message span.emoji-text { font-size: inherit; }
			.emoji-picker { grid-template-columns: repeat(4, ${trackSizing}); }
		`;
		insertStyles(`${CSS_PREFIX}bigger-emojis`, rules);

		const messages = document.querySelectorAll('.message-contents > p, .message-contents blockquote p:not(:first-child)');
		messages.forEach(wrapEmojis);
	},
	async (addedNode) => {
		wrapEmojis(addedNode);
	},
);