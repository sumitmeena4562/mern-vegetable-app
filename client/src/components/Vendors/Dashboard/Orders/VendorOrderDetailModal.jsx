import React, { useState } from 'react';
import Modal from '../../../ui/Modal';
import { getStatusBadge, getTimeAgo } from '../../../common/orderUtils';
import Badge from '../../../../components/ui/Badge';

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

    return (
        <Modal isOpen={true} onClose={onClose} maxWidth="max-w-lg">
            <div className="max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-xl z-10 p-6 pb-4 border-b border-slate-100 -mt-6 -mx-6 mb-4">
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
                        <Badge type={order.status?.toLowerCase()}>
                            {order.status}
                        </Badge>
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
                                onClick={() => window.open(`/vendor-dashboard/orders/${order._id || order.id}/invoice`, '_blank')}
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
                                        <span className={`material-symbols-outlined text-3xl ${star <= rating ? 'font-[Material_Symbols_Outlined_Solid]' : ''}`} style={star <= rating ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
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
