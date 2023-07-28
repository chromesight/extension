import style from '../style.module.css';

export default function AboutOptions() {
	return (
		<div className={style.group} id="about">
			<h3 className={style.heading}>About</h3>
			<p className={style.label}>ChromeSight by Joshh.</p>
			<p className={style.label}>Looking for a Firefox alternative to this extension? Consider using <a href="https://addons.mozilla.org/en-US/firefox/addon/foxyeti/" target="_blank">FoxYeti by cosban</a>.</p>
			<p className={style.description}>This extension is inspired by ChromeLL. Thanks to Pokemans, Sonicmax, Seiru, cosban, plus all other maintainers & contributers over the years. If you contributed to ChromeLL and I missed your name, please let me know.</p>
			<p className={style.description}>Thanks to LlamaGuy :) &amp; Tiko for obvious reasons.</p>
		</div>
	);
}