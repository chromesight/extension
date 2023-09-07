import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import insertStyles from '~lib/insertStyles';
import { Storage } from '@plasmohq/storage';
import { CSS_PREFIX } from '~constants';
import type { ResizableImagesSettings } from '~components/options/posts';

export default createFeature(
	'autoScroll',
	async () => {
		logDebugMessage('Feature Enabled: Resizable images');

		const images = document.querySelectorAll('.message img');
		const resize = (e) => {
			const target = e.target;
			target.style.width = `${e.target.width + e.movementX}px`;
		};
		images.forEach(image => {
			image.addEventListener('mousedown', e => {
				e.preventDefault();
				image.addEventListener('mouseup', () => image.removeEventListener('mousemove', resize));
				image.addEventListener('mouseleave', () => image.removeEventListener('mousemove', resize));
				image.addEventListener('mousemove', resize);
			});
		});

		const storage = new Storage();
		const settings:ResizableImagesSettings = await storage.get('resizableImages');
		const rules = `
		.message img {
			min-width: 42px;
			width: ${settings.initialWidth}%;
			max-width: ${settings.maxWidth}%;
			transform-origin: top left;
		}
		.message img:active {
			cursor: nwse-resize;
		}`;
		insertStyles(`${CSS_PREFIX}resizable-images`, rules);
	},
);