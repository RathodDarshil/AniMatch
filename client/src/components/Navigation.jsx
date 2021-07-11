import '../styles/Navigation.scss';
import { HouseDoorFill, Search, PersonFill } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
	return (
		<>
			<header>
				<h1 style={{ color: 'var(--accent)' }}>AniMatch</h1>
				{/* <button className="icon">
					<ThreeDotsVertical size={18} />
				</button> */}
			</header>
			<nav>
				<div id="nav-links">
					<NavLink
						to={'/'}
						exact
						activeClassName="active"
						component="a"
						className="icon"
					>
						<HouseDoorFill size={18} />
					</NavLink>
					<NavLink
						to={'/search'}
						activeClassName="active"
						component="a"
						className="icon"
					>
						<Search size={16} />
					</NavLink>
					<NavLink
						to={'/profile'}
						activeClassName="active"
						component="a"
						className="icon"
					>
						<PersonFill size={18} />
					</NavLink>
				</div>
			</nav>
		</>
	);
};

export default Navigation;
