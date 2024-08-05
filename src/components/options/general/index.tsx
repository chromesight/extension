import { useStorage } from '@plasmohq/storage/hook';
import Switch from '~components/ui/Switch';
import style from '../style.module.css';
import type { FeatureSettings } from '~lib/features/feature';

const defaultSettings = v => v === undefined ? { enabled: false } : v;

export type DramalinksSettings = {
	enabled: boolean;
	format: string;
	align: string;
}

export default function GeneralOptions() {
	const [debugMode, setDebugMode] = useStorage<boolean>('debugMode', v => v === undefined ? false : v);
	const [redDot, setRedDot] = useStorage<FeatureSettings>('redDot', defaultSettings);

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
					<p className={style.label}>Red dot</p>
					<p className={style.description}>A reminder, for all that we fought against</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setRedDot({ ...redDot, enabled: checked })}
					checked={redDot.enabled}
				/>
			</fieldset>
		</div>
	);
}