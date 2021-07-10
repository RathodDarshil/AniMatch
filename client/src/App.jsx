import './styles/App.scss';

// import { Frame, useMotionValue, useTransform, useAnimation } from 'framer';
import Navigation from './components/Navigation';
import { Switch, Route } from 'react-router-dom';
import { Home, Profile } from './pages';

function App() {
	return (
		<>
			<Navigation />
			<Switch>
				{/* <Route path="/contact">
				<Contact />
			</Route> */}
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="/profile">
					<Profile />
				</Route>
			</Switch>
		</>
	);
}

export default App;
