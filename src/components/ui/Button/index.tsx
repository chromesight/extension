import type { MouseEventHandler, ReactNode } from 'react';
import styles from './style.module.css';

type Props = {
	children: ReactNode;
	className?: string;
	onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function Button({ children, className = '', ...props }: Props) {
	return <button className={`${styles.button} ${className}`} {...props}>
		{children}
	</button>;
}