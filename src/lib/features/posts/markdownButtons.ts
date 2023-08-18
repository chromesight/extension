import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { CSS_PREFIX } from '~constants';

let cursorPosition: number;

// Either insert text at last known cursor position or append to end of textarea
function insertText(text: string): void {
	if (text) {
		const textarea: HTMLElement = document.querySelector('#reply-content');
		if (cursorPosition) {
			textarea.value = textarea.value.slice(0, cursorPosition) + text + textarea.value.slice(cursorPosition);
		}
		else {
			textarea.value += text;
		}
	}
}

// Either wrap selected text in markdown formatting or insert markdown formatting placeholders
function handleTextFormatting(text: string, symbol: string, start = true, end = true): void {
	const selection = window.getSelection();
	const replyBox: HTMLElement = document.querySelector('.reply-form-inner');
	if (selection.anchorNode === replyBox && selection.type === 'Range') {
		const textarea = replyBox.querySelector('textarea');
		const selectedText = selection.toString();
		if (start && end) {
			textarea.setRangeText(`${symbol}${selectedText}${symbol}`);
		}
		else if (start) {
			textarea.setRangeText(`${symbol}${selectedText}`);
		}
	}
	else if (start && end) {
		insertText(`${symbol}${text}${symbol} `);
	}
	else if (start) {
		insertText(`${symbol}${text} `);
	}
}

function createButton(text: string, cb: () => void): HTMLElement {
	const button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.addEventListener('click', cb);
	button.textContent = text;
	return button;
}

function createButtons(): HTMLElement {
	const bold: HTMLElement = createButton('Bold', () => handleTextFormatting('Bold', '*'));
	const italics: HTMLElement = createButton('Italics', () => handleTextFormatting('Italics', '_'));
	const quote: HTMLElement = createButton('Quote', () => handleTextFormatting('Quote', '> ', true, false));
	const link: HTMLElement = createButton('Link', () => insertText('[Link text](https://example.com) '));
	const image: HTMLElement = createButton('Image', () => insertText('![Alt text](https://example.com/image.png) '));
	const monospace: HTMLElement = createButton('Monospace', () => handleTextFormatting('Monospace', '`'));
	const h1: HTMLElement = createButton('H1', () => handleTextFormatting('H1', '# ', true, false));
	const h2: HTMLElement = createButton('H2', () => handleTextFormatting('H2', '## ', true, false));
	const h3: HTMLElement = createButton('H3', () => handleTextFormatting('H3', '### ', true, false));
	const h4: HTMLElement = createButton('H4', () => handleTextFormatting('H4', '#### ', true, false));

	const firstRow = document.createElement('div');
	firstRow.classList.add(`${CSS_PREFIX}markdown-buttons`);
	firstRow.insertAdjacentElement('beforeend', h1);
	firstRow.insertAdjacentElement('beforeend', h2);
	firstRow.insertAdjacentElement('beforeend', h3);
	firstRow.insertAdjacentElement('beforeend', h4);

	const secondRow = document.createElement('div');
	secondRow.classList.add(`${CSS_PREFIX}markdown-buttons`);
	secondRow.insertAdjacentElement('beforeend', bold);
	secondRow.insertAdjacentElement('beforeend', italics);
	secondRow.insertAdjacentElement('beforeend', quote);
	secondRow.insertAdjacentElement('beforeend', link);
	secondRow.insertAdjacentElement('beforeend', image);
	secondRow.insertAdjacentElement('beforeend', monospace);

	const container = document.createElement('div');
	container.insertAdjacentElement('beforeend', firstRow);
	container.insertAdjacentElement('beforeend', secondRow);

	return container;
}

export default createFeature(
	'markdownButtons',
	async () => {
		logDebugMessage('Feature Enabled: Markdown buttons for reply box');

		// Save cursor position when it changes
		const replyBox: HTMLElement = document.querySelector('.reply-form-inner');
		replyBox.querySelector('textarea').addEventListener('blur', (event) => cursorPosition = event.target.selectionStart);

		// Create and insert markdown buttons
		const buttons = createButtons();
		replyBox.insertAdjacentElement('beforebegin', buttons);

		// Style the markdown buttons
		const rules = `
		.${CSS_PREFIX}markdown-buttons {
			margin-bottom: 0.5em;
		}
		.${CSS_PREFIX}markdown-buttons:first-of-type {
			margin-bottom: 2px;
		}
		.${CSS_PREFIX}markdown-buttons > button {
			margin: 0 2px;
		}
		.${CSS_PREFIX}markdown-buttons > button:first-of-type {
			margin-left: 0;
		}
		.${CSS_PREFIX}markdown-buttons > button:last-of-type {
			margin-right: 0;
		}`;
		const element = document.createElement('style');
		element.innerHTML = rules;
		element.id = `${CSS_PREFIX}markdown-button-styles`;
		document.head.insertAdjacentElement('beforeend', element);
	},
);