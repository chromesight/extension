import type { PlasmoCSConfig } from 'plasmo';
import injectFeatures from '~lib/features/injectFeatures';
import features from '~lib/features/postList';

// Content script configuration
export const config: PlasmoCSConfig = {
	matches: ['*://*.websight.blue/thread/*', '*://*.websight.blue/pm/*'],
};

injectFeatures(features);