import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { CSS_PREFIX } from '~constants';
import insertStyles from '~lib/insertStyles';

let cursorPosition: number | null = null;
const replyBox: HTMLElement = document.querySelector('.reply-form-inner');
const textarea: HTMLTextAreaElement = replyBox.querySelector('textarea');

function insertText(text: string): void {
	if (cursorPosition === null) {
		textarea.value += text;
	}
	else {
		const { value } = textarea;
		textarea.value = value.slice(0, cursorPosition) + text + value.slice(cursorPosition);
	}
}

function handleTextFormatting(defaultText: string, start: string, end: string | boolean = false, ignoreEmptyLines = true): void {
	const selection = window.getSelection();
	if (selection.anchorNode === replyBox && selection.type === 'Range') {
		let selectedLines = selection.toString().split('\n');
		if (ignoreEmptyLines) {
			selectedLines = selectedLines.filter(line => line);
		}
		const modifiedLines = selectedLines.map(line => `${start}${line.trim()}${end ? end : ''}${line.charAt(line.length - 1) === ' ' ? ' ' : ''}`);
		textarea.setRangeText(modifiedLines.join('\n'));
	}
	else {
		insertText(defaultText);
	}
}

function handleBlockFormatting(defaultText: string, start: string, end: string | boolean = false): void {
	const selection = window.getSelection();
	if (selection.anchorNode === replyBox && selection.type === 'Range') {
		textarea.setRangeText(`${start}${selection.toString()}${end}`);
	}
	else {
		insertText(defaultText);
	}
}

function createButton(text: string, cb: () => void): HTMLElement {
	const button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.addEventListener('click', cb);
	button.textContent = text;
	return button;
}

function createToolbar(): HTMLElement {
	const h1: HTMLElement = createButton('H1', () => handleTextFormatting('# H1 ', '\n# '));
	const h2: HTMLElement = createButton('H2', () => handleTextFormatting('## H2 ', '\n## '));
	const h3: HTMLElement = createButton('H3', () => handleTextFormatting('### H3 ', '\n### '));
	const h4: HTMLElement = createButton('H4', () => handleTextFormatting('#### H4 ', '\n#### '));
	const bold: HTMLElement = createButton('Bold', () => handleTextFormatting('*Bolded text* ', '*', '*'));
	const italics: HTMLElement = createButton('Italics', () => handleTextFormatting('_Italicized text_ ', '_', '_'));
	const quote: HTMLElement = createButton('Quote', () => handleTextFormatting('> Quoted text', '> ', false, false));
	const strikethrough: HTMLElement = createButton('Strikethrough', () => handleTextFormatting('~~Strikethrough~~', '~~', '~~', false));
	const monospace: HTMLElement = createButton('Monospace', () => handleTextFormatting('`Monospace` ', '`', '`'));
	const link: HTMLElement = createButton('Link', () => insertText('[Link text](https://example.com) '));
	const image: HTMLElement = createButton('Image', () => insertText('![Alt text](https://example.com/image.png) '));
	const spoiler: HTMLElement = createButton('Spoiler', () => {
		const defaultText = '<spoiler>\n\n</spoiler>';
		const start = '<spoiler>\n';
		const end = '\n</spoiler>';
		handleBlockFormatting(defaultText, start, end);
	});
	const textBlock: HTMLElement = createButton('Text Block', () => {
		const defaultText = '\n```\nText Block\n```';
		const start = '\n```\n';
		const end = '\n```';
		handleBlockFormatting(defaultText, start, end);
	});
	const codeBlock: HTMLElement = createButton('Code Block', () => {
		const defaultText = '\n```javascript\nconst foo = bar;\n```';
		const start = '\n```javascript\n';
		const end = '\n```';
		handleBlockFormatting(defaultText, start, end);
	});

	// Add buttons to toolbar
	const buttonGroups = [
		// Headings
		[
			h1,
			h2,
			h3,
			h4,
		],
		// Text formatting
		[
			bold,
			italics,
			quote,
			strikethrough,
			monospace,
		],
		// Embeds
		[
			link,
			image,
		],
		// Blocks
		[
			spoiler,
			textBlock,
			codeBlock,
		],
	];
	const toolbar = document.createElement('div');
	toolbar.classList.add(`${CSS_PREFIX}markdown-toolbar`);
	buttonGroups.forEach(buttonGroup => {
		const group = document.createElement('div');
		group.classList.add(`${CSS_PREFIX}markdown-buttons`);
		buttonGroup.forEach(button => {
			group.insertAdjacentElement('beforeend', button);
		});
		toolbar.insertAdjacentElement('beforeend', group);
	});

	return toolbar;
}

export default createFeature(
	'markdownButtons',
	async () => {
		logDebugMessage('Feature Enabled: Markdown buttons for reply box');

		const toolbar = createToolbar();
		replyBox.insertAdjacentElement('beforebegin', toolbar);

		textarea.addEventListener('blur', (event) => cursorPosition = (event.target as HTMLTextAreaElement).selectionStart);

		const rules = `
		.${CSS_PREFIX}markdown-toolbar {
			display: flex;
			flex-wrap: wrap;
			padding: 6px;
			background: var(--InputBG);
			border-top-width: 1px;
			border-right-width: 1px;
			border-left-width: 1px;
			border-bottom-width: 0;
			border-style: solid;
			border-color: rgb(118, 118, 118);
		}
		.${CSS_PREFIX}markdown-buttons {
			margin-right: 6px;
			padding-right: 6px;
			border-right: 2px solid rgb(118, 118, 118);
		}
		.${CSS_PREFIX}markdown-buttons:last-of-type {
			border-right: 0;
		}
		.${CSS_PREFIX}markdown-buttons > button {
			padding: 0 3px;
			margin: 0 2px;
			font-size: 12px;
		}
		.${CSS_PREFIX}markdown-buttons > button:first-of-type {
			margin-left: 0;
		}
		.${CSS_PREFIX}markdown-buttons > button:last-of-type {
			margin-right: 0;
		}`;
		insertStyles(`${CSS_PREFIX}markdown-button-styles`, rules);
	},
);