import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Initialize Socket
            // VITE_API_URL is /api on mobile/ngrok setup. We need the base domain for socket.
            // If it's relative (/api), socket.io usually handles root automatically if path is specified.
            // But explicit is better.

            const socketUrl = import.meta.env.VITE_API_URL.startsWith('http')
                ? import.meta.env.VITE_API_URL.replace('/api', '') // Remove /api suffix if absolute
                : undefined; // Let it auto-detect host for relative paths

            const newSocket = io(socketUrl, {
                path: '/socket.io',
                transports: ['polling', 'websocket'], // Allow polling for better compatibility
                reconnectionAttempts: 5,
            });

            console.log("🔌 Connecting Socket...");

            newSocket.on('connect', () => {
                console.log("✅ Socket Connected:", newSocket.id);
                newSocket.emit('join-user', user._id || user.id);
            });

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSocket(newSocket);

            return () => {
                console.log("🔌 Disconnecting Socket...");
                newSocket.close();
            };
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
