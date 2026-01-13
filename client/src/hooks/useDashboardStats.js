import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const useDashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No auth token found');

                // Adjust base URL since VITE_API_URL includes /auth
                const baseUrl = import.meta.env.VITE_API_URL.replace('/auth', '');
                const response = await axios.get(`${baseUrl}/farmers/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setStats(response.data.data);
                    setError(null);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
                setError(err.message || 'Failed to load stats');
                // Use fallback data for now if API fails (good for dev/demo)
                setStats({
                    earnings: 0,
                    activeProducts: 0,
                    pendingOrders: 0,
                    rating: 0
                });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    return { stats, loading, error };
};

export default useDashboardStats;
