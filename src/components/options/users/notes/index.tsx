import pageStyles from '../../style.module.css';
import styles from './style.module.css';
import Button from '~components/ui/Button';
import type { TopicNotes, UserNotes } from '..';
import type { FormEvent } from 'react';

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

export default function Notes({ type = 'user', notes, onChange: handleChange }: Notes) {
	const titleCase = type === 'user' ? 'User' : 'Topic';
	const ids = Object.keys(notes);

	const handleAddNote = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const target = event.target;
		const id = target['note-id'].value;
		const value = target['note-value'].value;

		if (!id || !value) {
			return false;
		}

		const overwriteMessage = 'A note exists with this ID. Overwrite the existing note?';
		if (notes[id] !== undefined && !confirm(overwriteMessage)) {
			return false;
		}

		const key = formatNoteKey(id, type);
		handleChange({
			[key]: value,
		});
		target.reset();
	};

	const handleRemoveNote = (id: string) => {
		const updatedNotes = notes;
		delete updatedNotes[id];
		handleChange(updatedNotes);
	};

	const handleNoteChange = (id: string, value: string) => handleChange({ [id]: value });

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
										<textarea
											value={notes[id]}
											placeholder='ID'
											onChange={event => handleNoteChange(id, event.target.value)}
										/>
									</td>
									<td>
										<Button onClick={() => handleRemoveNote(id)}>
											Remove Note
										</Button>
									</td>
								</tr>
							))
							: <tr><td colSpan={4}><p className={`${pageStyles.description} ${styles['empty-row']}`}>No {type} notes ✍️</p></td></tr>
					}
				</tbody>
			</table>
			<form onSubmit={handleAddNote}>
				<div className={`${pageStyles.group} ${pageStyles.small}`}>
					<label htmlFor="note-id" className={pageStyles.label}>Add {type} note</label>
					<label htmlFor="ignorate-user" className={pageStyles.description}>
						{
							type === 'user' ?
								<>Enter a user ID, not a display name. Find a user's ID on their profile.</>
								: <>Enter a topic ID. Find a topic's ID in the URL bar.</>
						}
					</label>
				</div>
				<div className={styles['add-note-form']}>
					<input
						id="note-id"
						name="note-id"
						type="text"
						placeholder={`${titleCase} ID`}
						required
					/>
					<textarea
						id="note-value"
						name="note-value"
						placeholder={`${titleCase} Note`}
						required
						rows={1}
					/>
					<Button>Add Note</Button>
				</div>
			</form>
		</>
	);
}