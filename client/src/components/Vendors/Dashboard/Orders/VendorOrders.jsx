import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';
import { useSocket } from '../../../../contexts/SocketContext';
import { toast } from 'react-hot-toast';
import Badge from '../../../../components/ui/Badge';
import Skeleton from '../../../../components/ui/Skeleton';
import { useCart } from '../../../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import VendorOrderDetailModal from './VendorOrderDetailModal';

const VendorOrders = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const ORDERS_PER_PAGE = 9;

    const statuses = [
        { id: 'All', label: 'All Orders', icon: 'list' },
        { id: 'Pending', label: 'Pending', icon: 'schedule' },
        { id: 'Processing', label: 'Processing', icon: 'hourglass_empty' },
        { id: 'Ready_for_pickup', label: 'Ready', icon: 'inventory' },
        { id: 'Shipped', label: 'Shipped', icon: 'local_shipping' },
        { id: 'Delivered', label: 'Delivered', icon: 'check_circle' },
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    // Real-time order status updates via Socket.IO
    const { socket } = useSocket();
    useEffect(() => {
        if (!socket) return;
        const handleStatusUpdate = (data) => {
            setOrders(prev => prev.map(o =>
                (o._id === data.orderId || o.orderId === data.orderCode)
                    ? { ...o, status: data.status }
                    : o
            ));
            toast.success(`Order #${data.orderCode} → ${data.status.replace(/_/g, ' ')}`, { icon: '📦' });
        };
        socket.on('order-status-updated', handleStatusUpdate);
        return () => socket.off('order-status-updated', handleStatusUpdate);
    }, [socket]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/vendors/orders');
            if (res.data.success) {
                const formattedOrders = res.data.data.map(order => ({
                    id: order.orderId || order._id,
                    _id: order._id,
                    date: order.createdAt,
                    farmer: order.farmer?.farmName || order.farmer?.fullName || 'Unknown Farmer',
                    rawFarmer: order.farmer,
                    rawProducts: order.products,
                    items: order.products?.map(p => `${p.name} (${p.quantity}${p.unit || 'kg'})`).join(', ') || 'Various Items',
                    total: order.finalAmount || order.totalAmount,
                    status: (order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1),
                    rating: order.rating,
                    review: order.review
                }));
                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error("Failed to fetch vendor orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const res = await api.put(`/vendors/orders/${orderId}/cancel`);
            if (res.data.success) {
                toast.success('Order cancelled successfully', { icon: '❌' });
                setOrders(prev => prev.map(o =>
                    o._id === orderId ? { ...o, status: 'Cancelled' } : o
                ));
                if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.id === orderId)) {
                    setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
                }
            }
        } catch (error) {
            console.error('Cancel order error:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const handleReview = async (orderId, reviewData) => {
        try {
            const res = await api.put(`/vendors/orders/${orderId}/review`, reviewData);
            if (res.data.success) {
                toast.success('Review submitted! Thanks for your feedback.', { icon: '⭐' });
                setOrders(prev => prev.map(o =>
                    o._id === orderId ? { ...o, rating: reviewData.rating, review: { text: reviewData.reviewText, createdAt: new Date() } } : o
                ));
                if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.id === orderId)) {
                    setSelectedOrder({ ...selectedOrder, rating: reviewData.rating, review: { text: reviewData.reviewText, createdAt: new Date() } });
                }
            }
        } catch (error) {
            console.error('Submit review error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    const handleReorder = (order) => {
        try {
            if (!order.rawProducts || !order.rawFarmer) {
                toast.error('Cannot reorder this order due to missing data');
                return;
            }

            let addedCount = 0;
            order.rawProducts.forEach(prod => {
                const cartProduct = {
                    _id: prod.product._id || prod.product,
                    name: prod.name,
                    price: prod.pricePerUnit,
                    unit: prod.unit || 'kg',
                    farmer: order.rawFarmer
                };
                addToCart(cartProduct, prod.quantity);
                addedCount++;
            });

            if (addedCount > 0) {
                toast.success('Items added to cart! Redirecting...', { icon: '🛒' });
                setTimeout(() => navigate('/vendor-dashboard/cart'), 1500);
            }
        } catch (error) {
            console.error('Reorder error:', error);
            toast.error('Failed to add items to cart');
        }
    };

    // Removed getStatusColor since Badge handles styles based on type string

    // Client-side search and filter
    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === 'All' || o.status.toLowerCase() === filter.toLowerCase();
        const matchesSearch = !searchQuery.trim() || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.farmer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, filter]);

    return (
        <>
            <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-500">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Purchase History</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">Track and manage your orders from farmers</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all w-64 md:w-80">
                            <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by order ID or farmer..."
                                className="bg-transparent outline-none text-sm font-medium text-slate-700 w-full placeholder:text-slate-300"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="text-slate-300 hover:text-slate-500">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {statuses.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setFilter(s.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border-2 ${filter === s.id
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} variant="rectangular" className="h-48 rounded-[32px] w-full" />
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white/40 backdrop-blur-xl border border-white rounded-[32px]">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 opacity-50">
                            <span className="material-symbols-outlined text-5xl">{searchQuery ? 'search_off' : 'shopping_cart_off'}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{searchQuery ? 'No matching orders' : 'No orders found'}</h3>
                        <p className="text-sm font-medium mt-1">{searchQuery ? 'Try a different search term.' : 'Try changing the status filter or complete a new purchase.'}</p>
                    </div>
                ) : (
                    <>
                        {/* Result count */}
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-400">
                                Showing {paginatedOrders.length} of {filteredOrders.length} orders
                                {searchQuery && <span> for "{searchQuery}"</span>}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {paginatedOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white group rounded-[32px] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-200/30 transition-all overflow-hidden relative"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge type={order.status.toLowerCase()}>
                                            {order.status}
                                        </Badge>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{order.id}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200">
                                                    <span className="material-symbols-outlined text-[12px]">agriculture</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{order.farmer}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Items Summary</p>
                                                <p className="text-sm font-black text-slate-800 tracking-tight truncate pr-2">{order.items}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
                                                <p className="text-sm font-black text-indigo-600 tracking-tight">₹{order.total}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button onClick={() => setSelectedOrder(order)} className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">
                                                View Details
                                            </button>
                                            <button className="w-12 h-12 bg-white text-slate-400 rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-center shadow-sm">
                                                <span className="material-symbols-outlined text-lg">receipt_long</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Decorative Background Element */}
                                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 group-hover:bg-indigo-50 transition-transform duration-700 pointer-events-none -z-0 opacity-50"></div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .map((page, idx, arr) => (
                                        <React.Fragment key={page}>
                                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                                                <span className="text-slate-300 text-sm font-bold">…</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === page
                                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-300'
                                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Order Detail Modal */}
            {
                selectedOrder && (
                    <VendorOrderDetailModal
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                        onCancel={handleCancelOrder}
                        onReview={handleReview}
                        onReorder={handleReorder}
                    />
                )
            }
        </>
    );
};

export default VendorOrders;
