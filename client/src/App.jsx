import './styles/App.scss';
import Axios from 'axios';

// import { Frame, useMotionValue, useTransform, useAnimation } from 'framer';
import Navigation from './components/Navigation';
import { Switch, Route } from 'react-router-dom';
import { Home, Search, Profile } from './pages';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

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
			<QueryClientProvider client={queryClient}>
				<Navigation />
				<Switch>
					{/* <Route path="/contact">
				<Contact />
			</Route> */}
					<Route path="/" exact>
						<Home />
					</Route>
					<Route path="/search">
						<Search />
					</Route>
					<Route path="/profile">
						<Profile />
					</Route>
				</Switch>
			</QueryClientProvider>
		</>
	);
}

export default App;
