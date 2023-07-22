import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import logo from 'data-base64:~assets/twitter.png';
import { Storage } from '@plasmohq/storage';
import { sendToBackground } from '@plasmohq/messaging';
import { CSS_PREFIX } from '~constants';
import type { EmbedTwitterSettings } from '~components/options/posts';

let theme = 'dark';

async function fetchEmbed(url) {
	const response = await sendToBackground({
		name: 'fetch',
		body: {
			url: `https://publish.twitter.com/oembed?url=${url}&theme=${theme}&omit_script=true`,
		},
	});
	return response;
}

async function handleLinks(links) {
	const promises = [...links]
		.filter(link => link.href.includes('/status/'))
		.map(async link => {
			const embed = await fetchEmbed(link);
			if (embed) {
				link.insertAdjacentHTML('afterend', embed.html);
			}
		});
	await Promise.all(promises);
}

export default createFeature(
	'embedTwitter',
	async () => {
		logDebugMessage('Feature Enabled: Embed Twitter links');

		const storage = new Storage();
		const settings:EmbedTwitterSettings = await storage.get('embedTwitter');
		theme = settings.theme;

		const rules = `
		.twitter-tweet {
			position: relative;
			padding: 16px;
			border: 1px solid #ffffff;
			border-radius: 4px;
			margin: 6px 0;
			max-width: 470px;
			background: #e4e4ee;
			color: #1d1d1d;
			overflow: hidden;
			outline: 1px solid rgba(0,0,0,.3);
		}

		.twitter-tweet > * {
			position: relative;
			z-index: 2;
		}

		.twitter-tweet a {
			color: inherit;
		}

		.twitter-tweet p {
			margin-top: 0;
			line-height: 1.4;
		}

		.twitter-tweet[data-theme="dark"] {
			background: #2c2c35;
			border-color: #494953;
			outline-color: rgba(0,0,0,.65);
			color: #ffffff;
		}

		.twitter-tweet::after {
			content: '';
			position: absolute;
			z-index: 1;
			opacity: .25;
			bottom: -5px;
			right: 5px;
			width: 80px;
			height: 80px;
			background: url("${logo}");
			background-size: contain;
			background-repeat: no-repeat;
			background-position: bottom right;
		}

		.twitter-tweet[data-theme="dark"]::after {
			opacity: .15;
		}`;
		const element = document.createElement('style');
		element.innerHTML = rules;
		element.id = `${CSS_PREFIX}twitter-embed-styles`;
		document.head.insertAdjacentElement('beforeend', element);

		const links = document.querySelectorAll('.message-contents p a[href*="twitter.com"]');
		handleLinks(links);
	},
	async (addedNode) => {
		const links = addedNode.querySelectorAll('.message-contents p a[href*="twitter.com"]');
		handleLinks(links);
	},
);