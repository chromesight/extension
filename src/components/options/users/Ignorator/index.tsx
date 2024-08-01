import Switch from '~components/ui/Switch';
import pageStyles from '../../style.module.css';
import styles from './style.module.css';
import Button from '~components/ui/Button';
import { addUserToIgnorator, removeUserFromIgnorator } from '~lib/features/users/ignorator';

function IgnoratedUsers({ users, onChange }) {
	const userIds = Object.keys(users);
	if (userIds.length) {
		const rows = userIds.map(key => {
			return (
				<tr key={key}>
					<td>{key.replaceAll('+', ' ')}</td>
					<td>
						<Switch
							onChange={(checked: boolean) => {
								const newValue = {};
								newValue[key] = { ...users[key], hideTopics: checked };
								onChange(newValue);
							}}
							checked={users[key].hideTopics}
						/>
					</td>
					<td>
						<Switch
							onChange={(checked: boolean) => {
								const newValue = {};
								newValue[key] = { ...users[key], hidePosts: checked };
								onChange(newValue);
							}}
							checked={users[key].hidePosts}
						/>
					</td>
					<td>
						<Switch
							onChange={(checked: boolean) => {
								const newValue = {};
								newValue[key] = { ...users[key], hideAvatar: checked };
								onChange(newValue);
							}}
							checked={users[key].hideAvatar || users[key].hidePosts}
							disabled={users[key].hidePosts}
						/>
					</td>
					<td>
						<Button
							onClick={() => {
								removeUserFromIgnorator(key);
							}}
						>
							Remove User
						</Button>
					</td>
				</tr>
			);
		});
		return rows;
	}
	else {
		return (<tr>
			<td colSpan={5}><p className={`${pageStyles.description} ${styles['empty-row']}`}>No users currently ignorated ✨</p></td>
		</tr>);
	}
}

export default function Ignorator({ settings, onChange }) {
	return (
		<>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>User ID</th>
						<th>Hide Topics</th>
						<th>Hide Posts</th>
						<th>Hide Avatar</th>
						<th>Unignorate</th>
					</tr>
				</thead>
				<tbody>
					<IgnoratedUsers users={settings.users} onChange={onChange} />
				</tbody>
			</table>
			<form
				onSubmit={event => {
					event.preventDefault();
					const target = event.target as HTMLFormElement;
					const value = target['user-id'].value;
					if (value) {
						const input = value.toLowerCase().trim().replaceAll(/\s/g, '+');
						addUserToIgnorator(input);
						target.reset();
					}
				}}
			>
				<div className={`${pageStyles.group} ${pageStyles.small}`}>
					<label htmlFor="ignorate-user" className={pageStyles.label}>Add user to ignorator</label>
					<label htmlFor="ignorate-user" className={pageStyles.description}><u>Only</u> enter a user ID, not a display name. Find a user's ID on their profile.</label>
				</div>
				<div className={styles['add-user-form']}>
					<input
						id="ignorate-user"
						name="user-id"
						type="text"
						placeholder="User ID"
					/>
					<Button>Add User</Button>
				</div>
			</form>
		</>
	);
}