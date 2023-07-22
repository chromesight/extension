export type Feature = {
    settingsKey: string;
    execute: () => Promise<void>;
	executeOnNewPost: (node: HTMLElement) => Promise<void>;
}

export type FeatureSettings = {
	enabled: boolean;
}

export default function createFeature(settingsKey: string, execute: () => Promise<void>, executeOnNewPost?: (node: HTMLElement) => Promise<void>) {
	return {
		settingsKey,
		execute,
		executeOnNewPost,
	};
}