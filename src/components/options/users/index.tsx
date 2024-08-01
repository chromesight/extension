import { useStorage } from '@plasmohq/storage/hook';
import { useCallback } from 'react';
import Switch from '~components/ui/Switch';
import Ignorator from '~components/options/users/ignorator';
import style from '../style.module.css';
import Highlighter from '~components/options/users/highlighter';
import Notes from '~components/options/users/notes';

export interface TopicNotes {
	[topicId: string]: string
}

export interface UserNotes {
	[userId: string]: string
}

export interface NoteSettings {
	enabled: boolean,
	users: UserNotes,
	topics: TopicNotes
}

export interface IgnoratedUser {
	hideTopics: boolean,
	hidePosts: boolean,
	hideAvatar: boolean,
}

export interface IgnoratedUsers {
	[userId: string]: IgnoratedUser
}

export interface IgnoratorSettings {
	enabled: boolean,
	users: IgnoratedUsers,
	badge: boolean,
}

export interface HighlightedUser {
	backgroundColor: '#000000',
	textColor: '#ffffff',
}

export interface HighlightedUsers {
	[userId: string]: HighlightedUser
}

export interface HighlighterSettings {
	enabled: boolean,
	users: HighlightedUsers,
}


export default function UsersOptions() {
	const [ignorator, setIgnorator] = useStorage<IgnoratorSettings>('ignorator', v => v === undefined ? { enabled: false, users: {}, badge: false } : v);
	const [highlighter, setHighlighter] = useStorage<HighlighterSettings>('highlighter', v => v === undefined ? { enabled: false, users: {} } : v);
	const [notes, setNotes] = useStorage<NoteSettings>('notes', v => v === undefined ? { enabled: false, users: {}, topics: {} } : v);

	const handleIgnoratorChange = useCallback((userUpdate: IgnoratedUsers) => {
		const { users } = ignorator;
		setIgnorator({ ...ignorator, users: { ...users, ...userUpdate } });
	}, [ignorator, setIgnorator]);

	const handleHighlighterChange = useCallback((userUpdate: HighlightedUsers) => {
		const { users } = highlighter;
		setHighlighter({ ...highlighter, users: { ...users, ...userUpdate } });
	}, [highlighter, setHighlighter]);

	const handleUserNotesChange = useCallback((userUpdate: UserNotes) => {
		const { users } = notes;
		setNotes({ ...notes, users: { ...users, ...userUpdate } });
	}, [notes, setNotes]);

	const handleTopicNotesChange = useCallback((topicUpdate: TopicNotes) => {
		const { topics } = notes;
		setNotes({ ...notes, topics: { ...topics, ...topicUpdate } });
	}, [notes, setNotes]);

	return (
		<>
			<div className={style.group} id="ignorator">
				<h3 className={style.heading}>User Ignorator</h3>
				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>Ignorated users</p>
						<p className={style.description}>Hide topics, posts, and/or avatar from users listed below</p>
					</div>
					<Switch
						onChange={(checked: boolean) => setIgnorator({ ...ignorator, enabled: checked })}
						checked={ignorator.enabled}
					/>
				</fieldset>
				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>Display badge</p>
						<p className={style.description}>Include the number of hidden items from ignorated users on the ChromeSight pinned icon</p>
					</div>
					<Switch
						onChange={(checked: boolean) => setIgnorator({ ...ignorator, badge: checked })}
						checked={ignorator.badge}
					/>
				</fieldset>

				<Ignorator settings={ignorator} onChange={handleIgnoratorChange} />
			</div>

			<div className={style.group} id="highlighter">
				<h3 className={style.heading}>User Highlighter</h3>
				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>Highlighted users</p>
						<p className={style.description}>Highlight topics and posts from users listed below</p>
					</div>
					<Switch
						onChange={(checked: boolean) => setHighlighter({ ...highlighter, enabled: checked })}
						checked={highlighter.enabled}
					/>
				</fieldset>

				<Highlighter settings={highlighter} onChange={handleHighlighterChange} />
			</div>

			<div className={style.group} id="notes">
				<h3 className={style.heading}>User Notes</h3>
				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>User notes</p>
						<p className={style.description}>Write private notes about users. Notes are only visible to you.</p>
					</div>
					<Switch
						onChange={(checked: boolean) => setNotes({ ...notes, enabled: checked })}
						checked={notes.enabled}
					/>
				</fieldset>

				<h3 className={style.heading}><small>User Notes</small></h3>
				<Notes type="user" notes={notes.users} onChange={handleUserNotesChange} />

				{/* <h3 className={style.heading}><small>Topic Notes</small></h3>
				<Notes type="topic" notes={notes.topics} onChange={handleTopicNotesChange} /> */}
			</div>
		</>
	);
}