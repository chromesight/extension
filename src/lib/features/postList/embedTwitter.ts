import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { Storage } from '@plasmohq/storage';
import { sendToBackground } from '@plasmohq/messaging';
import type { EmbedTwitterSettings } from '~components/options/posts';
import widget from 'url:~assets/twitter/widgets.js';
import newWidget from 'url:~assets/twitter/new-widget.js';
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
		.map(async link => {
			const embed = await fetchEmbed(link.href.replace('x.com', 'twitter.com'));
			if (embed) {
				link.insertAdjacentHTML('afterend', embed.html);
				requestAnimationFrame(() => {
					// Wait for the markup to be inserted and rendered to the DOM. We do this to ensure the Twitter Widget script in the MAIN world won't attempt to load the tweet after the markup is inserted but before it's rendered. Sending a postMessage after inserting markup causes the event to fire before the markup has been rendered, so we wait for the animation frame.
					window.postMessage({ type: 'load_twitter_widgets', id: link.closest('.message').id });

					// The message listener is in contents/twitterEmbed.ts
				});
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


		// Hacky way of waiting for oembed markup to be added before firing message to main world to load twitter widget from markup.
		// Source: https://macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous#option-2-fire-after-next-repaint
		// Execution of requestAnimationFrame. Occurs before next repaint.  Nesting another requestAnimationFrame will fire it's callback  after next repaint (because it waits for the animation frame after the next one to paint)
		requestAnimationFrame(() => {
			const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.message-contents p a[href*="twitter.com"], .message-contents p a[href*="x.com"]');
			// Nesting requestAnimationFrame call inside insertEmbeds means it fires _after_ the next repaint
			insertEmbeds(links);
		});
	},
	async (addedNode) => {
		requestAnimationFrame(() => {
			// Fires _before_ next repaint
			const links: NodeListOf<HTMLAnchorElement> = addedNode.querySelectorAll('.message-contents p a[href*="twitter.com"], .message-contents p a[href*="x.com"]');
			insertEmbeds(links);
		});
	},
);