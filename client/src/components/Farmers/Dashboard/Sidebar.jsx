import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({
  isOpen,
  toggleSidebar,
  userName,
  userEmail,
  userLocation,
  onAddLocation,
  onLogout
}) => {
  const location = useLocation();

  const mainNav = [
    { to: '/farmer-dashboard', icon: 'dashboard', label: 'Dashboard', exact: true },
    { to: '/farmer-dashboard/add-sabji', icon: 'add_circle', label: 'Add Product' },
    { to: '#', icon: 'inventory_2', label: 'Products' },
    { to: '#', icon: 'shopping_cart', label: 'Orders', badge: '3' },
    { to: '#', icon: 'payments', label: 'Finance' },
  ];

  const bottomNav = [
    { to: '#', icon: 'settings', label: 'Settings' },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to || location.pathname === item.to + '/';
    return location.pathname === item.to;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 xl:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed xl:static inset-y-0 left-0 w-64 h-full bg-white z-30 transition-transform duration-300 border-r border-slate-100 flex flex-col shadow-xl xl:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}`}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/50">
            <span className="material-symbols-outlined text-white text-lg">eco</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-800">AgriConnect</h1>
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest -mt-0.5">Farmer Panel</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100/50">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-200/40">
              {(userName || 'F')[0].toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-800">{userName || 'Farmer'}</p>
              <p className="text-[11px] text-slate-400 truncate">{userEmail || 'farmer@gmail.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto mt-1">
          {mainNav.map((item) => (
            <NavItem key={item.label} {...item} active={isActive(item)} />
          ))}

          <div className="mt-auto pt-3 border-t border-slate-100">
            {bottomNav.map((item) => (
              <NavItem key={item.label} {...item} active={isActive(item)} />
            ))}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                <span>Logout</span>
              </button>
            )}
          </div>
        </nav>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 xl:hidden bg-white border-t border-slate-100 px-2 pb-safe shadow-lg shadow-black/5">
        <div className="flex items-center justify-around py-1">
          {mainNav.slice(0, 5).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all relative ${isActive(item)
                ? 'text-green-600'
                : 'text-slate-400'}`}
            >
              <span className={`material-symbols-outlined text-xl ${isActive(item) ? 'text-green-600' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold">{item.label.split(' ')[0]}</span>
              {item.badge && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {isActive(item) && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-green-500 rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

const NavItem = ({ to, icon, label, active, badge }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${active
      ? 'bg-green-50 text-green-700 font-bold shadow-sm shadow-green-100/50'
      : 'hover:bg-slate-50 text-slate-500 font-medium'}`}
  >
    <span className={`material-symbols-outlined text-xl ${active ? 'text-green-600' : 'text-slate-400'}`}>{icon}</span>
    <span>{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
        {badge}
      </span>
    )}
  </Link>
);

export default Sidebar;