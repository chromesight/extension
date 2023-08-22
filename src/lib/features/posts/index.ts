import type { Feature } from '../feature';
import dramalinks from '../threadList/dramalinks';
import highlighter from '../users/highlighter';
import ignorator from '../users/ignorator';
import autoRedirect from './autoRedirect';
import autoScroll from './autoScroll';
import embedTwitter from './embedTwitter';
import filterMe from './filterMe';
import markTopicCreator from './markTopicCreator';
import markdownButtons from './markdownButtons';
import nwsTopicImages from './nwsTopicImages';
import postNumbers from './postNumbers';

const features: Feature[] = [
	nwsTopicImages,
	ignorator,
	highlighter,
	markTopicCreator,
	postNumbers,
	autoScroll,
	autoRedirect,
	filterMe,
	embedTwitter,
	markdownButtons,
	dramalinks,
];

export default features;