import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { Storage } from '@plasmohq/storage';
import type { KeywordIgnoratorSettings } from '~components/options/topics';
import { sendToBackground } from '@plasmohq/messaging';

const storageKey = 'keywordIgnorator';
let kwIgnoratorBadge = false;

export async function removeKeyword(keyword: string) {
	const storage = new Storage();
	const settings:KeywordIgnoratorSettings = await storage.get(storageKey);
	delete settings.keywords[keyword];
	await storage.set(storageKey, settings);
}

export async function addKeyword(keyword: string) {
	const storage = new Storage();
	const settings:KeywordIgnoratorSettings = await storage.get(storageKey);
	settings.keywords[keyword] = {
		hideTopics: true,
		hideTags: true,
	};
	await storage.set(storageKey, settings);
	return true;
}

export default createFeature(
	'keywordIgnorator',
	async () => {
		logDebugMessage('Feature Enabled: Keyword Ignorator');

		const storage = new Storage();
		const { keywords, badge }:KeywordIgnoratorSettings = await storage.get(storageKey);
		kwIgnoratorBadge = badge;
		const keys = Object.keys(keywords);
		const topicKeywords = keys.filter(keyword => keywords[keyword].hideTopics);
		const tagKeywords = keys.filter(keyword => keywords[keyword].hideTags);
		const topicPattern = new RegExp(topicKeywords.join('|'));
		const tagPattern = new RegExp(tagKeywords.join('|'));
		const elements = document.querySelectorAll('.grid tr');
		const selectors = [];

		// Topic list page
		if (window.location.pathname.includes('/threads/') || window.location.pathname === '/') {
			elements.forEach((element: HTMLTableRowElement) => {
				const title: HTMLDivElement = element.querySelector('.fl');
				const tags: HTMLDivElement = element.querySelector('.fr');

				// Check topic title
				if (topicKeywords.length && topicPattern.test(title?.textContent.toLowerCase())) {
					element.style.display = 'none';
					selectors.push(element.id);
					return true;
				}

				// Check tags
				if (tagKeywords.length && tagPattern.test(tags?.textContent.toLowerCase())) {
					element.style.display = 'none';
					selectors.push(element.id);
				}
			});
		}

		// Notices page
		if (window.location.pathname.includes('/notices/')) {
			elements.forEach((element: HTMLTableRowElement) => {
				const title: HTMLDivElement = element.querySelector('td:nth-of-type(2) a:last-of-type');
				if (topicKeywords.length && topicPattern.test(title?.textContent.toLowerCase())) {
					element.style.display = 'none';
					selectors.push(element.id);
				}
			});
		}

		if (kwIgnoratorBadge) {
			sendToBackground({
				name: 'badge',
				body: {
					keywordItems: selectors.length.toString(),
				},
			});
		}
	},
);