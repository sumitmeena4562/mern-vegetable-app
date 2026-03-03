import React, { useId } from 'react';

const Input = ({
    label,
    error,
    icon,
    helpText,
    suffix,
    rightElement,
    id,
    className = '',
    wrapperClassName = '',
    ...props
}) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const IconSpan = typeof icon === 'string' ? "material-symbols-outlined" : "";

    return (
        <div className={`w-full ${wrapperClassName}`}>
            {label && (
                <label htmlFor={inputId} className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none">
                        <span className={`${IconSpan} text-slate-400 text-[20px] leading-none`}>
                            {icon}
                        </span>
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
            w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800
            focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all
            ${icon ? 'pl-11' : ''}
            ${suffix || rightElement ? 'pr-12' : ''}
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
            ${className}
          `}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center z-10">
                        {rightElement}
                    </div>
                )}
                {suffix && !rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center pointer-events-none z-10">
                        <span className="text-slate-400 font-bold text-sm leading-none">
                            {suffix}
                        </span>
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {error}
                </p>
            )}
            {helpText && !error && (
                <p className="mt-1.5 text-xs font-medium text-slate-400">
                    {helpText}
                </p>
            )}
        </div>
    );
};

export default Input;
