import  { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const url = "http://localhost:5000";
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                setAuthToken(token);
                try {
                    const response = await axios.get(`${url}/api/auth/user`);
                    setUser(response.data);
                    console.log("Fetched user:", response.data);
                    setAuthenticated(true);
                } catch (err) {
                    setError(err);
                    setAuthenticated(false);
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    setToken(null);
                    setRole(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setAuthenticated(false);
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);


    //set default auth token in axios headers
    const setAuthToken = token =>{
        if(token){
            axios.defaults.headers.common['x-auth-token'] = token;
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
        }
    }

    const login = async formData => {
        try{
            const res = await axios.post(`${url}/api/auth/login`, formData);
            console.log('Login API response:', res.data);
            setUser(res.data);
            setToken(res.data.token);
            setRole(res.data.role);
            setAuthenticated(true);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            setAuthToken(res.data.token);

            return {success: true, role: res.data.role};
        } catch(err){
            console.error('Login error:', err);
            setError(err);
            const errorMessage = err.response?.data?.message || 'Login failed';
            return {success: false, message: errorMessage};
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRole(null);
        setAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuthToken(null);
    };
    return (
        <AuthContext.Provider value={{
            user, token , role, authenticated, loading, error, login, logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}