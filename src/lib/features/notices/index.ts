import type { Feature } from '../feature';
import keywordIgnorator from '../topicList/keywordIgnorator';
import highlighter from '../users/highlighter';
import ignorator from '../users/ignorator';

const features: Array<Feature> = [
	ignorator,
	keywordIgnorator,
	highlighter,
];

export default features;