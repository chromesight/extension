import { useStorage } from '@plasmohq/storage/hook';
import Switch from '~components/ui/Switch';
import style from '../style.module.css';

export type DramalinksSettings = {
	enabled: boolean;
	format: string;
	align: string;
}

export default function GeneralOptions() {
	const [debugMode, setDebugMode] = useStorage<boolean>('debugMode', v => v === undefined ? false : v);
	const [dramalinks, setDramalinks] = useStorage<DramalinksSettings>('dramalinks', v => v === undefined ? { enabled: false, format: 'stack', align: 'left' } : v);

	return (
		<div className={style.group} id="general">
			<h3 className={style.heading}>General</h3>
			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Log debug messages</p>
					<p className={style.description}>Sent to the browser console</p>
				</div>
				<Switch
					onChange={setDebugMode}
					checked={debugMode}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Dramalinks ticker</p>
					<p className={style.description}>Display dramalinks ticker in the topic list</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setDramalinks({ ...dramalinks, enabled: checked })}
					checked={dramalinks.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset} style={{ marginLeft: 28 }}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Display format</p>
				</div>
				<select
					value={dramalinks.format}
					onChange={e => setDramalinks({ ...dramalinks, format: e.target.value })}
				>
					<option value="stack">Stack</option>
					<option value="wrap">Wrap</option>
				</select>
			</fieldset>

			<fieldset className={style.fieldset} style={{ marginLeft: 28 }}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Alignment</p>
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
	);
}