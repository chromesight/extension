import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { Storage } from '@plasmohq/storage';
import type { NoteSettings } from '~components/options/users';
import { CSS_PREFIX } from '~constants';

const key = 'notes';

async function removeUserNote(userId: string) {
	const storage = new Storage();
	const settings:NoteSettings = await storage.get(key);
	delete settings.users[userId];
	await storage.set(key, settings);
}

async function addUserNote(userId: string, note: string) {
	const storage = new Storage();
	const settings: NoteSettings = await storage.get(key);
	settings.users[userId] = note;
	await storage.set(key, settings);
}

function handleUserNoteDisplay(event: MouseEvent) {
	event.preventDefault();
	const post = (event.target as HTMLLinkElement).closest('.post');
	const textarea: HTMLElement = post.querySelector(`.${CSS_PREFIX}user-note-textarea`);
	const display = textarea.style.display;
	textarea.style.display = display === 'none' ? 'block' : 'none';
}

function createNoteToggle(post: HTMLElement, note?: string) {
	const header = post.querySelector('.message-top');

	const textarea = document.createElement('textarea');
	textarea.classList.add(`${CSS_PREFIX}user-note-textarea`);
	textarea.id = `${CSS_PREFIX}user-note-textarea-${post.dataset.post}`;
	textarea.value = note ?? '';
	textarea.style.display = 'none';
	textarea.addEventListener('change', event => {
		const value = (event.target as HTMLTextAreaElement).value;
		const user = post.dataset.user;
		if (value) {
			addUserNote(user, value);
		}
		else {
			removeUserNote(user);
		}

		// Update other user note textareas for this user on the page
		const elements = document.querySelectorAll(`.post[data-user="${post.dataset.user}"] .${CSS_PREFIX}user-note-textarea`);
		elements.forEach((element: HTMLTextAreaElement) => element.value = value);
	});

	const link = document.createElement('a');
	link.href = '#';
	link.innerText = 'User Note';
	link.addEventListener('click', handleUserNoteDisplay);

	const wrapper = document.createElement('span');
	wrapper.insertAdjacentText('beforeend', ' | ');
	wrapper.insertAdjacentElement('beforeend', link);
	header.insertAdjacentElement('beforeend', wrapper);
	header.insertAdjacentElement('afterend', textarea);
}

export default createFeature(
	key,
	async () => {
		logDebugMessage('Feature Enabled: User Notes');

		const storage = new Storage();
		const { users, topics }:NoteSettings = await storage.get(key);
		//  TODO: display topic notes in lib/features/postList/notes.ts
		//  TODO: display user notes toggle button and textarea

		// Add a link to user notes on all posts
		const allPosts = document.querySelectorAll('.post');
		for (const post of allPosts) {
			createNoteToggle(post as HTMLElement, users[(post as HTMLElement).dataset.user]);
		}
	},
	async (addedNode) => {
		createNoteToggle(addedNode as HTMLElement);
	},
);