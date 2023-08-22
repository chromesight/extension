import { useStorage } from '@plasmohq/storage/hook';
import type { FeatureSettings } from '~lib/features/feature';
import Switch from '~components/ui/Switch';
import style from '../style.module.css';

const defaultSettings = v => v === undefined ? { enabled: false } : v;

export default function GeneralOptions() {
	const [debugMode, setDebugMode] = useStorage<boolean>('debugMode', v => v === undefined ? false : v);
	const [dramalinks, setDramalinks] = useStorage<FeatureSettings>('dramalinks', defaultSettings);

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
		</div>
	);
}