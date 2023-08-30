export type styleId = `cs-${string}`;

export default function insertStyles(id: styleId, rules: string, target = document.head): void {
	const element = document.createElement('style');
	element.setAttribute('id', id);
	element.innerHTML = rules;
	target.insertAdjacentElement('beforeend', element);
}