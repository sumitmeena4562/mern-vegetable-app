import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const ProductDetailModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(product.minimumOrder || product.minOrder || 1);
    const [ordering, setOrdering] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    const price = product.pricePerUnit || product.price || 0;
    const total = price * quantity;
    const farmerName = product.farmer?.fullName || product.farmer?.farmName || product.farmer || 'Unknown Farmer';
    const rating = (() => {
        const r = product.farmer?.averageRating || product.rating;
        if (!r) return 4.5;
        if (typeof r === 'object') return r.average || 4.5;
        return r;
    })();

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`${product.name} × ${quantity} added to cart!`);
        onClose();
    };

    const handleOrderNow = async () => {
        setOrdering(true);
        try {
            const res = await api.post('/vendors/orders', {
                items: [{ productId: product._id, quantity }],
                deliveryType: 'pickup',
                paymentMethod: 'online'
            });
            if (res.data.success) {
                toast.success(res.data.message || 'Order placed!');
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setOrdering(false);
        }
    };

    const minQty = product.minimumOrder || product.minOrder || 1;
    const maxQty = product.availableQuantity || 999;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <div
                className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ─── HERO IMAGE SECTION ─── */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100 shrink-0">
                    {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-slate-100 to-violet-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-7xl text-slate-300">eco</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Close */}
                    <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/40 transition-colors border border-white/20">
                        <span className="material-symbols-outlined text-white">close</span>
                    </button>

                    {/* Top badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black text-slate-800 shadow-lg flex items-center gap-1.5 border border-white/50">
                            <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                            {rating}
                        </div>
                        {product.isOrganic && (
                            <div className="bg-emerald-500 px-3 py-1.5 rounded-full text-xs font-black text-white shadow-lg flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">eco</span>
                                Organic
                            </div>
                        )}
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-end justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">{product.variety || 'Standard'} • {product.category || 'Vegetable'}</p>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">{product.name}</h2>
                            </div>
                            <div className="bg-white/15 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 shrink-0">
                                <p className="text-2xl font-black text-white">₹{price}</p>
                                <p className="text-[10px] font-black text-white/60 text-center uppercase">per {product.unit}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── SCROLLABLE CONTENT ─── */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                    {/* Farmer Card */}
                    <div className="flex items-center gap-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-2xl p-4 border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0 shadow-inner">
                            <span className="material-symbols-outlined text-indigo-600 text-xl">agriculture</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-800 text-sm truncate">{farmerName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {product.distance || 'Nearby'} • {product.farmer?.location?.address?.village || 'Local Farm'}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shrink-0">
                            <span className="material-symbols-outlined text-[12px] text-emerald-500">verified</span>
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Verified</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-slate-100 rounded-2xl p-1">
                        {['details', 'info'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab === 'details' ? 'Product Details' : 'More Info'}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'details' ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { icon: 'inventory_2', label: 'Available', value: `${product.availableQuantity || 0}`, sub: product.unit },
                                    { icon: 'shopping_bag', label: 'Min Order', value: `${minQty}`, sub: product.unit },
                                    { icon: 'schedule', label: 'Freshness', value: product.shelfLife || 'Today', sub: '' },
                                    { icon: 'location_on', label: 'Distance', value: product.distance || '-', sub: '' },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-center">
                                        <span className="material-symbols-outlined text-lg text-indigo-400 mb-1 block">{stat.icon}</span>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-sm font-black text-slate-800 mt-0.5">
                                            {stat.value} {stat.sub && <span className="text-[9px] text-slate-400 uppercase">{stat.sub}</span>}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{product.description}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-3">
                            {[
                                { label: 'Category', value: product.category || 'Vegetable', icon: 'category' },
                                { label: 'Variety', value: product.variety || 'Standard', icon: 'spa' },
                                { label: 'Unit', value: product.unit || 'kg', icon: 'scale' },
                                { label: 'Harvest Date', value: product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'Today', icon: 'calendar_today' },
                                { label: 'Storage', value: product.storageType || 'Normal', icon: 'warehouse' },
                                { label: 'Quality Grade', value: product.grade || 'A', icon: 'workspace_premium' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-lg text-slate-400">{item.icon}</span>
                                        <span className="text-xs font-bold text-slate-500">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-800">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── STICKY BOTTOM: QTY + ACTIONS ─── */}
                <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-5 space-y-4">
                    {/* Quantity Row */}
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</p>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">Min: {minQty} {product.unit}</p>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                            <button
                                onClick={() => setQuantity(q => Math.max(minQty, q - minQty))}
                                disabled={quantity <= minQty}
                                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-30 border border-slate-100"
                            >
                                <span className="material-symbols-outlined text-lg">remove</span>
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value) || minQty;
                                    setQuantity(Math.min(maxQty, Math.max(minQty, v)));
                                }}
                                className="w-16 text-center text-lg font-black text-slate-800 bg-transparent outline-none"
                            />
                            <button
                                onClick={() => setQuantity(q => Math.min(maxQty, q + minQty))}
                                disabled={quantity >= maxQty}
                                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-30 border border-slate-100"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                            <p className="text-xl font-black text-indigo-600">₹{total.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 py-3.5 bg-white text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-lg">shopping_cart</span>
                            Add to Cart
                        </button>
                        <button
                            onClick={handleOrderNow}
                            disabled={ordering}
                            className="flex-1 py-3.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20 hover:shadow-indigo-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {ordering ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Placing...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">flash_on</span>
                                    Order Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProductDetailModal;
