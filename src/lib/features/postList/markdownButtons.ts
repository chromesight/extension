import logDebugMessage from '~lib/logs/debug';
import createFeature from '../feature';
import { CSS_PREFIX } from '~constants';
import insertStyles from '~lib/insertStyles';
import getUserId from '~lib/getUserIdFromTopicBar';

let cursorPosition: number | null = null;

function insertText(target: HTMLInputElement | HTMLTextAreaElement, text: string): void {
	if (target === null) {
		target.value += text;
	}
	else {
		const { value } = target;
		target.value = value.slice(0, cursorPosition) + text + value.slice(cursorPosition);
	}
}

function handleTextFormatting(target: HTMLInputElement | HTMLTextAreaElement, defaultText: string, start: string, end: string | boolean = false, ignoreEmptyLines = true): void {
	const selection = window.getSelection();
	if (selection.anchorNode === target.parentNode && selection.type === 'Range') {
		let selectedLines = selection.toString().split('\n');
		if (ignoreEmptyLines) {
			selectedLines = selectedLines.filter(line => line);
		}
		const modifiedLines = selectedLines.map(line => `${start}${line.trim()}${end ? end : ''}${line.charAt(line.length - 1) === ' ' ? ' ' : ''}`);
		target.setRangeText(modifiedLines.join('\n'));
	}
	else {
		insertText(target, defaultText);
	}
}

function handleBlockFormatting(target: HTMLInputElement | HTMLTextAreaElement, defaultText: string, start: string, end: string | boolean = false): void {
	const selection = window.getSelection();
	if (selection.anchorNode === target.parentNode && selection.type === 'Range') {
		target.setRangeText(`${start}${selection.toString()}${end}`);
	}
	else {
		insertText(target, defaultText);
	}
}

function createButton(text: string, cb: () => void): HTMLElement {
	const button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.addEventListener('click', cb);
	button.textContent = text;
	return button;
}

function createToolbar(target): HTMLElement {
	const h1: HTMLElement = createButton('H1', () => handleTextFormatting(target, '# H1 ', '\n# '));
	const h2: HTMLElement = createButton('H2', () => handleTextFormatting(target, '## H2 ', '\n## '));
	const h3: HTMLElement = createButton('H3', () => handleTextFormatting(target, '### H3 ', '\n### '));
	const h4: HTMLElement = createButton('H4', () => handleTextFormatting(target, '#### H4 ', '\n#### '));
	const bold: HTMLElement = createButton('Bold', () => handleTextFormatting(target, '*Bolded text* ', '*', '*'));
	const italics: HTMLElement = createButton('Italics', () => handleTextFormatting(target, '_Italicized text_ ', '_', '_'));
	const quote: HTMLElement = createButton('Quote', () => handleTextFormatting(target, '> Quoted text', '> ', false, false));
	const strikethrough: HTMLElement = createButton('Strikethrough', () => handleTextFormatting(target, '~~Strikethrough~~', '~~', '~~', false));
	const monospace: HTMLElement = createButton('Monospace', () => handleTextFormatting(target, '`Monospace` ', '`', '`'));
	const link: HTMLElement = createButton('Link', () => insertText(target, '[Link text](https://example.com) '));
	const image: HTMLElement = createButton('Image', () => insertText(target, '![Alt text](https://example.com/image.png) '));
	const spoiler: HTMLElement = createButton('Spoiler', () => {
		const start = '<spoiler caption="spoiler">\n';
		const end = '\n</spoiler>';
		const defaultText = `${start}${end}`;
		handleBlockFormatting(target, defaultText, start, end);
	});
	const ascii: HTMLElement = createButton('ASCII', () => {
		const start = '<ascii>\n';
		const end = '\n</ascii>';
		const defaultText = `${start}${end}`;
		handleBlockFormatting(target, defaultText, start, end);
	});
	const textBlock: HTMLElement = createButton('Text Block', () => {
		const start = '\n```\n';
		const end = '\n```';
		const defaultText = `${start}Text Block${end}`;
		handleBlockFormatting(target, defaultText, start, end);
	});
	const codeBlock: HTMLElement = createButton('Code Block', () => {
		const start = '\n```javascript\n';
		const end = '\n```';
		const defaultText = `${start}const foo = bar;${end}`;
		handleBlockFormatting(target, defaultText, start, end);
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
			ascii,
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

function createPostEditToolbars() {
	const userId = getUserId();
	if (userId) {
		const postEditContainers = document.querySelectorAll(`.post[data-user="${userId}"] div[id*="post-edit-"]`);
		const config = { childList: true };
		postEditContainers.forEach(element => {
			const observer = new MutationObserver((mutationList) => {
				for (const mutation of mutationList) {
					if (mutation.type === 'childList' && mutation.addedNodes.length) {
						const postEditContainer = mutation.target as HTMLElement;
						const postEditForm = postEditContainer.querySelector('form');
						const postEditTextarea = postEditContainer.querySelector('textarea');
						const postEditToolbar = createToolbar(postEditTextarea);
						postEditForm.insertAdjacentElement('afterbegin', postEditToolbar);
						postEditTextarea.addEventListener('blur', (event) => cursorPosition = (event.target as HTMLTextAreaElement).selectionStart);
					}
				}
			});
			observer.observe(element, config);
		});
	}
}

function createReplyToolbar(textarea: HTMLTextAreaElement) {
	textarea.addEventListener('blur', (event) => cursorPosition = (event.target as HTMLTextAreaElement).selectionStart);

	// Add toolbar to reply textareaarea
	const replyToolbar = createToolbar(textarea);
	textarea.insertAdjacentElement('beforebegin', replyToolbar);
}

export default createFeature(
	'markdownButtons',
	async () => {
		logDebugMessage('Feature Enabled: Markdown buttons for reply box');

		// Add post create toolbars
		const textarea: HTMLTextAreaElement = document.querySelector('#reply-content');
		createReplyToolbar(textarea);

		// Add post edit toolbar
		createPostEditToolbars();

		// Insert toolbar styles
		const rules = `
		.${CSS_PREFIX}markdown-toolbar {
			box-sizing: border-box;
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
			width: 100%;
		}
		textarea[name=message] {
			box-sizing: border-box;
		}
		.reply-form-inner .${CSS_PREFIX}markdown-toolbar {
			width: initial;
		}
		.message .${CSS_PREFIX}markdown-toolbar {
			max-width: 100%;
		}
		@media all and (min-width: 768px) {
			.${CSS_PREFIX}markdown-toolbar {
				width: ${textarea.offsetWidth}px;
			}
			.message .${CSS_PREFIX}markdown-toolbar {
				width: 40em;
			}
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
			margin: 2px;
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