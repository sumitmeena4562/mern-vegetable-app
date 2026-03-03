import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName, loading }) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={loading ? undefined : onClose}
            maxWidth="max-w-md"
            className="p-8 md:p-10"
        >
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
                <Button
                    onClick={onConfirm}
                    isLoading={loading}
                    className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-200/50"
                    icon="delete"
                >
                    Confirm Delete
                </Button>

                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                    className="w-full h-16 text-[10px] uppercase tracking-[0.2em]"
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
