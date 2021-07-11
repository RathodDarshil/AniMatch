import Axios from 'axios';
// import { Frame, useMotionValue, useTransform, useAnimation } from 'framer';
import { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import { Home, Login, Profile, Search } from './pages';
import './styles/App.scss';

Axios.interceptors.request.use(
	function (request) {
		const bearerToken = localStorage.getItem('token');
		if (bearerToken) {
			request.headers.Authorization = `bearer ${bearerToken}`;
		}
		request.headers['Content-Type'] = 'application/json';
		return request;
	},
	function (error) {
		return Promise.reject(error);
	}
);

Axios.defaults.baseURL =
	process.env.NODE_ENV === 'development'
		? 'https://hacktoon-backend-qguqqofcsa-el.a.run.app'
		: 'https://hacktoon-backend-qguqqofcsa-el.a.run.app';

function App() {
	return (
		<>
			<Navigation />
			<Switch>
				<Route path="/login" component={Login} />
				<PrivateRoute path="/" location="/" exact component={Home} />
				<PrivateRoute path="/search" location="/search" component={Search} />
				<PrivateRoute path="/profile" component={Profile} />
			</Switch>
		</>
	);
}

export default App;
