import React, { useState } from 'react';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filters = [
    { id: 'all', label: 'All', icon: 'view_list' },
    { id: 'unread', label: 'Unread', icon: 'circle' },
    { id: 'orders', label: 'Orders', icon: 'shopping_cart' },
    { id: 'payments', label: 'Payments', icon: 'payments' },
    { id: 'alerts', label: 'Alerts', icon: 'warning' },
  ];

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'order') {
      navigate('/farmer-dashboard/orders');
    } else if (notification.type === 'payment') {
      navigate('/farmer-dashboard/payments');
    } else if (notification.type === 'alert') {
      navigate('/farmer-dashboard/inventory');
    }
    // Add more navigation logic as needed
  };

  // Filter logic
  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = activeFilter === 'all' || 
                       (activeFilter === 'unread' && notification.unread) ||
                       notification.type === activeFilter;
    
    return matchesSearch && matchesType;
  });

  // Group by date
  const todayNotifications = filteredNotifications.filter(n => n.date === 'today');
  const yesterdayNotifications = filteredNotifications.filter(n => n.date === 'yesterday');
  const olderNotifications = filteredNotifications.filter(n => !['today', 'yesterday'].includes(n.date));

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
            Notifications {unreadCount > 0 && <span className="text-green-600">({unreadCount})</span>}
          </h1>
          <p className="text-slate-500 text-lg font-medium mt-2">
            Stay updated on your orders, sales, and important alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-5 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-gray-500">done_all</span>
            Mark All as Read
          </button>
        )}
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined transition-colors group-focus-within:text-green-500">
            search
          </span>
          <input
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 text-base transition-all"
            placeholder="Search notifications..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Chips/Tabs */}
        <div className="flex flex-1 gap-2 overflow-x-auto pb-2 lg:pb-0">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 h-12 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                activeFilter === filter.id
                  ? 'bg-green-500 text-slate-900 shadow-lg shadow-green-500/20 font-bold'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  activeFilter === filter.id
                    ? 'text-slate-900'
                    : filter.id === 'unread'
                    ? 'text-green-500'
                    : filter.id === 'orders'
                    ? 'text-blue-500'
                    : filter.id === 'payments'
                    ? 'text-amber-500'
                    : filter.id === 'alerts'
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {filter.icon}
              </span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {/* Today Section */}
        {todayNotifications.length > 0 && (
          <>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2">
              Today
            </div>
            {todayNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </>
        )}

        {/* Yesterday Section */}
        {yesterdayNotifications.length > 0 && (
          <>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mt-6 mb-2">
              Yesterday
            </div>
            {yesterdayNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </>
        )}

        {/* Older Section */}
        {olderNotifications.length > 0 && (
          <>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mt-6 mb-2">
              Older
            </div>
            {olderNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </>
        )}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <div className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              notifications_off
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try a different search term' : 'You have no notifications at the moment'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Spacer */}
      {filteredNotifications.length > 0 && (
        <div className="h-20 flex items-center justify-center text-gray-400 text-sm font-medium mt-8">
          <span className="material-symbols-outlined mr-2 text-lg">check</span>
          You're all caught up!
        </div>
      )}
    </div>
  );
};

// Notification Item Component
const NotificationItem = ({ notification, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
  };

  const darkColorClasses = {
    blue: 'dark:bg-blue-900/30 dark:text-blue-400',
    amber: 'dark:bg-amber-900/30 dark:text-amber-400',
    red: 'dark:bg-red-900/30 dark:text-red-400',
    purple: 'dark:bg-purple-900/30 dark:text-purple-400',
    green: 'dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div
      onClick={() => onClick(notification)}
      className={`bg-white p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center group hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-all cursor-pointer relative overflow-hidden border border-slate-200 dark:border-slate-700 ${
        notification.unread
          ? 'border-l-4 border-l-green-500'
          : 'border-l-4 border-l-transparent hover:border-l-slate-300 dark:hover:border-l-slate-600'
      }`}
    >
      <div
        className={`size-12 rounded-full ${colorClasses[notification.color]} ${darkColorClasses[notification.color]} flex items-center justify-center shrink-0`}
      >
        <span className="material-symbols-outlined">{notification.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className={`font-bold text-lg truncate ${
              notification.unread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            {notification.title}
          </h3>
          {notification.unread && (
            <span className="size-2.5 rounded-full bg-green-500 animate-pulse"></span>
          )}
        </div>
        <p
          className={`text-base truncate ${
            notification.unread ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {notification.message}
        </p>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
        <span className="text-sm text-gray-400 font-medium whitespace-nowrap">
          {notification.time}
        </span>
        {notification.buttonText && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent onClick
              // Handle button click
            }}
            className={`${
              notification.unread
                ? 'bg-green-500 hover:bg-green-600 text-slate-900 shadow-sm'
                : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100'
            } px-4 py-2 rounded-lg text-sm font-bold transition-all`}
          >
            {notification.buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Notifications;