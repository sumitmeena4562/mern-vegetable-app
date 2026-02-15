import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../../contexts/SocketContext';
import { useAuth } from '../../../contexts/AuthContext';

const Header = ({
  toggleSidebar,
  title,
  showBack,
  subtitle,
  Verified,
  locationData,
  onAddLocation
}) => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (socket) {
      socket.on('user-status-change', ({ userId, isOnline: status }) => {
        if (userId === user?.id) setIsOnline(status);
      });
    }
  }, [socket, user]);

  const toggleStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    if (socket && user) {
      socket.emit('set-status', {
        userId: user.id || user._id,
        status: newStatus ? 'online' : 'offline'
      });
    }
  };

  const isVerified = Verified === true || Verified === "true";
  const unreadCount = 3;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-2.5 md:px-6 md:py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Menu */}
        <button
          className="xl:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors -ml-1"
          onClick={toggleSidebar}
        >
          <span className="material-symbols-outlined text-slate-600 text-xl">menu</span>
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-bold text-slate-800">{title}</h2>
            {/* Verification Badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wide border uppercase ${isVerified
              ? 'bg-blue-50 text-blue-600 border-blue-200'
              : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
              <span className="material-symbols-outlined text-xs">{isVerified ? 'verified' : 'new_releases'}</span>
              <span className="hidden sm:inline">{isVerified ? 'Verified' : 'New'}</span>
            </span>
          </div>

          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-[11px] text-slate-400 font-medium hover:text-green-600 w-fit transition-colors"
            >
              <span className="material-symbols-outlined text-xs">arrow_back</span>
              <span>Back to Dashboard</span>
            </button>
          ) : subtitle ? (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <span className="material-symbols-outlined text-xs">location_on</span>
              <span className="truncate max-w-[180px] sm:max-w-[250px]">{subtitle}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Online Toggle */}
        <button
          onClick={toggleStatus}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isOnline
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-slate-100 border-slate-200 text-slate-500'}`}
        >
          <span className="relative flex h-2 w-2">
            {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
          </span>
          {isOnline ? 'Online' : 'Offline'}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/farmer-dashboard/notifications')}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-500 text-xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-200/40">
          {(user?.fullName || 'F')[0].toUpperCase()}
        </button>
      </div>
    </header>
  );
};

export default Header;