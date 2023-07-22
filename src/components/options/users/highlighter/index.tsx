import ColorPicker from '~components/ui/colorPicker';
import Button from '~components/ui/button';
import { addUserToHighlighter, removeUserFromHighlighter } from '~lib/features/users/highlighter';
import pageStyles from '../../style.module.css';
import styles from './style.module.css';

function HighlightedUsers({ users, handleUserState }) {
	const userIds = Object.keys(users);
	if (userIds.length) {
		const rows = userIds.map(key => {
			return (
				<tr key={key}>
					<td>{key.replaceAll('+', ' ')}</td>
					<td>
						<ColorPicker
							initialColor={users[key].backgroundColor}
							handleColorChange={color => {
								const newValue = {};
								newValue[key] = { ...users[key], backgroundColor: color.hex };
								handleUserState(newValue);
							}}
						/>
					</td>
					<td>
						<ColorPicker
							initialColor={users[key].textColor}
							handleColorChange={color => {
								const newValue = {};
								newValue[key] = { ...users[key], textColor: color.hex };
								handleUserState(newValue);
							}}
						/>
					</td>
					<td>
						<Button
							onClick={() => {
								removeUserFromHighlighter(key);
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
			<td colSpan={4}><p className={`${pageStyles.description} ${styles['empty-row']}`}>No users currently highlighted 🎨</p></td>
		</tr>);
	}
}

export default function Highlighter({ settings, handleUserState }) {
	return (
		<>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>User ID</th>
						<th>Background Color</th>
						<th>Text Color</th>
						<th>Unhighlight</th>
					</tr>
				</thead>
				<tbody>
					<HighlightedUsers users={settings.users} handleUserState={handleUserState} />
				</tbody>
			</table>
			<form
				onSubmit={event => {
					event.preventDefault();
					const target = event.target as HTMLFormElement;

					const userId = target['user-id'].value;
					if (userId) {
						const id = userId.toLowerCase().trim().replaceAll(/\s/g, '+');
						const backgroundColor = (target.querySelector('#background-color') as HTMLElement).style.backgroundColor;
						const textColor = (target.querySelector('#text-color') as HTMLElement).style.backgroundColor;
						addUserToHighlighter(id, backgroundColor, textColor);

						target.reset();
					}
				}}
			>
				<div className={`${pageStyles.group} ${pageStyles.small}`}>
					<label htmlFor="highlight-user" className={pageStyles.label}>Add user to highlighter</label>
					<label htmlFor="highlight-user" className={pageStyles.description}><u>Only</u> enter a user ID, not a display name. Find a user's ID on their profile.</label>
				</div>
				<div className={styles['add-user-form']}>
					<input
						id="highlight-user"
						name="user-id"
						type="text"
						placeholder="User ID"
					/>
					<ColorPicker
						initialColor='#000000'
						id='background-color'
					/>
					<ColorPicker
						initialColor='#ffffff'
						id='text-color'
					/>
					<Button>Add User</Button>
				</div>
			</form>
		</>
	);
}