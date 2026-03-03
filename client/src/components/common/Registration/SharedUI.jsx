import React from 'react';

/**
 * Shared RegistrationCard - a themed container for registration sections.
 */
export const RegistrationCard = ({
    children,
    title,
    icon,
    iconColor = 'text-slate-600',
    bgColor = 'bg-white',
    borderColor = 'border-slate-100',
    delayClass = 'delay-0'
}) => {
    return (
        <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${delayClass} relative z-[20]`}>
            <div className={`${bgColor} rounded-3xl p-6 border ${borderColor}`}>
                {title && (
                    <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                        {title}
                    </h3>
                )}
                {children}
            </div>
        </div>
    );
};

/**
 * Shared RegistrationHeader - the top part of the registration page.
 */
export const RegistrationHeader = ({
    title,
    subtitle,
    icon,
    iconBg = 'bg-slate-900',
    progress = 0,
    progressText
}) => {
    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center p-4 rounded-[2rem] bg-white shadow-xl shadow-slate-100 mb-6 group border border-slate-100 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
                <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500 text-white`}>
                    <span className="material-symbols-outlined text-[32px]">{icon}</span>
                </div>
            </div>
            <h2 className="text-[28px] font-black text-slate-900 tracking-tight">{title}</h2>
            <div className="mt-1 text-sm font-bold text-slate-500 flex items-center justify-center gap-1 uppercase tracking-widest opacity-70">
                {subtitle}
            </div>
            <div className="mt-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Progress: {progress}% • {progressText || (progress >= 100 ? "Ready!" : "Complete all fields")}
            </div>
        </div>
    );
};
