import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { Storage } from '@plasmohq/storage';
import { sendToBackground } from '@plasmohq/messaging';
import type { EmbedTwitterSettings } from '~components/options/posts';
import widget from 'url:@Assets/twitter/widgets.js';
import insertStyles from '~lib/insertStyles';
import { CSS_PREFIX } from '~constants';

let theme = 'dark';

interface TwitterEmbedResponse {
	error?: string;
	success?: boolean;
	html?: string;
}

async function fetchEmbed(url: string): Promise<TwitterEmbedResponse | null> {
	const response = await sendToBackground({
		name: 'fetch',
		body: {
			url: `https://publish.twitter.com/oembed?url=${url}&theme=${theme}&omit_script=false`,
		},
	});

	if (response.success === false) {
		console.error('Error fetching Twitter embed:', response?.error);
		return null;
	}

	return response;
}

async function insertEmbeds(links: NodeListOf<HTMLAnchorElement>) {
	const twitterLinks = [...links].filter(link => link.href.includes('/status/'));
	
	// Fetch all embeds simultaneously
	const embedPromises = twitterLinks.map(link => 
		fetchEmbed(link.href.replace('x.com', 'twitter.com'))
			.then(embed => ({ link, embed }))
	);
	
	const results = await Promise.all(embedPromises);
	
	results.forEach(({ link, embed }) => {
		if (embed) {
			link.insertAdjacentHTML('afterend', embed.html);
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