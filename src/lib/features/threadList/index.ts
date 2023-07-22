import type { Feature } from '../feature';
import highlighter from '../users/highlighter';
import ignorator from '../users/ignorator';

const features: Feature[] = [
	ignorator,
	highlighter,
];

export default features;