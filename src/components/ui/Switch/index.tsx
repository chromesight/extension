import ReactSwitch from 'react-switch';

export default function Switch({ onChange, checked, disabled = false }) {
	return (
		<ReactSwitch
			uncheckedIcon={false}
			checkedIcon={false}
			onColor="#1f8bf0"
			height={20}
			width={40}
			handleDiameter={14}
			onChange={onChange}
			checked={checked}
			disabled={disabled}
		/>
	);
}