import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const getUser = () => {
        return user 
    };

    const userLogin = (newUser) => {
        setUser(newUser);
    };

    const userLogout = () => {
        setUser(null);
    };

    const getToken = () => {
        return user ? user.token : null;
    };

    const contextValue = {
        user,
        getUser,
        getToken,
        userLogin,
        userLogout,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export default AuthContext;

export function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider };