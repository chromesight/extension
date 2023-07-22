import type { PlasmoCSConfig } from 'plasmo';
import injectFeatures from '~lib/features/injectFeatures';
import noticesFeatures from '~lib/features/notices';

// Content script configuration
export const config: PlasmoCSConfig = {
	matches: ['*://*.websight.blue/notices/*'],
};

injectFeatures(noticesFeatures);