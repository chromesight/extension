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

async function updateUserNote(event: Event) {
	const target = event.target as HTMLTextAreaElement;
	const post = target.closest('.post') as HTMLElement;
	const value = target.value;
	const user = post.dataset.user;
	if (value) {
		await addUserNote(user, value);
	}
	else {
		await removeUserNote(user);
	}

	// Update other user note textareas for this user on the page
	const elements = document.querySelectorAll(`.post[data-user="${post.dataset.user}"] .${CSS_PREFIX}user-note-textarea`);
	elements.forEach((element: HTMLTextAreaElement) => element.value = value);
}

function toggleUserNoteDisplay(event: MouseEvent) {
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
	textarea.addEventListener('change', updateUserNote);

	const link = document.createElement('a');
	link.href = '#';
	link.innerText = 'User Note';
	link.addEventListener('click', toggleUserNoteDisplay);

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
		const { users }:NoteSettings = await storage.get(key);
		//  TODO: display topic notes in lib/features/postList/notes.ts

		const posts = document.querySelectorAll('.post');
		for (const post of posts) {
			const p = post as HTMLElement;
			createNoteToggle(p, users[p.dataset.user]);
		}
	},
	async (addedNode) => {
		createNoteToggle(addedNode as HTMLElement);
	},
);