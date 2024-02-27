import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { Storage } from '@plasmohq/storage';

const key = 'userNotes';

function removeUserNote(userId: string) {
	// const storage = new Storage();
	// const ignoratorSettings:IgnoratorSettings = await storage.get(key);
	// delete ignoratorSettings.users[userId];
	// await storage.set(key, ignoratorSettings);
}

function addUserNote(userId: string) {
	// if (userId !== 'tiko') {
	// 	const storage = new Storage();
	// 	const ignoratorSettings:IgnoratorSettings = await storage.get(key);
	// 	ignoratorSettings.users[userId] = {
	// 		hideTopics: true,
	// 		hidePosts: true,
	// 	};
	// 	await storage.set(key, ignoratorSettings);
	// 	return true;
	// }
	// else {
	// 	alert('You can\'t ignorate Tiko.');
	// 	return false;
	// }
}

function handleUserNoteDisplay(event: MouseEvent) {
	event.preventDefault();
	const post: HTMLElement = (event.target as HTMLElement).closest('.post');
	const userId = post.dataset.user;
}

function addNoteLink(post: HTMLElement) {
	const header = post.querySelector('.message-top');

	const link = document.createElement('a');
	link.href = '#';
	link.innerText = 'User Note';
	link.addEventListener('click', handleUserNoteDisplay);

	const wrapper = document.createElement('span');
	wrapper.insertAdjacentText('beforeend', ' | ');
	wrapper.insertAdjacentElement('beforeend', link);
	header.insertAdjacentElement('beforeend', wrapper);
}

export default createFeature(
	key,
	async () => {
		logDebugMessage('Feature Enabled: User Notes');

		const storage = new Storage({ area: 'local' });
		// const { users, badge }:IgnoratorSettings = await storage.get(key);
		//  TODO: display user notes toggle button and textarea

		// Add a link to add a user note to all posts
		const allPosts = document.querySelectorAll('.post');
		for (const post of allPosts) {
			addNoteLink(post as HTMLElement);
		}
	},
	async (addedNode) => {
		addNoteLink(addedNode as HTMLElement);
	},
);