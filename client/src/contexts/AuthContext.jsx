// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // 1. Initialize State from LocalStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // 2. Default Axios Header set karo (Taaki har request me token jaye)
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    // 3. App start hone par User Profile fetch karo
    useEffect(() => {
        const initAuth = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            await fetchUserProfile();
            setLoading(false);
        };

        initAuth();
    }, [token]); // Token change hone par ye chalega

    // 4. Fetch User Profile
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);

            if (response.data.success) {
                // Support both data structures
                const userData = response.data.user || response.data.data?.user || response.data.data;

                if (userData) {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log("✅ User Profile Synced:", userData);
                }
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error.message);
            if (error.response?.status === 401) {
                logout(); // Token expire ho gaya to logout karo
            }
        }
    };

    // 5. LOGIN FUNCTION (Fixed ✅)
    const login = (newToken, userData) => {
        console.log("🔐 Logging in...");

        // A. Pehle LocalStorage update karo
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // B. Context State update karo (UI immediately update hoga)
        setToken(newToken);
        setUser(userData);

        // C. Axios header set karo
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    // 6. LOGOUT FUNCTION
    const logout = () => {
        console.log("👋 Logging out...");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    // 7. Helper Functions
    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const isAuthenticated = !!token;

    const hasRole = (role) => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            logout,
            updateUser,
            isAuthenticated,
            hasRole
        }}>
            {!loading ? children : (
                <div className="flex items-center justify-center h-screen bg-[#f3fbf6]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};