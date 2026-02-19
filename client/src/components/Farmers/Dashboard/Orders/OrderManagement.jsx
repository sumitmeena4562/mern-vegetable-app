import React, { useState, useEffect } from 'react';
import { getFarmerOrders, updateOrderStatus } from '@/api/userApi';
import OrderDetailsModal from './OrderDetailsModal';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const statuses = [
        { id: 'all', label: 'All Orders', icon: 'list' },
        { id: 'pending', label: 'New', icon: 'new_releases' },
        { id: 'confirmed', label: 'Preparing', icon: 'potted_plant' },
        { id: 'ready_for_pickup', label: 'Ready', icon: 'local_shipping' },
        { id: 'delivered', label: 'Completed', icon: 'check_circle' },
    ];

    useEffect(() => {
        fetchOrders();
    }, [selectedStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await getFarmerOrders(selectedStatus);
            if (res.success) {
                setOrders(res.data);
            }
        } catch (error) {
            console.error("Orders loading error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const res = await updateOrderStatus(orderId, { status: newStatus });
            if (res.success) {
                fetchOrders();
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder(res.data);
                }
            }
        } catch (error) {
            console.error("Status update error:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'ready_for_pickup': return 'bg-green-50 text-green-600 border-green-100';
            case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-500">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Order Management</h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Track and fulfillment your farm orders</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </button>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <span className="material-symbols-outlined text-slate-400">filter_list</span>
                    </button>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {statuses.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setSelectedStatus(s.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border-2 ${selectedStatus === s.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                            : 'bg-white text-slate-500 border-white hover:border-slate-100 hover:bg-slate-50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">{s.icon}</span>
                        {s.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-slate-100 rounded-[32px]"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white/40 backdrop-blur-xl border border-white rounded-[32px]">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 opacity-50">
                        <span className="material-symbols-outlined text-5xl">shopping_cart_off</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">No orders found</h3>
                    <p className="text-sm font-medium mt-1">Try changing the status filter or wait for new orders.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white group rounded-[32px] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-green-200/30 transition-all overflow-hidden relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                    {order.status.replace(/_/g, ' ')}
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">#{order.orderId}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                            <img
                                                src={order.buyer?.profilePhoto}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = '<span class="text-[8px] font-black text-slate-400">' + (order.buyer?.fullName?.[0] || 'U') + '</span>';
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{order.buyer?.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Items</p>
                                        <p className="text-sm font-black text-slate-800 tracking-tight">{order.products.length} Products</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
                                        <p className="text-sm font-black text-green-600 tracking-tight">₹{order.finalAmount}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all"
                                    >
                                        Details
                                    </button>
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                                            className="flex-1 py-3 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                    {order.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'ready_for_pickup')}
                                            className="flex-1 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-1"
                                        >
                                            Ready
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Decorative Background Element */}
                            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 group-hover:bg-green-50 transition-transform duration-700 pointer-events-none -z-0 opacity-50"></div>
                        </div>
                    ))}
                </div>
            )}

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdateStatus={handleStatusUpdate}
                />
            )}
        </div>
    );
};

export default OrderManagement;
