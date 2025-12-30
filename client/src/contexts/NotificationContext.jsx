import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New Bulk Order Received!',
      message: 'Fresh Market Co. placed an order for 500kg of Potatoes.',
      time: '10 mins ago',
      date: 'today',
      unread: true,
      icon: 'shopping_cart',
      color: 'blue',
      buttonText: 'View Order',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Processed',
      message: '$1,250.00 has been successfully deposited to your wallet.',
      time: '2 hours ago',
      date: 'today',
      unread: true,
      icon: 'payments',
      color: 'amber',
      buttonText: 'View Details',
    },
    {
      id: 3,
      type: 'alert',
      title: 'Low Inventory Alert',
      message: "Your stock for 'Organic Carrots' is below 50kg. Update now to avoid stockouts.",
      time: 'Yesterday',
      date: 'yesterday',
      unread: false,
      icon: 'warning',
      color: 'red',
      buttonText: 'Update Stock',
    },
    {
      id: 4,
      type: 'general',
      title: 'Market Prices Update',
      message: 'Check the latest regional vegetable prices for better deal positioning.',
      time: 'Yesterday',
      date: 'yesterday',
      unread: false,
      icon: 'campaign',
      color: 'purple',
      buttonText: 'Check Prices',
    },
    {
      id: 5,
      type: 'order',
      title: 'Order #9923 Delivered',
      message: 'Vendor confirmed receipt of 200kg Onions.',
      time: 'Yesterday',
      date: 'yesterday',
      unread: false,
      icon: 'check_circle',
      color: 'green',
      buttonText: null,
    },
  ]);

  // Load notifications from localStorage on initial load
  useEffect(() => {
    const savedNotifications = localStorage.getItem('farmer-notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Failed to load notifications from localStorage:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('farmer-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(), // Unique ID
      date: 'today',
      time: 'Just now',
      unread: true,
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Optional: Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/logo.png',
      });
    }
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