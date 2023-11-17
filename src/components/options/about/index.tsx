import style from '../style.module.css';

export default function AboutOptions() {
	return (
		<div className={style.group} id="about">
			<h3 className={style.heading}>About</h3>
			<p className={style.label}>ChromeSight by Joshh.</p>
			<p className={style.label}>Looking for a Firefox alternative to this extension? Consider using <a href="https://addons.mozilla.org/en-US/firefox/addon/foxyeti/" target="_blank">foxyeti by cosban</a>.</p>
			<p className={style.description}>This extension is inspired by ChromeLL. Thanks to Pokemans, Sonicmax, Seiru, cosban, plus all other contributors.</p>
			<p className={style.description}>Thanks to LlamaGuy &amp; Tiko.</p>
		</div>
	);
}