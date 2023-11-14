import type { PlasmoCSConfig } from 'plasmo';
import injectFeatures from '~lib/features/injectFeatures';
import features from '~lib/features/newTopic';

// Content script configuration
export const config: PlasmoCSConfig = {
	matches: ['*://*.websight.blue/post/'],
};

injectFeatures(features);