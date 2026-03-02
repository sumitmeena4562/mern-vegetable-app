import React from 'react';
import { createPortal } from 'react-dom';
import { getStatusBadge, getTimeAgo } from '../../../common/orderUtils';

const VendorOrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    const badge = getStatusBadge(order.status?.toLowerCase());

    const getStatusSteps = () => {
        const steps = [
            { key: 'pending', label: 'Order Placed', icon: 'receipt_long' },
            { key: 'confirmed', label: 'Confirmed', icon: 'check_circle' },
            { key: 'processing', label: 'Processing', icon: 'hourglass_empty' },
            { key: 'ready_for_pickup', label: 'Ready', icon: 'inventory' },
            { key: 'delivered', label: 'Delivered', icon: 'local_shipping' },
        ];
        const statusOrder = steps.map(s => s.key);
        const currentIdx = statusOrder.indexOf(order.status?.toLowerCase());
        return steps.map((step, idx) => ({
            ...step,
            completed: idx <= currentIdx,
            active: idx === currentIdx
        }));
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-xl z-10 p-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Order #{order.id || order.orderId}</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                {order.date ? new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                {order.date && ` • ${getTimeAgo(order.date)}`}
                            </p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-slate-600">close</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${badge.color}`}>
                            {badge.label}
                        </span>
                    </div>

                    {/* Progress Timeline */}
                    <div className="flex items-center justify-between gap-1">
                        {getStatusSteps().map((step, idx) => (
                            <div key={step.key} className="flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
                                    ${step.completed ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' :
                                        'bg-slate-100 text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-[16px]">
                                        {step.completed ? 'check' : step.icon}
                                    </span>
                                </div>
                                <p className={`text-[9px] font-bold mt-1.5 text-center ${step.active ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {step.label}
                                </p>
                                {idx < 4 && (
                                    <div className={`h-0.5 w-full mt-[-20px] absolute ${step.completed ? 'bg-indigo-200' : 'bg-slate-100'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Farmer Info */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Farmer</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-indigo-600">agriculture</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{order.farmer || 'Unknown Farmer'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Items</p>
                        <div className="text-sm text-slate-700 font-medium bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            {order.items || order.products || 'Various Items'}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600">Total Amount</span>
                            <span className="text-2xl font-black text-indigo-700">₹{order.total?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default VendorOrderDetailModal;
