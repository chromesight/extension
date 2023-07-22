import type { PlasmoCSConfig } from 'plasmo';
import injectFeatures from '~lib/features/injectFeatures';
import postsFeatures from '~lib/features/posts';

// Content script configuration
export const config: PlasmoCSConfig = {
	matches: ['*://*.websight.blue/thread/*', '*://*.websight.blue/pm/*'],
};

injectFeatures(postsFeatures);