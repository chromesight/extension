import { useStorage } from '@plasmohq/storage/hook';
import Switch from '~components/ui/switch';
import type { FeatureSettings } from '~lib/features/feature';
import style from '../style.module.css';

const defaultSettings = v => v === undefined ? { enabled: false } : v;

export type EmbedTwitterSettings = {
	enabled: boolean;
	theme: string;
}

export default function PostsOptions() {
	const [postNumbers, setPostNumbers] = useStorage<FeatureSettings>('postNumbers', defaultSettings);
	const [filterMe, setFilterMe] = useStorage<FeatureSettings>('filterMe', defaultSettings);
	const [markTopicCreator, setMarkTopicCreator] = useStorage<FeatureSettings>('markTopicCreator', defaultSettings);
	const [autoScroll, setAutoScroll] = useStorage<FeatureSettings>('autoScroll', defaultSettings);
	const [autoRedirect, setAutoRedirect] = useStorage<FeatureSettings>('autoRedirect', defaultSettings);
	const [nwsTopicImages, setNwsTopicImages] = useStorage<FeatureSettings>('nwsTopicImages', defaultSettings);
	const [embedTwitter, setEmbedTwitter] = useStorage<EmbedTwitterSettings>('embedTwitter', v => v === undefined ? { enabled: false, theme: 'dark' } : v);

	return (
		<div className={style.group} id="posts">
			<h3 className={style.heading}>Posts</h3>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Display post numbers</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setPostNumbers({ ...postNumbers, enabled: checked })}
					checked={postNumbers.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Mark posts by topic creator</p>
					<p className={style.description}>Add "TC" next to topic creator's name</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setMarkTopicCreator({ ...markTopicCreator, enabled: checked })}
					checked={markTopicCreator.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Scroll new posts into view</p>
					<p className={style.description}>Only when you're at the bottom of a thread</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setAutoScroll({ ...autoScroll, enabled: checked })}
					checked={autoScroll.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Redirect to new page when created</p>
					<p className={style.description}>Only when you're at the bottom of a thread</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setAutoRedirect({ ...autoRedirect, enabled: checked })}
					checked={autoRedirect.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Add "Filter Me" link</p>
					<p className={style.description}>Adds a link to filter your own posts in a topic</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setFilterMe({ ...filterMe, enabled: checked })}
					checked={filterMe.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Replace images & videos <u>only</u> in NWS/NLS topics with text-only links</p>
					<p className={style.description}>Before using this feature, change your <a href="https://websight.blue/account/display" target="_blank">image display settings</a> to "normal" or "thumbnailed"</p>
					<p className={`${style.description} ${style.danger}`}>WARNING! While loading a thread, there may be a brief flash of images before the extension can remove them. Use this feature at your own discretion!</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setNwsTopicImages({ ...nwsTopicImages, enabled: checked })}
					checked={nwsTopicImages.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Embed Twitter links</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setEmbedTwitter({ ...embedTwitter, enabled: checked })}
					checked={embedTwitter.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset} style={{ marginLeft: 28 }}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Tweet Theme</p>
				</div>
				<select
					value={embedTwitter.theme}
					onChange={e => setEmbedTwitter({ ...embedTwitter, theme: e.target.value })}
				>
					<option value="dark">Dark</option>
					<option value="light">Light</option>
				</select>
			</fieldset>

		</div>
	);
}