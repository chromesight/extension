import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';

export default createFeature(
	'autoScroll',
	async () => {
		logDebugMessage('Feature Enabled: Auto scroll new posts');
	},
	async (addedNode) => {
		const element = addedNode as HTMLElement;
		if (element.classList.contains('post')) {
			if (document.body.scrollTop >= document.body.scrollHeight - window.innerHeight * 2) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	},
);