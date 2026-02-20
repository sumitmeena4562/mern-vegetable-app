import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';

const VendorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const dummyOrders = [
        { id: '#ORD-9012', date: '2023-10-27', farmer: 'Rajesh Kumar', items: 'Tomatoes (50kg), Onions (20kg)', total: 2700, status: 'Processing' },
        { id: '#ORD-8834', date: '2023-10-25', farmer: 'Vikram Das', items: 'Green Chili (10kg)', total: 600, status: 'Shipped' },
        { id: '#ORD-8711', date: '2023-10-20', farmer: 'Suresh Singh', items: 'Potatoes (100kg)', total: 2500, status: 'Delivered' },
    ];

    useEffect(() => {
        setTimeout(() => {
            setOrders(dummyOrders);
            setLoading(false);
        }, 800);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing': return 'hourglass_empty';
            case 'Shipped': return 'local_shipping';
            case 'Delivered': return 'check_circle';
            case 'Cancelled': return 'cancel';
            default: return 'help';
        }
    };

    const filteredOrders = orders.filter(o => filter === 'All' || o.status === filter);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Purchase History</h1>
                    <p className="text-slate-500 font-medium mt-1">Track and manage your orders from farmers</p>
                </div>

                <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-xl overflow-x-auto w-full sm:w-auto hide-scrollbar">
                    {['All', 'Processing', 'Shipped', 'Delivered'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${filter === status ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center h-64">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">receipt_long</span>
                        <h3 className="text-lg font-bold text-slate-800">No orders found</h3>
                        <p className="text-slate-500 text-sm mt-1">You haven't placed any orders with this status.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="p-5 sm:p-6 hover:bg-slate-50 transition-colors group flex flex-col md:flex-row gap-4 md:items-center justify-between">

                                {/* Order Identity & Date */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                                        <span className="material-symbols-outlined text-slate-500">shopping_bag</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-bold text-slate-800">{order.id}</h3>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <p className="text-sm font-medium text-slate-500">{order.date}</p>
                                        </div>
                                        <p className="text-sm text-slate-600"><span className="font-semibold">Items:</span> {order.items}</p>
                                        <p className="text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">agriculture</span>
                                            Farmer: {order.farmer}
                                        </p>
                                    </div>
                                </div>

                                {/* Amount, Status & Action */}
                                <div className="flex items-center justify-between md:justify-end gap-6 ml-16 md:ml-0 md:min-w-[300px]">
                                    <div className="text-left md:text-right flex-1">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Amount</p>
                                        <p className="text-lg font-black text-slate-800">₹{order.total}</p>
                                    </div>

                                    <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                        <span className="material-symbols-outlined text-[14px]">{getStatusIcon(order.status)}</span>
                                        {order.status}
                                    </div>

                                    <button className="w-10 h-10 rounded-full hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 flex items-center justify-center text-blue-600 transition-all active:scale-95 shrink-0">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default VendorOrders;
