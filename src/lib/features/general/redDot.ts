import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { CSS_PREFIX } from '~constants';

export default createFeature(
	'redDot',
	async () => {
		logDebugMessage('Feature Enabled: Red dot');

		const element = document.createElement('div');
		element.id = `${CSS_PREFIX}red-dot`;
		element.style.cssText = 'position:fixed;z-index:999;background:red;width:1px;height:1px;bottom:45px!important;bottom:10000px;right:24px';
		element.innerHTML = '<!--a reminder, for all that we fought against. -->';
		document.body.appendChild(element);
	},
);