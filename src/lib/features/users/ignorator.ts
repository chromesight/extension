import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { Storage } from '@plasmohq/storage';
import type { IgnoratorSettings } from '~components/options/users';
import { CSS_PREFIX } from '~constants';
import insertStyles, { type styleId } from '~lib/insertStyles';
import { sendToBackground } from '@plasmohq/messaging';

const storageKey = 'ignorator';
const stylesId: styleId = `${CSS_PREFIX}ignorator`;
let ignoratorBadge = false;
const ignoratedUsers = [];
const ignoratedItems = [];

export async function removeUserFromIgnorator(userId: string) {
	const storage = new Storage();
	const ignoratorSettings:IgnoratorSettings = await storage.get(storageKey);
	delete ignoratorSettings.users[userId];
	await storage.set(storageKey, ignoratorSettings);
}

export async function addUserToIgnorator(userId: string) {
	if (userId !== 'tiko') {
		const storage = new Storage();
		const ignoratorSettings:IgnoratorSettings = await storage.get(storageKey);
		ignoratorSettings.users[userId] = {
			hideTopics: true,
			hidePosts: true,
			hideAvatar: false,
		};
		await storage.set(storageKey, ignoratorSettings);
		return true;
	}
	else {
		alert('You can\'t ignorate Tiko.');
		return false;
	}
}

async function confirmIgnoratorAddition(e) {
	e.preventDefault();

	const post = e.target.closest('.post');
	const userId = post.dataset.user;

	if (post.dataset.user !== 'tiko') {
		const confirmed = confirm('Are you sure you want to ignorate this user?');
		if (confirmed) {
			const ignorated = await addUserToIgnorator(userId);
			if (ignorated) {
				// We only target posts, since this function is only ever triggered from the message list
				const selector = `.post[data-user="${userId}"], .message-contents blockquote[data-user="${userId}"]`;
				const styles = document.querySelector(`#${stylesId}`);
				const element = styles ?? document.createElement('style');
				element.innerHTML = `${element.innerHTML}\n${selector} { display: none; }`;
				if (!styles) {
					element.id = `#${stylesId}`;
					document.head.appendChild(element);
				}

				// Add user's posts to ignorated post count badge
				const postIds = extractPostIds(document.querySelectorAll(selector));
				ignoratedItems.push(...postIds);
				updateBadge(ignoratedItems.length);
				ignoratedUsers.push(userId);
			}
		}
	}
	else {
		alert('You can\'t ignorate Tiko');
	}
}

function addIgnoratorLink(post: HTMLElement) {
	const header = post.querySelector('.message-top');

	const link = document.createElement('a');
	link.href = '#';
	link.innerText = 'Ignorate User';
	link.addEventListener('click', confirmIgnoratorAddition);

	const wrapper = document.createElement('span');
	wrapper.insertAdjacentText('beforeend', ' | ');
	wrapper.insertAdjacentElement('beforeend', link);
	header.insertAdjacentElement('beforeend', wrapper);
}

function extractPostIds(nodes: NodeList) {
	return [...nodes].map((element: HTMLElement) => element.dataset.post);
}

function updateBadge(count: number) {
	if (ignoratorBadge) {
		sendToBackground({
			name: 'badge',
			body: {
				ignoratedItems: count.toString(),
			},
		});
	}
}

export default createFeature(
	'ignorator',
	async () => {
		logDebugMessage('Feature Enabled: Ignorator');

		const storage = new Storage();
		const { users, badge }:IgnoratorSettings = await storage.get(storageKey);

		ignoratedUsers.push(...Object.keys(users));
		ignoratorBadge = badge;

		// Create CSS rule to hide all posts, threads, and any notices from ignorated users
		const badgeSelectors: string[] = [];
		const ignoreSelectors = ignoratedUsers.map((user) => {
			const userSelector = [];

			if (users[user].hideTopics && (window.location.pathname.includes('/threads/') || window.location.pathname === '/')) {
				userSelector.push(`.grid tr[data-user="${user}"]`);
				badgeSelectors.push(`.grid tr[data-user="${user}"]`);
			}

			if (users[user].hidePosts && window.location.pathname.includes('/thread/')) {
				userSelector.push(`.post[data-user="${user}"], .message-contents blockquote[data-user="${user}"]`);
				badgeSelectors.push(`.post[data-user="${user}"]`);
			}

			if (!users[user].hidePosts && users[user].hideAvatar && window.location.pathname.includes('/thread/')) {
				userSelector.push(`.post[data-user="${user}"] .userpic img`);
			}

			if (users[user].hideAvatar && window.location.pathname.includes(`/profile/${user}`)) {
				userSelector.push('.grid td > img');
			}

			if (window.location.pathname.includes('/notices/')) {
				userSelector.push(`.grid tr[id*="${user}"]`);
				badgeSelectors.push(`.grid tr[id*="${user}"]`);
			}

			return userSelector.join(',');
		}).filter(selector => selector !== '');
		if (ignoreSelectors.length) {
			const rules = `${ignoreSelectors.join(',')} { display: none }`;
			insertStyles(stylesId, rules);
		}

		// Count number of ignorated posts and display as badge on extension
		if (badgeSelectors.length) {
			const posts = document.querySelectorAll(badgeSelectors.join(','));
			const postIds = extractPostIds(posts);
			ignoratedItems.push(...postIds);
		}
		updateBadge(ignoratedItems.length);

		// Add a link to ignorate a user to all posts
		const allPosts = document.querySelectorAll('.post');
		for (const post of allPosts) {
			addIgnoratorLink(post as HTMLElement);
		}
	},
	async (addedNode) => {
		addIgnoratorLink(addedNode as HTMLElement);

		// If this post is from an ignorated user, add it to the ignorated user post count badge
		const postId = addedNode.dataset.post;
		if (ignoratedUsers.includes(addedNode.dataset.user) && !ignoratedItems.includes(postId)) {
			ignoratedItems.push(postId);
			updateBadge(ignoratedItems.length);
		}
	},
);