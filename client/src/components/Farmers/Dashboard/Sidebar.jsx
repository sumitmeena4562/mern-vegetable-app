import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({  
  isOpen, 
  toggleSidebar, 
  userName,
  userEmail,
  userLocation,
  onAddLocation,
  onLogout  }) => {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 xl:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      <aside className={`fixed xl:static inset-y-0 left-0 w-64 h-full glass-panel z-30 transition-transform duration-300 border-r border-white/60 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}`}>
        <div className="flex items-center gap-3 p-6 pb-2">
          {/* Logo Section */}
          <div className="bg-primary/20 px-1 rounded-xl">
                        <span className="material-symbols-outlined text-primary text-4xl">eco</span>

          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">AgriConnect</h1>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Farmer Panel</p>
          </div>
        </div>
        
        {/* Profile Section */}
        <div className="px-4 py-4">
          <div className="glass-panel p-3 rounded-xl flex items-center gap-3 mb-4 bg-green-50/50 border-green-100">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCReN-EUdufnC1lTci9Rh_GeoQRo_IikYg1pPoOx4PvlQNgFW57fm8bUTCQmHsrBGegsp23zYM6WR6mj4Gyu0VPJ2R1l3P_u1AEN8Dwzz2Txfk08XRPm21uRZUwEQpl9Bsar3hKojLwDVVNNrc3luc8b3JNSRObpUN4GChDj-s8_Rz394uN4oRk2Bm1eJfDO9VwWUCQR4ldAaQEN8pNwuAYYj16-C59t3aDSuAjSSvHXkl0gfJLlwamZOASMEQkzFI22fy12_2e3NM" className="rounded-full size-10 ring-2 ring-primary/50" alt="profile" />
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-800">{userName || 'Farmer'}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail || 'farmer@gmail.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links - Updated Paths Here */}
        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          
          {/* Dashboard Link - Updated to point to /farmer-dashboard */}
          <NavItem 
            to="/farmer-dashboard" 
            icon="dashboard" 
            label="Dashboard" 
            // Checks if path is exactly dashboard or with a trailing slash
            active={location.pathname === '/farmer-dashboard' || location.pathname === '/farmer-dashboard/'} 
          />
          
          {/* Add Sabji Link - Updated to point to /farmer-dashboard/add-sabji */}
          <NavItem 
            to="/farmer-dashboard/add-sabji" 
            icon="add_circle" 
            label="Add New Sabji" 
            active={location.pathname === '/farmer-dashboard/add-sabji'} 
          />

          <NavItem to="#" icon="inventory_2" label="Products" />
          <NavItem to="#" icon="shopping_cart" label="Orders" badge="3" />
          <NavItem to="#" icon="payments" label="Finance" />
          
          <div className="mt-auto pt-4 border-t border-slate-200/50">
            <NavItem to="#" icon="settings" label="Settings" />
          </div>
        </nav>
      </aside>
    </>
  );
};

const NavItem = ({ to, icon, label, active, badge }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-primary text-[#0d1b12] font-semibold shadow-sm' : 'hover:bg-white/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-medium'}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span>{label}</span>
    {badge && <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>}
  </Link>
);

export default Sidebar;