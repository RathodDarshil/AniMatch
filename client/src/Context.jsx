import Axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// Context
const Context = createContext({});
export default Context;

// Provider
export const Provider = ({ children }) => {
	const [user, setUser] = useState(null);

	return (
		<Context.Provider
			value={{
				user,
			}}
		>
			{children}
		</Context.Provider>
	);
};
