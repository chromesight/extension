export default function getUserId(topicBar: HTMLElement = document.querySelector('.userbar:nth-of-type(n+2)')): string {
	const userProfile: HTMLLinkElement = topicBar.querySelector('a:first-of-type');
	const regex = new RegExp(/\/profile\/(.*)/);
	const userId = userProfile.href.match(regex)[1];
	return userId;
}