import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import insertStyles from '~lib/insertStyles';
import { CSS_PREFIX } from '~constants';

const className = `${CSS_PREFIX}resizing`;

function handleImages(images) {
	images.forEach(image => {
		image.addEventListener('mousedown', e => {
			e.preventDefault();

			image.classList.add(className);
			image.addEventListener('mousemove', resize);

			image.addEventListener('mouseup', () => removeResize(image));
			image.addEventListener('mouseleave', () => removeResize(image));
		});
	});
}

const resize = e => {
	e.target.style.width = `${e.target.width + e.movementX}px`;
};

const removeResize = element => {
	element.removeEventListener('mousemove', resize);
	element.classList.remove(className);
};

export default createFeature(
	'autoScroll',
	async () => {
		logDebugMessage('Feature Enabled: Resizable images');

		const rules = `
		.message img {
			min-width: 42px;
			transform-origin: top left;
		}
		.message img.${CSS_PREFIX}resizing:active {
			cursor: nwse-resize;
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