import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';

function numberPost(post: HTMLElement) {
	const header:HTMLElement = post.querySelector('.posted-link');
	const index: string = post.dataset.post;

	const element = document.createElement('span');
	element.innerText = ` | #${index}`;
	element.style.fontWeight = '700';
	header.insertAdjacentElement('afterend', element);
}

export default createFeature(
	'postNumbers',
	async () => {
		logDebugMessage('Feature Enabled: Display post numbers');

		const posts = document.querySelectorAll('.post');
		for (const post of posts) {
			numberPost(post as HTMLElement);
		}
	},
	async (addedPost) => {
		numberPost(addedPost as HTMLElement);
	},
);