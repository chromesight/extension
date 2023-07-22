import { Storage } from '@plasmohq/storage';
import * as Constants from '~constants';

export default async function logDebugMessage(message: boolean | Node | string, withPrefix = true) {
	const storage = new Storage();
	const debugMode = await storage.get('debugMode');
	if (debugMode) {
		if (withPrefix) {
			const style = 'font-weight: 700; color: mediumseagreen;';
			console.log(`%c[Extension: ${Constants.EXTENSION_TITLE}]`, style, message);
		}
		else {
			console.log(message);
		}
	}
}