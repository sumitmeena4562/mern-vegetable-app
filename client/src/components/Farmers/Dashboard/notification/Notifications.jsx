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

  // Filters List
  const filters = [
    { id: 'all', label: 'All', icon: 'apps', color: 'bg-gradient-to-r from-slate-600 to-slate-700' },
    { id: 'unread', label: 'Unread', icon: 'mark_email_unread', color: 'bg-gradient-to-r from-green-500 to-emerald-600' },
    { id: 'order', label: 'Orders', icon: 'shopping_bag', color: 'bg-gradient-to-r from-blue-500 to-cyan-600' },
    { id: 'payment', label: 'Payments', icon: 'payments', color: 'bg-gradient-to-r from-purple-500 to-violet-600' },
    { id: 'system', label: 'System', icon: 'settings', color: 'bg-gradient-to-r from-amber-500 to-orange-600' },
  ];

  // Button Text Logic based on Type
  const getActionText = (type) => {
    switch (type) {
      case 'order': return 'View Order';
      case 'payment': return 'View Receipt';
      case 'success': return 'Go to Dashboard';
      case 'alert': return 'Check Inventory';
      default: return null;
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigation Logic
    switch (notification.type) {
      case 'order': navigate('/farmer-dashboard/orders'); break;
      case 'payment': navigate('/farmer-dashboard/payments'); break;
      case 'success': navigate('/farmer-dashboard'); break;
      default: break;
    }
  };

  // Filter & Search Logic
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeFilter === 'all' || 
                        (activeFilter === 'unread' && notification.unread) ||
                        notification.type === activeFilter;
    
    return matchesSearch && matchesType;
  });

  // Grouping
  const todayNotifications = filteredNotifications.filter(n => n.date === 'today');
  const yesterdayNotifications = filteredNotifications.filter(n => n.date === 'yesterday');
  const olderNotifications = filteredNotifications.filter(n => n.date === 'older');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Stats */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <span className="material-symbols-outlined text-white text-2xl">notifications</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                    Notifications
                  </h1>
                  <p className="text-slate-500 text-sm md:text-base">
                    Stay updated with your farm activities
                  </p>
                </div>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="group relative px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined text-[22px] transition-transform group-hover:rotate-12">done_all</span>
                Mark All as Read
                <div className="absolute -top-2 -right-2">
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-green-500 to-emerald-600 items-center justify-center text-xs font-bold">
                      {unreadCount}
                    </span>
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold text-slate-800">{notifications.length}</p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg">
                  <span className="material-symbols-outlined text-slate-600">stack</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Unread</p>
                  <p className="text-2xl font-bold text-green-600">{unreadCount}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="material-symbols-outlined text-green-600">mark_email_unread</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Orders</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {notifications.filter(n => n.type === 'order').length}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="material-symbols-outlined text-blue-600">shopping_bag</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Filtered</p>
                  <p className="text-2xl font-bold text-purple-600">{filteredNotifications.length}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="material-symbols-outlined text-purple-600">filter_list</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters Section */}
        <div className="sticky top-4 z-10 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-4 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/10 rounded-xl blur group-focus-within:blur-md transition-all duration-300"></div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined group-focus-within:text-green-600 transition-colors duration-300">
                    search
                  </span>
                  <input
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none text-slate-700 transition-all duration-300 shadow-sm"
                    placeholder="Search notifications by title or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-all duration-300 border shadow-sm ${
                      activeFilter === filter.id
                        ? `${filter.color} text-white border-transparent shadow-lg scale-[1.05]`
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:shadow-md'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {filter.icon}
                    </span>
                    {filter.label}
                    {filter.id === 'unread' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {todayNotifications.length > 0 && (
            <NotificationSection title="Today" list={todayNotifications} onAction={getActionText} onClick={handleNotificationClick} />
          )}
          
          {yesterdayNotifications.length > 0 && (
            <NotificationSection title="Yesterday" list={yesterdayNotifications} onAction={getActionText} onClick={handleNotificationClick} />
          )}
          
          {olderNotifications.length > 0 && (
            <NotificationSection title="Older" list={olderNotifications} onAction={getActionText} onClick={handleNotificationClick} />
          )}

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30"></div>
              <div className="relative flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-lg">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-5xl text-slate-400">notifications_off</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white">check</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">All caught up!</h3>
                <p className="text-slate-600 text-center max-w-md">
                  {searchQuery 
                    ? `No notifications found for "${searchQuery}"`
                    : 'You\'re all up to date. New notifications will appear here.'}
                </p>
                {(searchQuery || activeFilter !== 'all') && (
                  <button
                    onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    <span className="material-symbols-outlined align-middle mr-2">refresh</span>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// --- Helper Components ---

const NotificationSection = ({ title, list, onAction, onClick }) => (
  <div className="relative">
    <div className="sticky top-20 z-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-4 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
          {title} • {list.length}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
      </div>
    </div>
    <div className="grid gap-3">
      {list.map(notif => (
        <NotificationItem 
          key={notif.id} 
          notification={notif} 
          actionText={onAction(notif.type)} 
          onClick={onClick} 
        />
      ))}
    </div>
  </div>
);

const NotificationItem = ({ notification, actionText, onClick }) => {
  const colorConfig = {
    blue: 'from-blue-100 to-blue-50 text-blue-700 border-blue-200',
    amber: 'from-amber-100 to-amber-50 text-amber-700 border-amber-200',
    red: 'from-red-100 to-red-50 text-red-700 border-red-200',
    green: 'from-green-100 to-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'from-purple-100 to-violet-50 text-purple-700 border-purple-200',
    slate: 'from-slate-100 to-slate-50 text-slate-700 border-slate-200',
  };

  const iconConfig = {
    blue: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    amber: 'bg-gradient-to-br from-amber-500 to-orange-600',
    red: 'bg-gradient-to-br from-red-500 to-rose-600',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600',
    purple: 'bg-gradient-to-br from-purple-500 to-violet-600',
    slate: 'bg-gradient-to-br from-slate-500 to-slate-700',
  };

  const activeColor = colorConfig[notification.color] || colorConfig.slate;
  const activeIconColor = iconConfig[notification.color] || iconConfig.slate;

  return (
    <div
      onClick={() => onClick(notification)}
      className={`group relative bg-gradient-to-br ${activeColor} border rounded-2xl p-5 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 ${
        notification.unread 
          ? 'border-l-4 border-l-green-500 shadow-lg' 
          : 'shadow-md'
      }`}
    >
      <div className="flex flex-col md:flex-row gap-5">
        {/* Icon with Animation */}
        <div className="relative">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${activeIconColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <span className="material-symbols-outlined text-white text-2xl">{notification.icon}</span>
          </div>
          {notification.unread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse border-2 border-white"></span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-3">
              <h4 className={`text-lg font-bold ${notification.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                {notification.title}
              </h4>
              {notification.priority === 'high' && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-full">
                  URGENT
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-lg shadow-sm">
                {notification.time}
              </span>
              {notification.unread && (
                <span className="hidden md:inline-block px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full animate-pulse">
                  NEW
                </span>
              )}
            </div>
          </div>
          
          <p className={`text-sm leading-relaxed ${notification.unread ? 'text-slate-600' : 'text-slate-500'}`}>
            {notification.message}
          </p>
          
          {/* Tags */}
          {notification.tags && notification.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {notification.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-white/50 text-xs font-medium text-slate-600 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {actionText && (
          <div className="md:self-center shrink-0">
            <button 
              className="relative overflow-hidden px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group/btn"
              onClick={(e) => {
                e.stopPropagation();
                onClick(notification);
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {actionText}
                <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {notification.category || 'General'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {notification.unread && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // This would need to be connected to markAsRead
              }}
              className="text-xs text-slate-500 hover:text-green-600 transition-colors"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;