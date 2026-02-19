import React from 'react';
import ReactDOM from 'react-dom';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName, loading }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={loading ? null : onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white/95 backdrop-blur-2xl border border-white/40 w-full max-w-md rounded-[40px] shadow-2xl shadow-slate-900/40 p-8 md:p-10 animate-in zoom-in-95 duration-300">

                {/* Warning Icon Container */}
                <div className="w-20 h-20 bg-red-50 rounded-[28px] flex items-center justify-center mb-8 mx-auto group">
                    <div className="w-14 h-14 bg-red-100/50 rounded-2xl flex items-center justify-center text-red-600 transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-4xl font-black">delete_forever</span>
                    </div>
                </div>

                {/* Text Coverage */}
                <div className="text-center space-y-3 mb-10">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Delete Product?</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        You are about to permanently remove <span className="text-slate-900 font-bold">"{productName}"</span>.
                        This action cannot be undone.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full h-16 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-200/50 flex items-center justify-center gap-3 active:scale-95 translate-z-0"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl">delete</span>
                                Confirm Delete
                            </>
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full h-16 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center active:scale-95"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeleteConfirmModal;
