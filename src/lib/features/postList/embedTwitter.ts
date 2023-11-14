import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { Storage } from '@plasmohq/storage';
import { sendToBackground } from '@plasmohq/messaging';
import type { EmbedTwitterSettings } from '~components/options/posts';
import widget from 'url:~assets/twitter/widgets.js';
import newWidget from 'url:~assets/twitter/new-widget.js';

let theme = 'dark';

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function fetchEmbed(url) {
	const response = await sendToBackground({
		name: 'fetch',
		body: {
			url: `https://publish.twitter.com/oembed?url=${url}&theme=${theme}&omit_script=true`,
		},
	});
	return response;
}

async function insertTweets(links) {
	[...links]
		.filter(link => link.href.includes('/status/'))
		.map(async link => {
			const embed = await fetchEmbed(link.href.replace('x.com', 'twitter.com'));
			if (embed) {
				link.insertAdjacentHTML('afterend', embed.html);
			}
		});
}

export default createFeature(
	'embedTwitter',
	async () => {
		logDebugMessage('Feature Enabled: Embed Twitter links');

		const storage = new Storage();
		const settings:EmbedTwitterSettings = await storage.get('embedTwitter');
		theme = settings.theme;

		const twitterWJS = document.createElement('script');
		twitterWJS.id = 'twitter-wjs';
		twitterWJS.src = widget;
		document.head.appendChild(twitterWJS);

		const twitternNewWJS = document.createElement('script');
		twitternNewWJS.id = 'twitter-new-widget';
		twitternNewWJS.src = newWidget;
		document.head.appendChild(twitternNewWJS);

		const links = document.querySelectorAll('.message-contents p a[href*="twitter.com"], .message-contents p a[href*="x.com"]');
		insertTweets(links);
	},
	async (addedNode) => {
		const links = addedNode.querySelectorAll('.message-contents p a[href*="twitter.com"], .message-contents p a[href*="x.com"]');
		await insertTweets(links);
		window.postMessage({ type: 'load_twitter_widget', addedNodeId: addedNode.id });
	},
);