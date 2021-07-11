import { useContext } from 'react';
import Context from '../Context';
import { Google } from 'react-bootstrap-icons';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import GoogleLogin, { GoogleLogout } from 'react-google-login';

export const Login = () => {
	const { user, setUser } = useContext(Context);

	// const googleLogin = async () => {
	// 	Axios;
	// };
	const responseGoogle = (res) => {
		const { tokenId } = res;
		Axios.post('/user/login', { token: tokenId })
			.then((r) => {
				console.log(r.data.msg);
				localStorage.setItem('token', r.data.data.token);
				localStorage.setItem('user', JSON.stringify(r.data.data.user_info));
				setUser(r.data.data.user_info);
			})
			.catch(console.error);
	};

	const logOut = (res) => {
		localStorage.removeItem('token');
	};

	if (user !== null) {
		return <Redirect to="/" />;
	}
	return (
		<div id="login">
			{user ? (
				<GoogleLogout
					clientId="1020854869671-l7ou2icqal1f51mvmq4itdh9500c0ias.apps.googleusercontent.com"
					buttonText="Logout"
					onLogoutSuccess={logOut}
				></GoogleLogout>
			) : (
				<GoogleLogin
					clientId="1020854869671-l7ou2icqal1f51mvmq4itdh9500c0ias.apps.googleusercontent.com"
					buttonText="Continue with Google"
					onSuccess={responseGoogle}
					onFailure={responseGoogle}
					cookiePolicy={'single_host_origin'}
					// isSignedIn={true}
					render={(renderProps) => (
						<button
							className="outlined"
							onClick={renderProps.onClick}
							disabled={renderProps.disabled}
						>
							<Google /> &nbsp; Continue with Google
						</button>
					)}
				/>
			)}
		</div>
	);
};
