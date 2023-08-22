import * as Constants from '~constants';
import Button from '~components/ui/Button';
import mascot from 'data-base64:~assets/mario-riding-yoshi-100x100.png';
import style from './style.module.css';
import '../global.css';

function IndexPopup() {
	return (
		<div className={style.popup}>
			<h1 className={style.title}>{Constants.EXTENSION_TITLE}</h1>

			<div>
				<img
					src={mascot}
					alt="Mario riding Yoshi"
					width="100"
					height="100"
					className={style.image}
				/>
			</div>

			<a href="/options.html" target="_blank">
				<Button className={style.button}>
					Settings »
				</Button>
			</a>
		</div>
	);
}

export default IndexPopup;
