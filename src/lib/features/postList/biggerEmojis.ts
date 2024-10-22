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

		const rules = `
			.message .emoji-box { display: inline-block; }
			.message span.emoji-text { font-size: 185%; }
			.message-contents { margin-bottom: 30px }
			.message-contents span.${className} { font-size: 185%; }
			.message-contents blockquote span.${className} { font-size: 140%; }
			.emoji-bar > span[id*="emojis-"] { display: inline-block; }
		`;
		insertStyles(`${CSS_PREFIX}bigger-emojis`, rules);

		const messages = document.querySelectorAll('.message-contents > p, .message-contents blockquote p:not(:first-child)');
		messages.forEach(wrapEmojis);
	},
	async (addedNode) => {
		wrapEmojis(addedNode);
	},
);