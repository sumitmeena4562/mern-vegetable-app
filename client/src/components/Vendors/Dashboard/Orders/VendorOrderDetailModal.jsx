import React, { useState } from 'react';
import Modal from '../../../ui/Modal';
import { getStatusBadge, getTimeAgo } from '../../../common/orderUtils';
import Badge from '../../../../components/ui/Badge';
import { generateInvoice } from '../../../../utils/InvoiceGenerator';

const VendorOrderDetailModal = ({ order, onClose, onCancel, onReview, onReorder }) => {
    const [isReviewing, setIsReviewing] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!order) return null;

    const handleSubmitReview = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        await onReview(order._id || order.id, { rating, reviewText });
        setSubmitting(false);
        setIsReviewing(false);
    };

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

    const statusSteps = getStatusSteps();
    const completedCount = statusSteps.filter(s => s.completed).length;
    const totalSteps = statusSteps.length;
    const progressPercent = totalSteps > 1 ? ((completedCount - 1) / (totalSteps - 1)) * 100 : 0;

    return (
        <Modal isOpen={true} onClose={onClose} maxWidth="max-w-lg">
            <div className="max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white z-20 px-6 pt-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-black text-slate-900 truncate">
                                Order #{order.id || order.orderId}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                {order.date ? new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                {order.date && ` • ${getTimeAgo(order.date)}`}
                            </p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 shrink-0 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-slate-600">close</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Badge - FIXED: use 'status' prop, not 'type' */}
                    <div className="flex items-center gap-3">
                        <Badge status={order.status?.toLowerCase()} />
                    </div>

                    {/* Delivery OTP - FOR VENDOR EYES ONLY */}
                    {order.status?.toLowerCase() === 'ready_for_pickup' && (
                        <div className="bg-amber-500 rounded-2xl p-5 border border-amber-400 shadow-lg shadow-amber-200/50 flex items-center justify-between overflow-hidden relative group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">Delivery OTP</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-3xl font-black text-white tracking-widest leading-none">
                                        {order.logistics?.deliveryOtp || '----'}
                                    </span>
                                    <span className="material-symbols-outlined text-white/50 text-xl">key</span>
                                </div>
                            </div>
                            <div className="relative z-10 text-right">
                                <span className="material-symbols-outlined text-white text-4xl opacity-40 group-hover:rotate-12 transition-transform">qr_code_2</span>
                                <p className="text-[8px] font-bold text-white/60 uppercase mt-1">Share with Farmer</p>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        </div>
                    )}

                    {/* Progress Timeline */}
                    <div className="space-y-3 py-2">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Tracking History</p>
                        <div className="space-y-0 relative">
                            {/* Vertical Line - Background */}
                            <div className="absolute left-[19px] top-5 bottom-5 w-[3px] bg-slate-100 rounded-full"></div>
                            {/* Vertical Line - Active Progress */}
                            <div
                                className="absolute left-[19px] top-5 w-[3px] bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full transition-all duration-700 z-[1]"
                                style={{ height: `calc(${progressPercent}% - ${progressPercent > 0 ? '20px' : '0px'})` }}
                            ></div>

                            {statusSteps.map((step) => (
                                <div key={step.key} className="relative pl-14 pb-7 last:pb-0">
                                    {/* Circle */}
                                    <div className={`absolute left-0 top-0 w-10 h-10 rounded-full z-[2] flex items-center justify-center transition-all duration-500
                                        ${step.completed ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200/60' :
                                            step.active ? 'bg-white border-[3px] border-indigo-500 text-indigo-600 scale-110 shadow-lg shadow-indigo-100/80' :
                                                'bg-slate-50 border-2 border-slate-200 text-slate-300 scale-90'}`}>
                                        <span className="material-symbols-outlined text-base">
                                            {step.completed ? 'check' : step.icon}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="min-h-[40px] flex flex-col justify-center">
                                        <h4 className={`text-sm font-bold transition-colors ${step.completed || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {step.label}
                                        </h4>
                                        {(step.completed || step.active) && (
                                            <p className={`text-[10px] font-semibold mt-0.5 ${step.active ? 'text-indigo-500' : 'text-slate-400'}`}>
                                                {step.active ? 'In Progress' : 'Completed'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Farmer Info */}
                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-5 border border-slate-100/80">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">Farmer</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-indigo-600 text-xl">agriculture</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-800 text-sm truncate">{order.farmer || 'Unknown Farmer'}</p>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Verified Farmer</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">Items</p>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            {/* items comes as a comma-separated string from VendorOrders formatOrder */}
                            {typeof order.items === 'string' ? (
                                order.items.split(', ').map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 border-b border-slate-100/80 last:border-0">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 shrink-0">
                                            <span className="material-symbols-outlined text-green-600 text-sm">eco</span>
                                        </div>
                                        <p className="text-sm text-slate-700 font-medium flex-1 min-w-0">{item}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-700 font-medium">{order.items || order.products || 'Various Items'}</p>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 shadow-lg shadow-indigo-200/40">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Total Amount</span>
                            <span className="text-2xl font-black text-white">₹{order.total?.toLocaleString() || 0}</span>
                        </div>
                    </div>

                    {/* Cancel Action */}
                    {order.status?.toLowerCase() === 'pending' && (
                        <div className="pt-2">
                            <button
                                onClick={() => onCancel(order._id || order.id)}
                                className="w-full py-3.5 bg-red-50 text-red-600 font-bold text-sm rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100"
                            >
                                <span className="material-symbols-outlined text-lg">cancel</span>
                                Cancel Order
                            </button>
                        </div>
                    )}

                    {/* Review Action */}
                    {order.status?.toLowerCase() === 'delivered' && !order.rating && !isReviewing && (
                        <div className="pt-2">
                            <button
                                onClick={() => setIsReviewing(true)}
                                className="w-full py-3.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-2xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 border border-indigo-100"
                            >
                                <span className="material-symbols-outlined text-lg">star</span>
                                Rate Farmer & Produce
                            </button>
                        </div>
                    )}

                    {/* Download Invoice Action */}
                    {order.status?.toLowerCase() === 'delivered' && (
                        <div className="pt-2">
                            <button
                                onClick={() => generateInvoice(order)}
                                className="w-full py-3.5 bg-slate-800 text-white font-bold text-sm rounded-2xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 border border-slate-700 shadow-lg shadow-slate-900/10"
                            >
                                <span className="material-symbols-outlined text-lg">receipt_long</span>
                                Download Invoice
                            </button>
                        </div>
                    )}

                    {/* Reorder Action */}
                    {order.status?.toLowerCase() === 'delivered' && (
                        <div className="pt-2">
                            <button
                                onClick={() => onReorder && onReorder(order)}
                                className="w-full py-3.5 bg-emerald-50 text-emerald-600 font-bold text-sm rounded-2xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 border border-emerald-100"
                            >
                                <span className="material-symbols-outlined text-lg">shopping_basket</span>
                                Reorder Items
                            </button>
                        </div>
                    )}

                    {/* Review Form */}
                    {isReviewing && (
                        <div className="pt-4 mt-4 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <h4 className="font-black text-slate-800 text-sm">Leave a Review</h4>
                            <div className="flex items-center gap-2 justify-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`transition-all ${star <= rating ? 'text-amber-400 scale-110' : 'text-slate-300 hover:text-amber-200'}`}
                                    >
                                        <span className={`material-symbols-outlined text-3xl`} style={star <= rating ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write a short review about the produce quality and farmer..."
                                className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                            ></textarea>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsReviewing(false)}
                                    className="flex-1 py-3 text-slate-500 font-bold text-xs bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={rating === 0 || submitting}
                                    className="flex-[2] py-3 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Already Reviewed */}
                    {order.rating && (
                        <div className="pt-4 mt-2 border-t border-slate-100">
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Your Rating</p>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="material-symbols-outlined text-sm" style={i < order.rating ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default VendorOrderDetailModal;
