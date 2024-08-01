import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { Storage } from '@plasmohq/storage';
import { sendToBackground } from '@plasmohq/messaging';
import type { EmbedTwitterSettings } from '~components/options/posts';
import widget from 'url:@Assets/twitter/widgets.js';
import insertStyles from '~lib/insertStyles';
import { CSS_PREFIX } from '~constants';

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

async function insertEmbeds(links: NodeListOf<HTMLAnchorElement>) {
	[...links]
		.filter(link => link.href.includes('/status/'))
		.forEach(async link => {
			const embed = await fetchEmbed(link.href.replace('x.com', 'twitter.com'));
			if (embed) {
				// Hacky way of waiting for oembed markup to be added before firing message to main world to load twitter widget from markup. Execution of requestAnimationFrame occurs before next repaint.  Nesting another requestAnimationFrame will fire it's callback  after next repaint (because it waits for the animation frame after the one we're waiting for to paint)
				// Source: https://macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous#option-2-fire-after-next-repaint
				requestAnimationFrame(() => {
					// Fires _before_ next repaint.
					link.insertAdjacentHTML('afterend', embed.html);

					// Wait for the markup to be inserted and rendered to the DOM before loading the wi dget. We do this to ensure the Twitter Widget script in the MAIN world can sometimes fire before the markup is rendered to the screen. Sending a postMessage after inserting markup causes the event to fire in the correct order after insertion.
					requestAnimationFrame(() => {
						// Fires _after next repaint.
						// The message listener is in contents/twitterEmbed.ts
						window.postMessage({ type: 'load_twitter_widget', id: link.closest('.message').id });
					});
				});
			}
		});
}

export default createFeature(
	'embedTwitter',
	async () => {
		logDebugMessage('Feature Enabled: Embed Twitter links');

		const id = 'twitter-wjs';
		if (!document.getElementById(id)) {
			const twitterWJS = document.createElement('script');
			twitterWJS.id = id;
			twitterWJS.src = widget;
			document.head.appendChild(twitterWJS);
		}

		const rules = '.twitter-tweet { display: none; overflow: hidden; border-radius: 15px; }';
		insertStyles(`${CSS_PREFIX}twitter-embeds`, rules);

		const storage = new Storage();
		const settings:EmbedTwitterSettings = await storage.get('embedTwitter');
		theme = settings.theme;

		const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.message-contents p a[href*="twitter.com"], .message-contents p a[href*="x.com"]');
		insertEmbeds(links);
	},
	async (addedNode) => {
		const links: NodeListOf<HTMLAnchorElement> = addedNode.querySelectorAll('.message-contents p a[href*="twitter.com"], .message-contents p a[href*="x.com"]');
		insertEmbeds(links);
	},
);