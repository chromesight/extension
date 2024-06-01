import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';

export default createFeature(
	'autoRedirect',
	async () => {
		logDebugMessage('Feature Enabled: Auto redirect to new page');

		const observer = new MutationObserver((mutationList) => {
			for (const mutation of mutationList) {
				if (mutation.type === 'attributes') {
					const element = mutation.target as HTMLElement;
					const nearBottomOfPage = window.scrollY >= document.body.scrollHeight - window.innerHeight * 2;
					console.log(nearBottomOfPage);
					if (nearBottomOfPage && element.style.display === 'block') {
						console.log(true);
						setTimeout(() => element.click(), 2000);
					}
				}
			}
		});

		const targetNode = document.getElementById('nextpage');
		const config = { attributes: true, attributeFilter: ['style'] };
		observer.observe(targetNode, config);
	},
);