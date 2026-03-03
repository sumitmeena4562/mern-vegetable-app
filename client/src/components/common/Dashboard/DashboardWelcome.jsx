import React from 'react';

/**
 * Shared DashboardWelcome - a premium greeting banner for dashboards.
 */
const DashboardWelcome = ({
    greeting,
    userName,
    portalName,
    tagline,
    badgeText,
    badgeIcon = 'palette',
    themeColor = 'indigo' // 'indigo' or 'green'
}) => {
    const isGreen = themeColor === 'green';

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 ${isGreen ? 'bg-green-50 text-green-600 border-green-100/50' : 'bg-indigo-50 text-indigo-600 border-indigo-100/50'} rounded-full text-[10px] font-black uppercase tracking-wider border`}>
                        {portalName}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isGreen ? 'bg-emerald-500' : 'bg-emerald-500'} animate-pulse`}></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider italic">System Live</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    {greeting.text}, {userName.split(' ')[0]}!
                    <span className="inline-block animate-bounce animation-delay-500">{greeting.emoji}</span>
                </h2>
                <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wide opacity-70">
                    {tagline}
                </p>
            </div>

            {badgeText && (
                <div className="flex items-center gap-4 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className={`px-5 py-3 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm group transition-all cursor-default ${isGreen ? 'hover:border-green-200' : 'hover:border-indigo-200'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isGreen ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            <span className="material-symbols-outlined text-[18px]">{badgeIcon}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Status</span>
                            <span className="text-sm font-black text-slate-800">{badgeText}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardWelcome;
