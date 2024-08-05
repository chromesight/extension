import type { PlasmoCSConfig } from 'plasmo';
import injectFeatures from '~lib/features/injectFeatures';
import features from '~lib/features/general';

// Content script configuration
export const config: PlasmoCSConfig = {
	matches: ['*://*.websight.blue/', '*://websight.blue/', '*://*.websight.blue/*', '*://websight.blue/*'],
};

injectFeatures(features);