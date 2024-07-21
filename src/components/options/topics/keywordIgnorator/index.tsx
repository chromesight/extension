import Switch from '~components/ui/Switch';
import pageStyles from '../../style.module.css';
import styles from './style.module.css';
import Button from '~components/ui/Button';
import { addKeyword, removeKeyword } from '~lib/features/topicList/keywordIgnorator';

function IgnoratedKeywords({ keywords, onChange }) {
	const keys = Object.keys(keywords);
	if (keys.length) {
		const rows = keys.map(key => {
			return (
				<tr key={key}>
					<td>{key.replaceAll('+', ' ')}</td>
					<td>
						<Switch
							onChange={(checked: boolean) => {
								const newValue = {};
								newValue[key] = { ...keywords[key], hideTopics: checked };
								onChange(newValue);
							}}
							checked={keywords[key].hideTopics}
						/>
					</td>
					<td>
						<Switch
							onChange={(checked: boolean) => {
								const newValue = {};
								newValue[key] = { ...keywords[key], hideTags: checked };
								onChange(newValue);
							}}
							checked={keywords[key].hideTags}
						/>
					</td>
					<td>
						<Button
							onClick={() => {
								removeKeyword(key);
							}}
						>
							Remove Keyword
						</Button>
					</td>
				</tr>
			);
		});
		return rows;
	}
	else {
		return (<tr>
			<td colSpan={4}><p className={`${pageStyles.description} ${styles['empty-row']}`}>No keywords currently ignorated ✏️</p></td>
		</tr>);
	}
}

export default function KeywordIgnorator({ settings, onChange }) {
	return (
		<>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>Keyword</th>
						<th>Hide Topics</th>
						<th>Hide Tags</th>
						<th>Remove</th>
					</tr>
				</thead>
				<tbody>
					<IgnoratedKeywords keywords={settings.keywords} onChange={onChange} />
				</tbody>
			</table>
			<form
				onSubmit={event => {
					event.preventDefault();
					const target = event.target as HTMLFormElement;
					const value = target['keyword'].value;
					if (value) {
						const input = value.toLowerCase().trim().replaceAll(/\s/g, '+');
						addKeyword(input);
						target.reset();
					}
				}}
			>
				<div className={`${pageStyles.group} ${pageStyles.small}`}>
					<label htmlFor="ignorate-keyword" className={pageStyles.label}>Add keyword to ignorator</label>
					<label htmlFor="ignorate-keyword" className={pageStyles.description}>Enter a keyword to hide topic titles and/or tags by</label>
				</div>
				<div className={styles['add-keyword-form']}>
					<input
						id="ignorate-keyword"
						name="keyword"
						type="text"
						placeholder="Keyword"
					/>
					<Button>Add Keyword</Button>
				</div>
			</form>
		</>
	);
}