import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import insertStyles from '~lib/insertStyles';
import { CSS_PREFIX } from '~constants';

function handleImages(images) {
	images.forEach(image => {
		const removeResize = e => {
			image.removeEventListener('mousemove', resize);
			e.target.style.cursor = 'initial';
		};
		image.addEventListener('mousedown', e => {
			e.preventDefault();

			image.addEventListener('mousemove', resize);
			e.target.style.cursor = 'nwse-resize';

			image.addEventListener('mouseup', removeResize);
			image.addEventListener('mouseleave', removeResize);
		});
	});
}

const resize = e => {
	e.target.style.width = `${e.target.width + e.movementX}px`;
};

export default createFeature(
	'autoScroll',
	async () => {
		logDebugMessage('Feature Enabled: Resizable images');

		const rules = `
		.message img {
			min-width: 42px;
			transform-origin: top left;
		}`;
		insertStyles(`${CSS_PREFIX}resizable-images`, rules);

		const images = document.querySelectorAll('.message img');
		handleImages(images);
	},
	async (addedNode) => {
		const images = addedNode.querySelectorAll('.message img');
		handleImages(images);
	},
);