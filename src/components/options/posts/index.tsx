import { useStorage } from '@plasmohq/storage/hook';
import Switch from '~components/ui/Switch';
import type { FeatureSettings } from '~lib/features/feature';
import style from '../style.module.css';

const defaultSettings = v => v === undefined ? { enabled: false } : v;

export type EmbedTwitterSettings = {
	enabled: boolean;
	theme: string;
}

export type ResizableImagesSettings = {
	enabled: boolean;
	maxWidth: string;
	initialWidth: string;
}

export default function PostsOptions() {
	const [postNumbers, setPostNumbers] = useStorage<FeatureSettings>('postNumbers', defaultSettings);
	const [filterMe, setFilterMe] = useStorage<FeatureSettings>('filterMe', defaultSettings);
	const [markTopicCreator, setMarkTopicCreator] = useStorage<FeatureSettings>('markTopicCreator', defaultSettings);
	const [autoScroll, setAutoScroll] = useStorage<FeatureSettings>('autoScroll', defaultSettings);
	const [autoRedirect, setAutoRedirect] = useStorage<FeatureSettings>('autoRedirect', defaultSettings);
	const [nwsTopicImages, setNwsTopicImages] = useStorage<FeatureSettings>('nwsTopicImages', defaultSettings);
	const [embedTwitter, setEmbedTwitter] = useStorage<EmbedTwitterSettings>('embedTwitter', v => v === undefined ? { enabled: false, theme: 'dark' } : v);
	const [markdownButtons, setMarkdownButtons] = useStorage<FeatureSettings>('markdownButtons', defaultSettings);
	const [hideReplyArea, setHideReplyArea] = useStorage<FeatureSettings>('hideReplyArea', defaultSettings);
	const [resizableImages, setResizableImages] = useStorage<FeatureSettings>('resizableImages', defaultSettings);

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
					<p className={style.label}>Mark topic creator's posts</p>
					<p className={style.description}>Adds "TC" next to the topic creator's name</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setMarkTopicCreator({ ...markTopicCreator, enabled: checked })}
					checked={markTopicCreator.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Auto scroll</p>
					<p className={style.description}>Scroll new posts into view when you're at the bottom of a topic</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setAutoScroll({ ...autoScroll, enabled: checked })}
					checked={autoScroll.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Redirect to new page when created</p>
					<p className={style.description}>Only when you're at the bottom of a topic</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setAutoRedirect({ ...autoRedirect, enabled: checked })}
					checked={autoRedirect.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>"Filter Me" link</p>
					<p className={style.description}>Adds a link to filter your own posts in a topic</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setFilterMe({ ...filterMe, enabled: checked })}
					checked={filterMe.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Markdown buttons</p>
					<p className={style.description}>Adds markdown formatting buttons to post textareas (reply and edit)</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setMarkdownButtons({ ...markdownButtons, enabled: checked })}
					checked={markdownButtons.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Hide reply area</p>
					<p className={style.description}>Toggle visibility of reply area with backtick (`) button</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setHideReplyArea({ ...hideReplyArea, enabled: checked })}
					checked={hideReplyArea.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Drag images to resize</p>
					<p className={style.description}><span className={style.danger}>Required!</span> Change your <a href="https://websight.blue/account/display" target="_blank">image display settings</a> to "normal"</p>
				</div>
				<Switch
					onChange={(checked: boolean) => setResizableImages({ ...resizableImages, enabled: checked })}
					checked={resizableImages.enabled}
				/>
			</fieldset>

			<fieldset className={style.fieldset}>
				<div className={`${style.group} ${style.small}`}>
					<p className={style.label}>Replace images & videos <u>only</u> in NWS/NLS topics with text-only links</p>
					<p className={style.description}><span className={style.danger}>Required!</span> Change your <a href="https://websight.blue/account/display" target="_blank">image display settings</a> to "normal" or "thumbnailed"</p>
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
					<p className={style.label}>Theme</p>
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