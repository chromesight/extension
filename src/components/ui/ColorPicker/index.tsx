import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import styles from './style.module.css';

type Props = {
	initialColor?: string,
	handleColorChange?: (color: { hex: string }) => void,
	id?: string
};

export default function ColorPicker({ initialColor = '#000000', handleColorChange, ...props }: Props) {
	const [displayColorPicker, setDisplayColorPicker] = useState(false);
	const [color, setColor] = useState(initialColor);

	useEffect(() => {
		setColor(initialColor);
	}, [initialColor, setColor]);

	const handleClick = () => {
		setDisplayColorPicker(!displayColorPicker);
	};

	const handleClose = () => {
		setDisplayColorPicker(false);
	};

	return (
		<div>
			<div className={styles.swatch} onClick={handleClick}>
				<div id={typeof props.id !== undefined ? props.id : ''} className={styles.color} style={{ background: color }} />
			</div>
			{displayColorPicker ? <div className={styles.popover}>
				<div className={styles.cover} onClick={handleClose} />
				<SketchPicker color={color} onChange={newColor => setColor(newColor.hex)} onChangeComplete={handleColorChange} />
			</div> : null}

		</div>
	);
}