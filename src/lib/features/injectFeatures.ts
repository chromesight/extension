import logDebugMessage from '~lib/logs/debug';
import { Storage } from '@plasmohq/storage';
import type { Feature, FeatureSettings } from './feature';
import { CSS_PREFIX } from '~constants';

// Execute features when the browser is ready
export default function injectFeatures(featureList: Array<Feature>) {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			executeFeatures(featureList);
		});
	}
	else {
		executeFeatures(featureList);
	}
}

// Execute feature one by one if any exist, as well as queue up features to execute when posts are added to the page
function executeFeatures(features: Array<Feature>) {
	if (features.length) {
		logDebugMessage('Injecting features into the page');

		for (const feature of features) {
			executeFeature(feature);

			// Add feature executions for when a new post is added to the page
			const postsContainer = document.querySelector('#messages');
			if (postsContainer) {
				const newPostObserver = new MutationObserver((mutations) => handleNewPost(mutations, features));
				const observerConfig = { childList: true, subtree: false };
				newPostObserver.observe(postsContainer, observerConfig);
			}
		}
	}
}

// Determine whether a feature should execute
async function executeFeature(feature: Feature, isMutationExecution = false, node?: Node) {
	try {
		const { enabled } = await getFeatureSettings(feature.settingsKey);

		if (enabled) {
			if (!isMutationExecution) {
				feature.execute();
			}
			else {
				feature.executeOnNewPost(node as HTMLElement);
			}
		}
	}
	catch (error) {
		logDebugMessage(error);
	}
}

// Get a feature's settings configuration from storage, this is stored in Google Chrome's synced storage; see Plasmo storage setup for more info
async function getFeatureSettings(key: string): Promise<FeatureSettings> {
	const storage = new Storage();
	const featureSettings:FeatureSettings = await storage.get(key);
	return featureSettings;
}

// Enqueue all features for execution (if necessary) when a new post is added to the DOM
function handleNewPost(mutations: MutationRecord[], features: Feature[]) {
	const className = `${CSS_PREFIX}mutated`;
	for (const mutation of mutations) {
		// Target any new nodes, exclusively, if any exist
		if (mutation.addedNodes.length) {
			for (const addedNode of mutation.addedNodes as NodeListOf<HTMLElement>) {
				if (addedNode.classList.contains(className)) continue;
				// Check if the added node is a normal HTML tag, otherwise, we can skip it

				if (!(addedNode as HTMLElement).tagName) continue;

				for (const feature of features) {
					executeFeature(feature, true, addedNode);
				}

				addedNode.classList.add(className);
			}
		}
	}
}