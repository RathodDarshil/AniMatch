import Axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Context
const Context = createContext({});
export default Context;

// Provider
export const Provider = ({ children }) => {
	const localUser = localStorage.getItem('user');
	const [user, setUser] = useState(JSON.parse(localUser));

	return (
		<Context.Provider
			value={{
				user,
				setUser,
			}}
		>
			{children}
		</Context.Provider>
	);
};
