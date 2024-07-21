import type { Feature } from '../feature';
import highlighter from '../users/highlighter';
import ignorator from '../users/ignorator';
import dramalinks from './dramalinks';
import keywordIgnorator from './keywordIgnorator';

const features: Feature[] = [
	ignorator,
	keywordIgnorator,
	highlighter,
	dramalinks,
];

export default features;