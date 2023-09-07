import { useStorage } from '@plasmohq/storage/hook';
import { useCallback } from 'react';
import Switch from '~components/ui/Switch';
import Ignorator from '~components/options/users/ignorator';
import style from '../style.module.css';
import Highlighter from './highlighter';

export interface IgnoratedUser {
	hideTopics: true,
	hidePosts: true,
}

export interface IgnoratedUsers {
	[userId: string]: IgnoratedUser
}

export interface IgnoratorSettings {
	enabled: boolean,
	users: IgnoratedUsers,
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
	const [ignorator, setIgnorator] = useStorage<IgnoratorSettings>('ignorator', v => v === undefined ? { enabled: false, users: {} } : v);
	const [highlighter, setHighlighter] = useStorage<HighlighterSettings>('highlighter', v => v === undefined ? { enabled: false, users: {} } : v);

	const handleIgnoratorUserState = useCallback((userUpdate: IgnoratedUsers) => {
		const { enabled, users } = ignorator;
		setIgnorator({ enabled, users: { ...users, ...userUpdate } });
	}, [ignorator, setIgnorator]);

	const handleHighlighterUserState = useCallback((userUpdate: HighlightedUsers) => {
		const { enabled, users } = highlighter;
		setHighlighter({ enabled, users: { ...users, ...userUpdate } });
	}, [highlighter, setHighlighter]);

	return (
		<>
			<div className={style.group} id="ignorator">
				<h3 className={style.heading}>Ignorator</h3>
				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>Ignorated users</p>
						<p className={style.description}>Hide topics and posts from users listed below</p>
					</div>
					<Switch
						onChange={(checked: boolean) => setIgnorator({ ...ignorator, enabled: checked })}
						checked={ignorator.enabled}
					/>
				</fieldset>

				<Ignorator settings={ignorator} handleUserState={handleIgnoratorUserState} />
			</div>
			<div className={style.group} id="highlighter">
				<h3 className={style.heading}>Highlighter</h3>
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

				<Highlighter settings={highlighter} handleUserState={handleHighlighterUserState} />
			</div>
		</>
	);
}