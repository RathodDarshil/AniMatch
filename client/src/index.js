import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import { Provider } from './Context';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';

const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<Provider>
			<QueryClientProvider client={queryClient}>
				<Router>
					<App />
				</Router>
			</QueryClientProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();
