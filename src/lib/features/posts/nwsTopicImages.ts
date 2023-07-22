import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { CSS_PREFIX } from '~constants';

const className = `${CSS_PREFIX}hidden-nws-elements`;

function replaceElements(elements: NodeListOf<HTMLElement>) {
	for (const element of elements) {
		const post = element.closest('.post');
		if (!post.classList.contains(className)) {
			post.classList.add(className);
		}

		// Either get img src or from video source child element
		const src = element.tagName === 'IMG' ? element.getAttribute('src') : element.firstElementChild.getAttribute('src');
		const filename = src.slice(src.lastIndexOf('/') + 1);

		// Create a link to the hidden element and appen
		const link = document.createElement('a');
		link.innerText = `[${element.tagName === 'IMG' ? 'image' : 'video'}: ${filename}]`;
		link.href = src;
		link.target = '_blank';
		element.insertAdjacentElement('afterend', link);
	}
}

export default createFeature(
	'nwsTopicImages',
	async () => {
		const tags = document.querySelector('#tag-editor-container .danger[href*="nws"],#tag-editor-container .danger[href*="nls"]');
		if (tags) {
			const selector = '.post .message-contents img, .post .message-contents video';

			// We're in a NWS or NLS topic
			const styles = document.createElement('style');
			styles.innerHTML = `${selector} { display: none }`;
			styles.id = `${CSS_PREFIX}hide-nws-media`;
			document.head.insertAdjacentElement('beforeend', styles);

			const elements: NodeListOf<HTMLElement> = document.querySelectorAll(selector);
			replaceElements(elements);

			document.body.classList.add(`${CSS_PREFIX}nws`);
		}

		logDebugMessage('Feature Enabled: Replace images & videos only in NWS/NLS topics with text-only links');
	},
	async (addedNode) => {
		if (document.body.classList.contains(`${CSS_PREFIX}nws`)) {
			const elements: NodeListOf<HTMLElement> = addedNode.querySelectorAll('.message-contents img, .message-contents video');
			replaceElements(elements);
		}
	},
);