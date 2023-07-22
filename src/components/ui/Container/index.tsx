import type { ReactNode } from 'react';
import style from './style.module.css';

export default function Container({ children }: { children: ReactNode }) {
	return <div className={style.container}>
		{children}
	</div>;
}