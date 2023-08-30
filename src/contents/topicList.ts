import type { PlasmoCSConfig } from 'plasmo';
import injectFeatures from '~lib/features/injectFeatures';
import features from '~lib/features/topicList';

// Content script configuration
export const config: PlasmoCSConfig = {
	matches: ['*://*.websight.blue/', '*://*.websight.blue/threads/*', '*://*.websight.blue/search/*'],
};

injectFeatures(features);