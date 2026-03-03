import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    icon: Icon,
    disabled,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all active:scale-[0.98]";

    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200/50",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200/50",
        outline: "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
        soft: "bg-green-50 text-green-700 hover:bg-green-100",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3.5 text-base",
    };

    const widthClass = fullWidth ? "w-full" : "";
    const disabledClass = (disabled || isLoading) ? "opacity-60 cursor-not-allowed active:scale-100" : "";
    const activeVariant = variants[variant] || variants.primary;
    const activeSize = sizes[size] || sizes.md;

    return (
        <button
            disabled={disabled || isLoading}
            className={`${baseStyles} ${activeVariant} ${activeSize} ${widthClass} ${disabledClass} ${className}`}
            {...props}
        >
            {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-lg mr-2">sync</span>
            ) : Icon && (
                <span className="material-symbols-outlined text-lg mr-2">{Icon}</span>
            )}
            {children}
        </button>
    );
};

export default Button;
