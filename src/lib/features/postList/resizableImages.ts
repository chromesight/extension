import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import insertStyles from '~lib/insertStyles';
import { CSS_PREFIX } from '~constants';

const resizingClassName = `${CSS_PREFIX}resizing`;
const resizedClassName = `${CSS_PREFIX}resized`;

function handleImages(images: NodeList): void {
	images.forEach((image: HTMLImageElement) => {
		if (!image.parentElement.classList.contains('embed-link') && !image.classList.contains('shrunk')) {

			image.addEventListener('mousedown', event => {
				event.preventDefault();
				image.style.width = `${image.getBoundingClientRect().width}px`;
				image.style.maxHeight = 'none';

				image.classList.add(resizingClassName);
				image.classList.add(resizedClassName);
				image.addEventListener('mousemove', resize);

				image.addEventListener('mouseup', () => removeResize(image));
				image.addEventListener('mouseleave', () => removeResize(image));
			});
		}
	});
}

function resize(event: MouseEvent): void {
	const target = event.target as HTMLImageElement;
	const resizedWidth = target.width + event.movementX;
	target.style.width = `${resizedWidth}px`;
}

function removeResize(element: HTMLImageElement): void {
	element.removeEventListener('mousemove', resize);
	element.classList.remove(resizingClassName);
}

export default createFeature(
	'resizableImages',
	async () => {
		logDebugMessage('Feature Enabled: Resizable images');

		const rules = `
		.message-contents img:not(.twemoji) {
			min-width: 42px;
			transform-origin: top left;
		}
		.message-contents img.${CSS_PREFIX}resizing:active {
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