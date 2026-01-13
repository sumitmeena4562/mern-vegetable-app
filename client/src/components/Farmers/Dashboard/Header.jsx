import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  // ✅ Step 1: Logic safe karein (String "true" ya Boolean true dono chalega)
  const isVerified = Verified === true || Verified === "true";

  // Hardcoded unread count for now
  const unreadCount = 3;

  const handleNotificationClick = () => {
    navigate('/farmer-dashboard/notifications');
  };

  const handleBackClick = () => {
    navigate(-1); // Ya specific route pe jaane ke liye
  };

  return (
    <header className="sticky top-0 z-20 glass-panel border-b border-white/50 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Menu Button */}
        <button className="xl:hidden text-slate-600 p-1 -ml-1" onClick={toggleSidebar}>
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="flex flex-col">
          <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2 flex-wrap">
            {title}

            {/* ✅ Step 2: Best Badge Design Implementation */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border uppercase select-none ${isVerified
                  ? "bg-blue-50 text-blue-600 border-blue-200"    // 🔵 Verified Style
                  : "bg-orange-50 text-orange-600 border-orange-200" // 🟠 New Listing Style
                }`}
            >
              {/* Icon Section */}
              <span className="material-symbols-outlined text-[14px] leading-none">
                {isVerified ? "verified" : "new_releases"}
              </span>

              {/* Text Section */}
              <span className="leading-none pt-[1px] hidden xs:block">
                {isVerified ? "VERIFIED" : "NEW LISTING"}
              </span>
            </span>

          </h2>

          {/* Subtitle / Back Button Logic */}
          {showBack ? (
            <button
              onClick={handleBackClick}
              className="flex items-center gap-1 text-xs text-slate-500 font-medium cursor-pointer hover:text-green-600 w-fit"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="hidden xs:inline">Back to Dashboard</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="truncate max-w-[150px] md:max-w-none">{subtitle}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Online Status & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-full border border-slate-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-600">Online</span>
        </div>

        {/* Notification Button with Badge */}
        <button
          onClick={handleNotificationClick}
          className="relative p-2 text-slate-600 hover:bg-white/80 rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined">notifications</span>

          {/* Dynamic Unread Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-red-500 text-[10px] md:text-xs font-bold text-white animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="h-6 md:h-8 w-px bg-slate-200"></div>

        <div className="relative group">
          <button className="flex items-center gap-2 hover:bg-white/50 p-1 pr-2 md:pr-3 rounded-full transition-colors">
            <img
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCReN-EUdufnC1lTci9Rh_GeoQRo_IikYg1pPoOx4PvlQNgFW57fm8bUTCQmHsrBGegsp23zYM6WR6mj4Gyu0VPJ2R1l3P_u1AEN8Dwzz2Txfk08XRPm21uRZUwEQpl9Bsar3hKojLwDVVNNrc3luc8b3JNSRObpUN4GChDj-s8_Rz394uN4oRk2Bm1eJfDO9VwWUCQR4ldAaQEN8pNwuAYYj16-C59t3aDSuAjSSvHXkl0gfJLlwamZOASMEQkzFI22fy12_2e3NM"
              alt="profile"
            />
            <span className="material-symbols-outlined text-slate-400 hidden md:block">expand_more</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;