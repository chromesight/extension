import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { sendToBackground } from '@plasmohq/messaging';
import insertStyles from '~lib/insertStyles';
import embed from 'url:@Assets/bluesky/embed.js';
import { CSS_PREFIX } from '~constants';

interface BlueskyEmbedResponse {
	error?: string;
	success?: boolean;
	type?: string;
	version?: string;
	author_name?: string;
	author_url?: string;
	provider_url?: string;
	cache_age?: number;
	width?: number;
	height?: number | null;
	html?: string;
}

async function fetchEmbed(postUrl: string): Promise<BlueskyEmbedResponse | null> {
	// Ensure the URL is properly encoded
	const encodedUrl = encodeURIComponent(postUrl);
	const apiUrl = `https://embed.bsky.app/oembed?url=${encodedUrl}`;

	const response = await sendToBackground({
		name: 'fetch',
		body: {
			url: apiUrl,
		},
	});

	if (response.success === false) {
		console.error('Error fetching Bluesky embed:', response?.error);
		return null;
	}

	return response;
}

async function insertEmbeds(links: NodeListOf<HTMLAnchorElement>) {
	[...links].forEach(async link => {
		const embed = await fetchEmbed(link.href);
		if (embed?.html) {
			requestAnimationFrame(() => {
				const embedDiv = document.createElement('div');
				embedDiv.classList.add(`${CSS_PREFIX}bluesky-embed`);
				
				// Remove the script tag from the HTML since we'll load it separately
				const htmlWithoutScript = embed.html.replace(/<script.*?<\/script>/s, '');
				embedDiv.innerHTML = htmlWithoutScript;
				
				
				// Hacky way of waiting for oembed markup to be added before firing message to main world to load twitter widget from markup. Execution of requestAnimationFrame occurs before next repaint.  Nesting another requestAnimationFrame will fire it's callback  after next repaint (because it waits for the animation frame after the one we're waiting for to paint)
				// Source: https://macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous#option-2-fire-after-next-repaint
				requestAnimationFrame(() => {
					// Fires _before_ next repaint.
					link.insertAdjacentHTML('afterend', embed.html);

					// Wait for the markup to be inserted and rendered to the DOM before loading the wi dget. We do this to ensure the Twitter Widget script in the MAIN world can sometimes fire before the markup is rendered to the screen. Sending a postMessage after inserting markup causes the event to fire in the correct order after insertion.
					requestAnimationFrame(() => {
						// Fires _after next repaint.
						// The message listener is in contents/blueskyEmbed.ts
						window.postMessage({ type: 'load_bsky_widget', id: link.closest('.message').id });
					});
				});
			});
		}
	});
}

export default createFeature(
	'embedBluesky',
	async () => {
		logDebugMessage('Feature Enabled: Embed Bluesky links');

		const id = 'bsky-ejs';
		if (!document.getElementById(id)) {
			const bluesky = document.createElement('script');
			bluesky.id = id;
			bluesky.src = embed;
			document.head.appendChild(bluesky);
		}


		const rules = `
				.${CSS_PREFIX}bluesky-embed {
						margin: 10px 0;
				}
				.bluesky-embed {
						border: 1px solid rgba(0,0,0,0.1);
						border-radius: 12px;
						overflow: hidden;
						background: var(--InputBG);
				}`;
		insertStyles(`${CSS_PREFIX}bluesky-embeds`, rules);

		const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.message-contents p a[href*="bsky.app"]');
		insertEmbeds(links);
	},
	async (addedNode) => {
		const links: NodeListOf<HTMLAnchorElement> = addedNode.querySelectorAll('.message-contents p a[href*="bsky.app"]');
		insertEmbeds(links);
	},
);