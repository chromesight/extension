import '../global.css';
import style from './style.module.css';
import Container from '~components/ui/Container';
import GeneralOptions from '~components/options/general';
import PostsOptions from '~components/options/posts';
import UsersOptions from '~components/options/users';
import AboutOptions from '~components/options/about';
import TopicsOptions from '~components/options/topics';

function IndexOptions() {
	return (
		<div className={style.page}>
			<Container>
				<div className={style.row}>
					<div className={style.sidebar}>
						<h2 className={style.title}>Settings</h2>
						<ul className={style.list}>
							<li>
								<a href="#general">General</a>
							</li>
							<li>
								<a href="#topics">Topics</a>
							</li>
							<li>
								<a href="#posts">Posts</a>
							</li>
							<li>
								<a href="#ignorator">Ignorator</a>
							</li>
							<li>
								<a href="#highlighter">Highlighter</a>
							</li>
							<li>
								<hr/>
								<a href="#about">About</a>
							</li>
						</ul>
					</div>
					<div className={style.content}>
						<h2 className={style.title}>Settings</h2>
						<GeneralOptions />
						<TopicsOptions />
						<PostsOptions />
						<UsersOptions />
						<AboutOptions />
					</div>
				</div>
			</Container>
		</div>
	);
}

export default IndexOptions;
