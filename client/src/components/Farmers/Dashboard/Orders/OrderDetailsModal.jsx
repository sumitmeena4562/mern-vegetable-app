import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
    const [updating, setUpdating] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleAction = async (newStatus) => {
        setUpdating(true);
        await onUpdateStatus(order._id, newStatus);
        setUpdating(false);
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 4) {
            alert('Please enter a valid 4-digit OTP');
            return;
        }
        setVerifying(true);
        try {
            const res = await api.put(`/farmers/orders/${order._id}/verify-delivery`, { otp });
            if (res.data.success) {
                onUpdateStatus(order._id, 'delivered'); // Trigger refresh in parent
                onClose();
            }
        } catch (error) {
            console.error('OTP Verification failed:', error);
            alert(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setVerifying(false);
        }
    };

    const statusFlow = {
        pending: { next: 'confirmed', label: 'Accept Order', color: 'bg-green-600' },
        confirmed: { next: 'ready_for_pickup', label: 'Mark as Ready', color: 'bg-blue-600' },
        processing: { next: 'ready_for_pickup', label: 'Mark as Ready', color: 'bg-blue-600' },
    };

    const currentAction = statusFlow[order.status];

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Order #${order.orderId}`}
            subtitle={`Placed on ${new Date(order.createdAt).toLocaleString()}`}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-8">
                {/* Status Badge */}
                <div>
                    <Badge status={order.status} />
                </div>

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

                {/* Delivery Verification - OTP Input */}
                {(order.status === 'ready_for_pickup' || order.status === 'in_transit') && (
                    <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-3xl space-y-4 shadow-sm">
                        <div className="flex items-center gap-3 text-indigo-700">
                            <span className="material-symbols-outlined font-black">lock_open</span>
                            <span className="text-sm font-black uppercase tracking-widest">Delivery Verification</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500">Ask the Vendor for the 4-digit delivery code to complete this transaction.</p>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                maxLength={4}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="4-Digit OTP"
                                className="flex-1 bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-lg font-black tracking-[0.5em] text-center focus:border-indigo-500 outline-none transition-all placeholder:tracking-normal placeholder:text-sm placeholder:font-bold"
                            />
                            <Button
                                isLoading={verifying}
                                onClick={handleVerifyOtp}
                                className="bg-indigo-600 px-8"
                            >
                                Verify
                            </Button>
                        </div>
                    </div>
                )}

                {/* Notes or Extras */}
                {order.notes && (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Order Notes</p>
                        <p className="text-sm font-medium text-orange-900 italic">"{order.notes}"</p>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="pt-6 border-t border-slate-100 flex gap-4 mt-8">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="px-8"
                    >
                        Close
                    </Button>

                    {currentAction && (
                        <Button
                            isLoading={updating}
                            onClick={() => handleAction(currentAction.next)}
                            className={`flex-1 ${currentAction.color}`}
                            icon="arrow_forward"
                        >
                            {currentAction.label}
                        </Button>
                    )}

                    {order.status === 'pending' && (
                        <Button
                            onClick={() => handleAction('cancelled')}
                            className="bg-red-50 text-red-600 hover:bg-red-100 shadow-none px-6"
                        >
                            Reject
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default OrderDetailsModal;
