import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    maxWidth = 'max-w-lg',
    className = ''
}) => {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative bg-white rounded-[32px] w-full ${maxWidth} max-h-[90vh] overflow-hidden overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${className}`}
            >
                {/* Header */}
                {(title || subtitle) && (
                    <div className="sticky top-0 bg-white/90 backdrop-blur-xl px-6 pt-6 pb-4 border-b border-slate-100 rounded-t-[32px] z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                {title && <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>}
                                {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0"
                            >
                                <span className="material-symbols-outlined text-slate-500">close</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Body */}
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
