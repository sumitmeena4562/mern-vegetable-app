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
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-white/50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Icon from Mockup */}
        <button className="xl:hidden text-slate-600 hover:text-slate-800 transition-colors" onClick={toggleSidebar}>
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {title}
            {showBack && (
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-tighter">NEW LISTING</span>
            )}
          </h2>
          {showBack ? (
            <div
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-[11px] text-slate-500 font-medium hover:text-green-600 w-fit transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Dashboard</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span className="material-symbols-outlined text-xs">location_on</span>
              <span className="truncate max-w-[180px] sm:max-w-[250px]">{subtitle || 'Detecting location...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Stitched from Mockup */}
      <div className="flex items-center gap-4">
        {/* Online Badge Toggle */}
        <button
          onClick={toggleStatus}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full transition-all hover:border-green-300 hover:shadow-sm hidden sm:flex"
        >
          <span className="relative flex h-2.5 w-2.5">
            {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></span>
          </span>
          <span className="text-xs font-semibold text-slate-600">{isOnline ? 'Online' : 'Offline'}</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => navigate('/farmer-dashboard/notifications')}
          className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-2xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          )}
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        {/* Profile Dropdown Simulation */}
        <div className="relative group">
          <button className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-[10px] border border-slate-200">
              {(user?.fullName || 'F')[0].toUpperCase()}
            </div>
            <span className="material-symbols-outlined text-slate-400 text-lg group-hover:rotate-180 transition-transform">expand_more</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;