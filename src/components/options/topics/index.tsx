import { useStorage } from '@plasmohq/storage/hook';
import Switch from '~components/ui/Switch';
import style from '../style.module.css';
import { useCallback } from 'react';
import KeywordIgnorator from './keywordIgnorator';

export interface IgnoratedKeyword {
	hideTopics: boolean,
	hideTags: boolean,
}

export interface IgnoratedKeywords {
	[keyword: string]: IgnoratedKeyword
}

export interface KeywordIgnoratorSettings {
	enabled: boolean,
	keywords: IgnoratedKeywords,
	badge: boolean,
}

export type DramalinksSettings = {
	enabled: boolean;
	format: string;
	align: string;
}

export default function TopicsOptions() {
	const [dramalinks, setDramalinks] = useStorage<DramalinksSettings>('dramalinks', v => v === undefined ? { enabled: false, format: 'stack', align: 'left' } : v);
	const [keywordIgnorator, setKeywordIgnorator] = useStorage<KeywordIgnoratorSettings>('keywordIgnorator', v => v === undefined ? { enabled: false, keywords: {}, badge: false } : v);

	const handleKeywordIgnoratorChange = useCallback((keywordUpdate: IgnoratedKeywords) => {
		const { keywords } = keywordIgnorator;
		setKeywordIgnorator({ ...keywordIgnorator, keywords: { ...keywords, ...keywordUpdate } });
	}, [keywordIgnorator, setKeywordIgnorator]);

	return (
		<>
			<div className={style.group} id="dramalinks">
				<h3 className={style.heading}>Dramalinks</h3>
				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>Dramalinks ticker</p>
						<p className={style.description}>Display LUE dramalinks ticker above the topic list</p>
					</div>
					<Switch
						onChange={(checked: boolean) => setDramalinks({ ...dramalinks, enabled: checked })}
						checked={dramalinks.enabled}
					/>
				</fieldset>

				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>Display format</p>
						<p className={style.description}>Select the display style of the dramalinks ticker</p>
					</div>
					<select
						value={dramalinks.format}
						onChange={e => setDramalinks({ ...dramalinks, format: e.target.value })}
					>
						<option value="stack">Stack</option>
						<option value="wrap">Wrap</option>
					</select>
				</fieldset>

				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>Text alignment</p>
						<p className={style.description}>Select the text positioning of the dramalinks ticker</p>
					</div>
					<select
						value={dramalinks.align}
						onChange={e => setDramalinks({ ...dramalinks, align: e.target.value })}
					>
						<option value="left">Left</option>
						<option value="center">Center</option>
						<option value="right">Right</option>
					</select>
				</fieldset>
			</div>

			<div className={style.group} id="keyword-ignorator">
				<h3 className={style.heading}>Keyword Ignorator</h3>
				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>Ignorated keywords</p>
						<p className={style.description}>Hide topics by title or tag using keywords</p>
					</div>
					<Switch
						onChange={(checked: boolean) => setKeywordIgnorator({ ...keywordIgnorator, enabled: checked })}
						checked={keywordIgnorator.enabled}
					/>
				</fieldset>
				<fieldset className={style.fieldset}>
					<div className={`${style.group} ${style.small}`}>
						<p className={style.label}>Display badge</p>
						<p className={style.description}>Include the number of keyword-hidden topics on the ChromeSight pinned icon</p>
					</div>
					<Switch
						onChange={(checked: boolean) => setKeywordIgnorator({ ...keywordIgnorator, badge: checked })}
						checked={keywordIgnorator.badge}
					/>
				</fieldset>

				<KeywordIgnorator settings={keywordIgnorator} onChange={handleKeywordIgnoratorChange} />
			</div>
		</>
	);
}