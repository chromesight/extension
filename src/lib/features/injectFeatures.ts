import logDebugMessage from '~lib/logs/debug';
import { Storage } from '@plasmohq/storage';
import type { Feature, FeatureSettings } from './feature';
import { CSS_PREFIX } from '~constants';

const pageFeatures = [];

// Execute features when the browser is ready
export default async function injectFeatures(featureList: Array<Feature>) {
	executeFeatures(featureList);
}

// Execute feature one by one if any exist, as well as queue up features to execute when posts are added to the page
function executeFeatures(features: Array<Feature>) {
	if (features.length) {
		logDebugMessage('Injecting features into the page');
		pageFeatures.push(...features);

		// Execute feature on page load.
		for (const feature of features) {
			executeFeature(feature);
		}

		// Setup feature executions for when a new post is added to the page.
		const postsContainer = document.querySelector('#messages');
		if (postsContainer) {
			const newPostObserver = new MutationObserver((mutations) => handleNewPost(mutations, pageFeatures));
			const observerConfig = { childList: true };
			newPostObserver.observe(postsContainer, observerConfig);
		}
	}
}

// Execute feature either for page load or on mutation, if the feature is enabled
async function executeFeature(feature: Feature, isMutationExecution = false, node?: Node) {
	try {
		const { enabled } = await getFeatureSettings(feature.settingsKey);

		if (!enabled) {
			return false;
		}

		if (!isMutationExecution) {
			feature.execute();
		}
		else if (isMutationExecution && feature.executeOnNewPost !== undefined) {
			feature.executeOnNewPost(node as HTMLElement);
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
		// Target any new posts added
		if (mutation.addedNodes.length) {
			for (const addedNode of mutation.addedNodes as NodeListOf<HTMLElement>) {
				// Check if the added node is a normal HTML tag, otherwise, we can skip it
				if (!(addedNode as HTMLElement).tagName) continue;

				// Check if we've already mutated the node
				if (addedNode.classList.contains(className)) continue;

				// Execute feature on the new post and mark it as mutated
				for (const feature of features) {
					executeFeature(feature, true, addedNode);
				}
				addedNode.classList.add(className);
			}
		}
	}
}