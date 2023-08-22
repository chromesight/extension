import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { CSS_PREFIX } from '~constants';

type DramalinksQuery = {
	items: string[];
	color: string;
	textColor: string;
};

// Fetch dramalinks from wiki
async function getDramalinks(): Promise<Document> {
	let data = null;
	try {
		const response = await fetch('https://lue.websight.blue/wiki/');
		const result = await response.text();
		const parser = new DOMParser();
		data = parser.parseFromString(result, 'text/html');
	}
	catch (error) {
		console.error('Error fetching dramalinks.', error);
	}
	return data;
}

// Get dramalinks items from response
async function queryItems(dramalinks: Document): Promise<string[]> {
	const elements = dramalinks.querySelectorAll('.content > ul:first-of-type li');
	const items = [...elements].map(element => element.innerHTML);
	return items;
}

// Get dramalinks color from response
async function queryColor(dramalinks: Document): Promise<string> {
	const element: HTMLElement = dramalinks.querySelector('.content > figure figcaption b');
	return element.style.color;
}

// Determine contrast YIQ value and contrasting color
function calculateContrast(rgb: string): string {
	const hex = `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`;
	const r = parseInt(hex.substring(1, 3), 16);
	const g = parseInt(hex.substring(3, 5), 16);
	const b = parseInt(hex.substring(5, 7), 16);
	const yiq = ((r * 99) + (g * 587) + (b * 114)) / 1000;
	console.log(yiq);
	return (yiq >= 128) ? 'black' : 'white';
}

// Get necessary context from fetched dramalinks document
async function parseDramalinks(dramalinks: Document): Promise<DramalinksQuery> {
	const items = await queryItems(dramalinks);
	const color = await queryColor(dramalinks);
	const textColor = calculateContrast(color);
	return {
		items,
		color,
		textColor,
	};
}

// Format dramalinks for thread list and insert to DOM
function formatDramalinks(query: DramalinksQuery) {
	const container = document.createElement('div');
	container.setAttribute('id', `${CSS_PREFIX}dramalinks-ticker`);
	container.style.backgroundColor = query.color;

	const list = document.createElement('ul');
	query.items.forEach(item => {
		const element = document.createElement('li');
		element.innerHTML = item;
		list.insertAdjacentElement('beforeend', element);
	});
	container.insertAdjacentElement('beforeend', list);

	return container;
}

async function initializeDramalinks() {
	const dramalinks = await getDramalinks();
	if (dramalinks) {
		const data = await parseDramalinks(dramalinks);
		const ticker = formatDramalinks(data);
		document.querySelector('.body > h1').insertAdjacentElement('afterend', ticker);

		const rules = `
		#${CSS_PREFIX}dramalinks-ticker {
			border: 1px solid rgba(255,255,255,.3);
			outline: 1px solid rgba(0,0,0,.65);
			margin: .5em 0;
		}
		#${CSS_PREFIX}dramalinks-ticker,
		#${CSS_PREFIX}dramalinks-ticker a {
			color: ${data.textColor};
			text-decoration-color: ${data.textColor};
		}
		#${CSS_PREFIX}dramalinks-ticker ul {
			list-style-type: none;
			padding: 0;
			margin: 0;
		}
		#${CSS_PREFIX}dramalinks-ticker ul > li {
			padding: 4px 6px;
		}
		#${CSS_PREFIX}dramalinks-ticker ul > li:nth-of-type(even) {
			background: rgba(${data.textColor === 'white' ? '0,0,0,.1' : '255,255,255,.15'});
		}
		#${CSS_PREFIX}dramalinks-ticker br {
			display: none;
		}`;
		const styles = document.createElement('style');
		styles.innerHTML = rules;
		styles.id = `${CSS_PREFIX}dramalinks-styles`;
		document.head.insertAdjacentElement('beforeend', styles);
	}
}

export default createFeature(
	'dramalinks',
	async () => {
		logDebugMessage('Feature Enabled: Display dramalinks ticker above topic list');

		initializeDramalinks();
	},
);