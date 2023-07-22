import { useStorage } from '@plasmohq/storage/hook';
import Switch from '~components/ui/switch';
import style from '../style.module.css';

export default function GeneralOptions() {
	const [debugMode, setDebugMode] = useStorage<boolean>('debugMode', v => v === undefined ? false : v);

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
		</div>
	);
}