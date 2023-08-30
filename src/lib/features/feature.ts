export type Feature = {
	settingsKey: string;
	execute: () => Promise<void>;
	executeOnNewPost: (node: HTMLElement) => Promise<void> | undefined;
}

export type FeatureSettings = {
	enabled: boolean;
}

export default function createFeature(settingsKey: string, execute: () => Promise<void>, executeOnNewPost?: (node: HTMLElement) => Promise<void>): Feature {
	return {
		settingsKey,
		execute,
		executeOnNewPost,
	};
}