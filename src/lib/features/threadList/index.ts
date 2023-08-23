import type { Feature } from '../feature';
import highlighter from '../users/highlighter';
import ignorator from '../users/ignorator';
import dramalinks from './dramalinks';

const features: Feature[] = [
	ignorator,
	highlighter,
	dramalinks,
];

export default features;