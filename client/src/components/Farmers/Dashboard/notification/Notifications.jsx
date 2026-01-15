import React, { useState } from 'react';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Package,
  CreditCard,
  Settings,
  Search,
  Check,
  Clock,
  ArrowRight,
  Inbox,
  AlertCircle,
  X
} from 'lucide-react';

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

  // --- Configuration ---
  const filters = [
    { id: 'all', label: 'All', icon: Inbox },
    { id: 'unread', label: 'Unread', icon: Bell },
    { id: 'order', label: 'Orders', icon: Package },
    { id: 'payment', label: 'Payments', icon: CreditCard },
    { id: 'system', label: 'System', icon: Settings },
  ];

  const getActionText = (type) => {
    switch (type) {
      case 'order': return 'View Order';
      case 'payment': return 'View Receipt';
      case 'success': return 'Dashboard';
      case 'alert': return 'Action Required';
      default: return null;
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    switch (notification.type) {
      case 'order': navigate('/farmer-dashboard/orders'); break;
      case 'payment': navigate('/farmer-dashboard/payments'); break;
      case 'success': navigate('/farmer-dashboard'); break;
      default: break;
    }
  };

  // --- Logic ---
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = activeFilter === 'all' ||
      (activeFilter === 'unread' && notification.unread) ||
      notification.type === activeFilter;

    return matchesSearch && matchesType;
  });

  const getDateCategory = (dateString) => {
    if (!dateString) return 'Older';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return 'Older';
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const processedNotifications = filteredNotifications.map(n => ({
    ...n,
    time: formatTime(n.createdAt || n.date),
    category: getDateCategory(n.createdAt || n.date)
  }));

  const groupedNotifications = {
    Today: processedNotifications.filter(n => n.category === 'Today'),
    Yesterday: processedNotifications.filter(n => n.category === 'Yesterday'),
    Older: processedNotifications.filter(n => n.category === 'Older'),
  };

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* 1. Header Section */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20 backdrop-blur-xl bg-white/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2.5 rounded-xl">
                <Bell className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
                <p className="text-sm text-slate-500 font-medium">
                  You have <span className="text-green-600">{unreadCount} unread</span> updates
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all active:scale-95 shadow-sm hover:shadow-md"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* Mobile Search & Filter (Scrollable) */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border-none rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {filters.map(filter => {
                const isActive = activeFilter === filter.id;
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-green-400' : 'text-slate-400'}`} />
                    {filter.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Notification List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">

        {['Today', 'Yesterday', 'Older'].map((category, catIndex) => {
          const items = groupedNotifications[category];
          if (items.length === 0) return null;

          return (
            <div key={category} className={`space-y-4 animate-fade-in`} style={{ animationDelay: `${catIndex * 150}ms`, animationFillMode: 'both' }}>
              <div className="flex items-center gap-3 pl-2">
                <span className="w-2 h-2 rounded-full bg-slate-300 ring-4 ring-slate-100"></span>
                <h3 className="text-xs font-extra-bold text-slate-400 uppercase tracking-widest">{category}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
              </div>

              <div className="grid gap-3">
                {items.map((notif, index) => (
                  <NotificationCard
                    key={notif._id}
                    data={notif}
                    actionLabel={getActionText(notif.type)}
                    onClick={() => handleNotificationClick(notif)}
                    // Staggered Animation Delay
                    style={{ animationDelay: `${(catIndex * 100) + (index * 50)}ms` }}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">No notifications found</h3>
            <p className="text-slate-500 text-sm mt-1">We'll notify you when something important happens.</p>
            {(searchQuery || activeFilter !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                className="mt-6 text-green-600 font-semibold text-sm hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// --- Sub-components ---

const NotificationCard = ({ data, actionLabel, onClick, style }) => {
  const isUnread = data.unread;

  // Dynamic Icons
  const getIcon = (type) => {
    switch (type) {
      case 'order': return <Package className="w-5 h-5 text-blue-600" />;
      case 'payment': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'success': return <Check className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  // Dynamic Styles for Hover
  const getHoverStyles = (type) => {
    switch (type) {
      case 'order': return 'group-hover:bg-blue-100 group-hover:text-blue-700';
      case 'payment': return 'group-hover:bg-purple-100 group-hover:text-purple-700';
      case 'alert': return 'group-hover:bg-red-100 group-hover:text-red-700';
      case 'success': return 'group-hover:bg-green-100 group-hover:text-green-700';
      default: return 'group-hover:bg-slate-200 group-hover:text-slate-700';
    }
  };

  // Base Icon Styles
  const getIconStyles = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-50 text-blue-600';
      case 'payment': return 'bg-purple-50 text-purple-600';
      case 'alert': return 'bg-red-50 text-red-600';
      case 'success': return 'bg-green-50 text-green-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  return (
    <div
      onClick={onClick}
      style={{ ...style, animationFillMode: 'both' }}
      className={`group relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer animate-fade-in ${isUnread
          ? 'bg-white border-green-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-green-500/20'
          : 'bg-white/80 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:-translate-y-1'
        }`}
    >
      {/* Unread Indicator Dot */}
      {isUnread && (
        <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
      )}

      {/* Icon Box */}
      <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${getIconStyles(data.type)} ${getHoverStyles(data.type)}`}>
        {getIcon(data.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h4 className={`text-base font-semibold truncate pr-4 ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
            {data.title}
          </h4>
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {data.time}
          </span>
        </div>

        <p className={`text-sm leading-relaxed line-clamp-2 ${isUnread ? 'text-slate-800' : 'text-slate-500'}`}>
          {data.message}
        </p>

        {/* Action Area */}
        {actionLabel && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 flex items-center gap-1 shadow-sm">
              {actionLabel}
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications;