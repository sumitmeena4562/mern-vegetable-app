import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
    const [updating, setUpdating] = useState(false);

    const handleAction = async (newStatus) => {
        setUpdating(true);
        await onUpdateStatus(order._id, newStatus);
        setUpdating(false);
    };

    const statusFlow = {
        pending: { next: 'confirmed', label: 'Accept Order', color: 'bg-green-600' },
        confirmed: { next: 'ready_for_pickup', label: 'Mark as Ready', color: 'bg-blue-600' },
        processing: { next: 'ready_for_pickup', label: 'Mark as Ready', color: 'bg-blue-600' },
    };

    const currentAction = statusFlow[order.status];

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Order #{order.orderId}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white shadow-sm`}>
                                {order.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100"
                    >
                        <span className="material-symbols-outlined font-black">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">

                    {/* Buyer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Buyer Details</p>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                                    <img src={order.buyer?.profilePhoto} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 leading-none">{order.buyer?.fullName}</p>
                                    <p className="text-[11px] font-bold text-slate-500 mt-1">{order.buyer?.mobile}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Shipping Type</p>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm text-slate-400">
                                    <span className="material-symbols-outlined">
                                        {order.deliveryType === 'pickup' ? 'store' : 'local_shipping'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 leading-none uppercase tracking-tighter">
                                        {order.deliveryType.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-[11px] font-bold text-slate-500 mt-1">Platform Logistics</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Items Summary</p>
                        <div className="border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/20">
                            {order.products.map((item, idx) => (
                                <div key={idx} className="p-4 flex justify-between items-center border-b border-slate-100 last:border-0 hover:bg-white transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                                            <span className="material-symbols-outlined text-green-600">potted_plant</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{item.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.quantity} {item.unit} x ₹{item.pricePerUnit}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-slate-900">₹{(item.quantity * item.pricePerUnit).toLocaleString()}</p>
                                </div>
                            ))}
                            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                                <p className="text-xs font-black uppercase tracking-widest opacity-60">Final Settlement Amount</p>
                                <p className="text-xl font-black tracking-tight">₹{order.finalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes or Extras */}
                    {order.notes && (
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Order Notes</p>
                            <p className="text-sm font-medium text-orange-900 italic">"{order.notes}"</p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-slate-100 bg-white flex gap-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                        Close
                    </button>

                    {currentAction && (
                        <button
                            disabled={updating}
                            onClick={() => handleAction(currentAction.next)}
                            className={`flex-1 py-4 ${currentAction.color} text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-green-500/20`}
                        >
                            {updating ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <>
                                    {currentAction.label}
                                    <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    )}

                    {order.status === 'pending' && (
                        <button
                            onClick={() => handleAction('cancelled')}
                            className="px-6 py-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-100 transition-all"
                        >
                            Reject
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default OrderDetailsModal;
