import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios.js';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  const { user } = useAuth(); // Import useAuth

  // 1. Load Initial History from API
  useEffect(() => {
    if (!user) return; // ✅ Block fetch if not logged in

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
  }, [user]); // Re-run when user changes

  // 2. Listen for Real-time Socket Events
  useEffect(() => {
    if (!socket) return;

    socket.on('receive-notification', (newNotification) => {
      // Sound play 🔔
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log("Audio permission denied"));

      // Toast alert 🍞
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? 'animate-in slide-in-from-top-2 fade-in' : 'animate-out slide-out-to-top-2 fade-out'} max-w-sm w-full bg-white shadow-2xl rounded-2xl border border-slate-100 p-4 flex items-start gap-3 cursor-pointer`}
            onClick={() => toast.dismiss(t.id)}
          >
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
              <span className="material-symbols-outlined text-xl">
                {newNotification.type === 'order_update' ? 'shopping_cart' : 'notifications'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 tracking-tight">{newNotification.title || 'New Notification'}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2">{newNotification.message}</p>
            </div>
          </div>
        ),
        { duration: 5000, position: 'top-center' }
      );

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