import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { Storage } from '@plasmohq/storage';
import { CSS_PREFIX } from '~constants';
import type { DramalinksSettings } from '~components/options/general';
import insertStyles from '~lib/insertStyles';

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
async function formatDramalinks(query: DramalinksQuery) {
	const container = document.createElement('div');
	container.setAttribute('id', `${CSS_PREFIX}dramalinks-ticker`);
	container.style.backgroundColor = query.color;

	const storage = new Storage();
	const settings:DramalinksSettings = await storage.get('dramalinks');
	container.classList.add(`${CSS_PREFIX}${settings.format}`);
	container.classList.add(`${CSS_PREFIX}${settings.align}`);

	query.items.forEach((item, index) => {
		const element = document.createElement('p');
		element.innerHTML = item;
		if (index < query.items.length - 1 && settings.format === 'wrap') {
			element.innerHTML += `<span class="${CSS_PREFIX}dramalinks-seperator">■</span>`;
		}
		container.insertAdjacentElement('beforeend', element);
	});

	return container;
}

async function initializeDramalinks() {
	const dramalinks = await getDramalinks();
	if (dramalinks) {
		const data = await parseDramalinks(dramalinks);
		const ticker = await formatDramalinks(data);
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
		#${CSS_PREFIX}dramalinks-ticker > p {
			padding: 4px 6px;
			margin: 0;
		}
		#${CSS_PREFIX}dramalinks-ticker > p:nth-of-type(even) {
			background: rgba(${data.textColor === 'black' ? '0,0,0,.1' : '255,255,255,.05'});
		}
		#${CSS_PREFIX}dramalinks-ticker br {
			display: none;
		}
		#${CSS_PREFIX}dramalinks-ticker .${CSS_PREFIX}dramalinks-seperator {
			margin: 0 12px;
		}
		#${CSS_PREFIX}dramalinks-ticker.${CSS_PREFIX}wrap {
			padding: 4px 6px;
			word-wrap: break-word;
			white-space: normal;
		}
		#${CSS_PREFIX}dramalinks-ticker.${CSS_PREFIX}wrap > p {
			padding: 0;
			display: inline;
			line-height: 1.6;
		}
		#${CSS_PREFIX}dramalinks-ticker.${CSS_PREFIX}wrap > p:nth-of-type(even) {
			background: initial;
		}
		#${CSS_PREFIX}dramalinks-ticker.${CSS_PREFIX}left {
			text-align: left;
		}
		#${CSS_PREFIX}dramalinks-ticker.${CSS_PREFIX}center {
			text-align: center;
		}
		#${CSS_PREFIX}dramalinks-ticker.${CSS_PREFIX}right {
			text-align: right;
		}`;
		insertStyles(`${CSS_PREFIX}dramalinks`, rules);
	}
}

export default createFeature(
	'dramalinks',
	async () => {
		if (window.location.origin.includes('https://lue.')) {
			logDebugMessage('Feature Enabled: Dramalinks ticker for LUE');
			initializeDramalinks();
		}
	},
);