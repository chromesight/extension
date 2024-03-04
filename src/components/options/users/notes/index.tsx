import pageStyles from '../../style.module.css';
import styles from './style.module.css';
import Button from '~components/ui/Button';
import type { TopicNotes, UserNotes } from '..';
import { useState, useEffect, type FormEvent, type ChangeEventHandler } from 'react';

type Notes = {
	type?: 'user' | 'topic';
	notes: UserNotes | TopicNotes;
	onChange: (change: { [id: string]: string; }) => void;
}

const formatNoteKey = (id: string, type: string) => {
	if (type === 'topic') {
		return id;
	}
	else {
		return id.toLowerCase().trim().replaceAll(/\s/g, '+');
	}
};

function Textarea({ note, onChange }: { note: string; onChange: ChangeEventHandler<HTMLTextAreaElement>; }) {
	const [value, setValue] = useState(note);

	useEffect(() => setValue(note), [note]);

	return <textarea
		value={value}
		placeholder='ID'
		onChange={event => {
			setValue(event.target.value);
			onChange(event);
		}}
	/>;
}

export default function Notes({ type = 'user', notes, onChange: handleChange }: Notes) {
	const [topicIdGuess, setTopicIdGuess] = useState(false);
	const titleCase = type === 'user' ? 'User' : 'Topic';
	const ids = Object.keys(notes);

	const handleAddNote = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const target = event.target as HTMLFormElement;
		const id = target['note-id'].value;
		const value = target['note-value'].value;

		// Missing values
		if (!id || !value) {
			return false;
		}

		// Confirm overwrite existing note
		const overwriteMessage = `A ${type} note exists with this ID. Overwrite the existing note?`;
		if (notes[id] !== undefined && !confirm(overwriteMessage)) {
			return false;
		}

		// Add to notes
		const key = formatNoteKey(id, type);
		handleUpdateNote(key, value);

		// Reset form and error messages
		target.reset();
		setTopicIdGuess(false);
	};

	const handleRemoveNote = (id: string) => {
		const updatedNotes = notes;
		delete updatedNotes[id];
		handleChange(updatedNotes);
	};

	const handleUpdateNote = (id: string, value: string) => handleChange({ [id]: value });

	return (
		<>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>{titleCase} ID</th>
						<th>Note</th>
						<th>Remove</th>
					</tr>
				</thead>
				<tbody>
					{
						ids.length ?
							ids.map(id => (
								<tr key={id}>
									<td>{id.replaceAll('+', ' ')}</td>
									<td>
										<Textarea
											note={notes[id]}
											onChange={event => handleUpdateNote(id, event.target.value)}
										/>
									</td>
									<td>
										<Button onClick={() => handleRemoveNote(id)}>
											Remove Note
										</Button>
									</td>
								</tr>
							))
							: <tr><td colSpan={4}><p className={`${pageStyles.description} ${styles['empty-row']}`}>No {type} notes {type === 'user' ? '🧑‍💻' : '📃'}✍️</p></td></tr>
					}
				</tbody>
			</table>

			<form onSubmit={handleAddNote}>
				<div className={`${pageStyles.group} ${pageStyles.small}`}>
					<label htmlFor={`note-id-${type}`} className={pageStyles.label}>Add {type} note</label>
					<label htmlFor={`note-id-${type}`} className={pageStyles.description}>
						{
							type === 'user' ?
								<>Enter a user ID, not a display name. Find a user's ID on their profile.</>
								: <>Enter a topic ID. Find a topic's ID in the URL bar.</>
						}
					</label>
				</div>
				<div className={styles['add-note-form']}>
					<input
						required
						id={`note-id-${type}`}
						name="note-id"
						type="text"
						placeholder={`${titleCase} ID`}
						onChange={event => {
							if (type === 'user') {
								const isAllDigits = new RegExp(/\d{4,}/);
								if (isAllDigits.test(event.target.value)) {
									setTopicIdGuess(true);
								}
								else {
									setTopicIdGuess(false);
								}
							}
						}}
					/>
					<textarea
						required
						id={`note-value-${type}`}
						name="note-value"
						placeholder={`${titleCase} Note`}
						rows={1}
					/>
					<Button>Add Note</Button>
				</div>
				{type === 'user' && topicIdGuess && <p className={styles.danger}>Did you mean to enter a topic ID below?</p>}
			</form>
		</>
	);
}