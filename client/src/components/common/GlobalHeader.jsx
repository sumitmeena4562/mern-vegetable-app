import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

const GlobalHeader = ({
    toggleSidebar,
    title,
    subtitle,
    showBack,
    themeColor,
    roleIcon,
    navLinks,
    unreadCount = 0,
    cartItemCount = 0,
    showCart = false,
    onLogout
}) => {
    const navigate = useNavigate();
    const socket = useSocket();
    const { user } = useAuth();

    const [isOnline, setIsOnline] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Theme dictionaries
    const themes = {
        green: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            border: 'border-green-200',
            hoverText: 'hover:text-green-600',
            onlineRing: 'bg-green-400',
            onlineDot: 'bg-green-500',
            offlineDot: 'bg-slate-300',
            cartBadgeBg: 'bg-green-600',
            avatarGrad: 'from-green-500 to-emerald-600'
        },
        indigo: {
            bg: 'bg-indigo-100',
            text: 'text-indigo-700',
            border: 'border-indigo-200',
            hoverText: 'hover:text-indigo-600',
            onlineRing: 'bg-emerald-400',
            onlineDot: 'bg-emerald-500',
            offlineDot: 'bg-slate-300',
            cartBadgeBg: 'bg-indigo-600',
            avatarGrad: 'from-indigo-500 to-blue-600'
        }
    };

    const theme = themes[themeColor] || themes.green;

    useEffect(() => {
        if (socket) {
            socket.on('user-status-change', ({ userId, isOnline: status }) => {
                if (userId === user?.id) setIsOnline(status);
            });
        }
    }, [socket, user]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleStatus = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        if (socket && user) {
            socket.emit('set-status', {
                userId: user.id || user._id,
                status: newStatus ? 'online' : 'offline'
            });
        }
    };

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-white/50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
                {/* Mobile Menu Icon */}
                <button className="xl:hidden text-slate-600 hover:text-slate-800 transition-colors shrink-0" onClick={toggleSidebar}>
                    <span className="material-symbols-outlined text-2xl">menu</span>
                </button>

                <div className="flex flex-col min-w-0">
                    <h2 className="text-sm sm:text-lg font-bold text-slate-800 flex items-center gap-2 truncate">
                        <span className="truncate">{title}</span>
                        {showBack && (
                            <span className={`${theme.bg} ${theme.text} text-[10px] px-2 py-0.5 rounded-full border ${theme.border} uppercase tracking-tighter shrink-0 hidden md:inline-block`}>NEW</span>
                        )}
                    </h2>
                    {showBack ? (
                        <div
                            onClick={() => navigate(-1)}
                            className={`flex items-center gap-1 text-[11px] text-slate-500 font-medium ${theme.hoverText} w-fit transition-colors cursor-pointer`}
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            <span className="truncate">Back</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                            <span className="material-symbols-outlined text-xs shrink-0">{roleIcon === 'eco' ? 'location_on' : 'storefront'}</span>
                            <span className="truncate">{subtitle || (roleIcon === 'eco' ? 'Detecting location...' : 'Welcome to your business hub')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 px-1">
                {/* Online Badge Toggle — visible on desktop */}
                <button
                    onClick={toggleStatus}
                    className="items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 rounded-full transition-all hover:border-slate-300 hover:shadow-sm hidden md:flex"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        {isOnline && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.onlineRing} opacity-75`}></span>}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? theme.onlineDot : theme.offlineDot}`}></span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">{isOnline ? 'Online' : 'Offline'}</span>
                </button>

                {/* Cart Icon */}
                {showCart && (
                    <button
                        onClick={() => navigate('/vendor-dashboard/cart')}
                        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center shrink-0"
                    >
                        <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                        {cartItemCount > 0 && (
                            <span className={`absolute top-1 right-1 min-w-[18px] h-[18px] ${theme.cartBadgeBg} text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-1 shadow-sm`}>
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </button>
                )}

                {/* Notifications Icon */}
                <button
                    onClick={() => navigate(navLinks.find(l => l.label === 'Notifications')?.to || '#')}
                    className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center shrink-0"
                >
                    <span className="material-symbols-outlined text-2xl">notifications</span>
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-1">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                <div className="h-6 w-px bg-slate-200 hidden xs:block"></div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-1.5 hover:bg-slate-50 p-1 rounded-full transition-colors"
                    >
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.avatarGrad} flex items-center justify-center text-white font-black text-[10px] border border-slate-200 shrink-0 shadow-sm`}>
                            {(user?.fullName || roleIcon.toUpperCase())[0].toUpperCase()}
                        </div>
                        <span className={`material-symbols-outlined text-slate-400 text-lg transition-transform hidden sm:block ${showDropdown ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-sm font-black text-slate-900 truncate">{user?.fullName || 'User'}</p>
                                <p className="text-[11px] text-slate-400 font-medium truncate">{user?.email || user?.mobile}</p>
                            </div>

                            {/* Online Status Toggle — also visible on mobile via dropdown */}
                            <button
                                onClick={toggleStatus}
                                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg text-slate-400">wifi</span>
                                    <span className="text-sm font-bold text-slate-700">Status</span>
                                </div>
                                <div className={`w-9 h-5 rounded-full transition-all relative ${isOnline ? theme.onlineDot : 'bg-slate-200'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isOnline ? 'left-4' : 'left-0.5'}`}></div>
                                </div>
                            </button>

                            {/* Menu Items */}
                            {navLinks.filter(l => l.dropdown).map(item => (
                                <button
                                    key={item.label}
                                    onClick={() => { setShowDropdown(false); navigate(item.to); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg text-slate-400">{item.icon}</span>
                                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                    {item.label === 'Notifications' && unreadCount > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                                    )}
                                </button>

                            ))}

                            <div className="border-t border-slate-100 mt-1 pt-1">
                                <button
                                    onClick={() => { setShowDropdown(false); if (onLogout) onLogout(); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg text-red-500">logout</span>
                                    <span className="text-sm font-bold text-red-600">Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default GlobalHeader;
