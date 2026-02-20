import React from 'react';

const Header = ({
    toggleSidebar,
    title = "Dashboard",
    subtitle = "Welcome to your business hub",
    userName,
}) => {
    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 xl:px-8 py-3 sm:py-4 transition-all pr-4 sm:pr-8">
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">

                {/* Left Side: Mobile Menu & Breadcrumbs */}
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <button
                        onClick={toggleSidebar}
                        className="xl:hidden w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-600 rounded-xl transition-colors shrink-0"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                    <div className="flex flex-col min-w-0">
                        <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight truncate flex items-center gap-2">
                            {title}
                        </h2>
                        <p className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wide uppercase truncate">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Right Side: Actions & Profile */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                    <button className="relative w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors shrink-0">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

                    {/* Profile Dropdown Trigger */}
                    <div className="relative group">
                        <button className="flex items-center gap-1.5 hover:bg-slate-50 p-1 rounded-full transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[10px] border border-slate-200 shrink-0 shadow-sm">
                                {(userName || 'V')[0].toUpperCase()}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
