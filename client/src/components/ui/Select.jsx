import React, { useId } from 'react';

const Select = ({
    label,
    options = [],
    error,
    icon,
    helpText,
    id,
    className = '',
    wrapperClassName = '',
    ...props
}) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const IconSpan = typeof icon === 'string' ? "material-symbols-outlined" : "";

    return (
        <div className={`w-full ${wrapperClassName}`}>
            {label && (
                <label htmlFor={selectId} className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none z-10">
                        <span className={`${IconSpan} text-slate-400 text-[20px] leading-none`}>
                            {icon}
                        </span>
                    </div>
                )}
                <select
                    id={selectId}
                    className={`
            w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800
            focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all appearance-none cursor-pointer
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
            ${className}
          `}
                    {...props}
                >
                    {options.map((opt, i) => (
                        <option key={i} value={opt.value !== undefined ? opt.value : opt}>
                            {opt.label || opt}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center pointer-events-none z-10">
                    <span className="material-symbols-outlined text-slate-400 text-[20px] leading-none mt-[2px]">expand_more</span>
                </div>
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

export default Select;
