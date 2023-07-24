import type { PlasmoCSConfig } from 'plasmo';
import injectFeatures from '~lib/features/injectFeatures';
import threadListFeatures from '~lib/features/threadList';

// Content script configuration
export const config: PlasmoCSConfig = {
	matches: ['*://*.websight.blue/', '*://*.websight.blue/threads/*', '*://*.websight.blue/search/*'],
};

injectFeatures(threadListFeatures);