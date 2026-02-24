import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({
    isOpen,
    toggleSidebar,
    userName,
    onLogout
}) => {
    const location = useLocation();

    const mainNav = [
        { to: '/vendor-dashboard', icon: 'dashboard', label: 'Dashboard', exact: true },
        { to: '/vendor-dashboard/market', icon: 'storefront', label: 'Market' },
        { to: '/vendor-dashboard/orders', icon: 'local_shipping', label: 'Purchases' },
        { to: '/vendor-dashboard/wallet', icon: 'payments', label: 'Finance' },
    ];

    const bottomNav = [
        { to: '/vendor-dashboard/settings', icon: 'store', label: 'Shop Profile' },
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

                {/* Logo - AgriConnect Branded */}
                <Link to="/" className="flex items-center gap-3 p-4 sm:p-6 pb-2 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 transition-all">
                        <span className="material-symbols-outlined text-white text-xl sm:text-2xl">local_mall</span>
                    </div>
                    <div>
                        <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-800">
                            Agri<span className="text-indigo-600">Connect</span>
                        </h1>
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Vendor Panel</p>
                    </div>
                </Link>

                {/* Profile Card - Stitched from Mockup */}
                <div className="px-4 py-4">
                    <div className="glass-panel p-3 rounded-xl flex items-center gap-3 mb-4 bg-indigo-50/50 border-indigo-100">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-indigo-500/50 flex items-center justify-center bg-white text-indigo-700 font-black text-xs">
                            {userName ? userName[0].toUpperCase() : 'V'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-bold truncate text-slate-800">{userName || 'Vendor'}</p>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px] text-emerald-500">verified</span>
                                <p className="text-[9px] uppercase font-bold text-emerald-600 tracking-wider">Verified Buyer</p>
                            </div>
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
            {!isOpen && (
                <div className="fixed bottom-0 left-0 right-0 z-30 xl:hidden bg-white border-t border-slate-100 px-2 pb-safe shadow-lg shadow-black/5">
                    <div className="flex items-center justify-around py-1">
                        {mainNav.slice(0, 4).map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-all relative min-w-0 ${isActive(item)
                                    ? 'text-indigo-600'
                                    : 'text-slate-400'}`}
                            >
                                <span className={`material-symbols-outlined text-xl shrink-0 ${isActive(item) ? 'text-indigo-600' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-semibold truncate w-full text-center">{item.label}</span>
                                {item.badge && (
                                    <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                                        {item.badge}
                                    </span>
                                )}
                                {isActive(item) && (
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-indigo-500 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

const NavItem = ({ to, icon, label, active, badge }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${active
            ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm shadow-indigo-100/50'
            : 'hover:bg-slate-50 text-slate-500 font-medium'}`}
    >
        <span className={`material-symbols-outlined text-xl ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{icon}</span>
        <span>{label}</span>
        {badge && (
            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {badge}
            </span>
        )}
    </Link>
);

export default Sidebar;
