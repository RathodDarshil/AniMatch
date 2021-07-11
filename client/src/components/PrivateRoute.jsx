import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Context from '../Context';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { user } = useContext(Context);
	return (
		<Route
			{...rest}
			render={(props) =>
				user !== null ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{ pathname: '/login', state: { from: props.location } }}
					/>
				)
			}
		/>
	);
};

export default PrivateRoute;
