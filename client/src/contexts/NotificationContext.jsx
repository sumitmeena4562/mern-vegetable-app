import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios.js';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  // 1. Load Initial History from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  // 2. Listen for Real-time Socket Events
  useEffect(() => {
    if (!socket) return;

    socket.on('receive-notification', (newNotification) => {
      // Sound play kar sakte hain yahan 🔔
      const audio = new Audio('/notification.mp3'); // Optional
      audio.play().catch(e => console.log("Audio permission denied"));

      // List mein top par add karein
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      socket.off('receive-notification');
    };
  }, [socket]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  // Helper to add explicitly (if needed locally)
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};