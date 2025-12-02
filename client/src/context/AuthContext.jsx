import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    // Optimistically set user
                    setUser(parsedUser);

                    // Verify with backend
                    await api.get('/auth/me');
                } catch (error) {
                    console.error("Session invalid:", error);
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const signup = async (name, email, password, phoneNumber, rollNumber, branch) => {
        const { data } = await api.post('/auth/signup', { name, email, password, phoneNumber, rollNumber, branch });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const googleLogin = async (token) => {
        localStorage.setItem('token', token);
        // Fetch user data
        const { data } = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Add token to user object for consistency
        const userData = { ...data, token };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
