import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const ProductDetailModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(product.minimumOrder || product.minOrder || 1);
    const [ordering, setOrdering] = useState(false);
    const [deliveryType, setDeliveryType] = useState('pickup');
    const [notes, setNotes] = useState('');

    const price = product.pricePerUnit || product.price || 0;
    const total = price * quantity;
    const farmerName = product.farmer?.fullName || product.farmer?.farmName || product.farmer || 'Unknown Farmer';
    const minQty = product.minimumOrder || product.minOrder || 1;
    const maxQty = product.availableQuantity || 999;
    const rating = (() => {
        const r = product.farmer?.averageRating || product.rating;
        if (!r) return 4.5;
        return typeof r === 'object' ? (r.average || 4.5) : r;
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
                deliveryType,
                paymentMethod: 'online',
                deliveryAddress: {},
                notes
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

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[440px] overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Image ── */}
                <div className="relative h-52 bg-slate-100">
                    {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300">eco</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Close */}
                    <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors">
                        <span className="material-symbols-outlined text-white text-lg">close</span>
                    </button>

                    {/* Rating */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-700 flex items-center gap-1 shadow">
                        <span className="material-symbols-outlined text-amber-500 text-[13px]">star</span>
                        {rating}
                    </div>

                    {/* Name + Price overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5">{product.variety || 'Standard'} • {product.category || 'Vegetable'}</p>
                            <h2 className="text-xl font-extrabold text-white leading-tight truncate">{product.name}</h2>
                        </div>
                        <div className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl shrink-0">
                            <span className="text-lg font-extrabold text-white">₹{price}</span>
                            <span className="text-[9px] font-bold text-white/60 ml-0.5">/{product.unit}</span>
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="px-5 py-4 space-y-4 max-h-[40vh] overflow-y-auto">

                    {/* Farmer */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-indigo-500 text-lg">agriculture</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{farmerName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{product.distance || 'Nearby'} • {product.farmer?.location?.address?.village || 'Local Farm'}</p>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-wide flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[10px]">verified</span>
                            Verified
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center py-2.5 bg-slate-50 rounded-xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Available</p>
                            <p className="text-sm font-extrabold text-slate-800 mt-0.5">{product.availableQuantity || 0} <span className="text-[9px] text-slate-400 font-bold">{product.unit}</span></p>
                        </div>
                        <div className="text-center py-2.5 bg-slate-50 rounded-xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Min Order</p>
                            <p className="text-sm font-extrabold text-slate-800 mt-0.5">{minQty} <span className="text-[9px] text-slate-400 font-bold">{product.unit}</span></p>
                        </div>
                        <div className="text-center py-2.5 bg-slate-50 rounded-xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Freshness</p>
                            <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{product.shelfLife || 'Fresh'}</p>
                        </div>
                    </div>

                    {/* Extra Info Rows */}
                    <div className="space-y-1.5">
                        {[
                            { label: 'Category', value: product.category || 'Vegetable' },
                            { label: 'Quality', value: product.grade || 'Grade A' },
                            product.description ? { label: 'Note', value: product.description } : null,
                        ].filter(Boolean).map(item => (
                            <div key={item.label} className="flex justify-between items-start text-xs py-1.5 border-b border-slate-50 last:border-0">
                                <span className="text-slate-400 font-medium">{item.label}</span>
                                <span className="text-slate-700 font-bold text-right max-w-[60%] leading-snug">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Checkout Options (Delivery & Notes) ── */}
                <div className="px-5 pb-4 space-y-4">
                    {/* Delivery Method */}
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Delivery Method</p>
                        <div className="grid grid-cols-2 gap-2">
                            {['pickup', 'delivery'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setDeliveryType(type)}
                                    className={`py-2 px-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-1.5 ${deliveryType === type
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[13px]">
                                        {type === 'pickup' ? 'store' : 'local_shipping'}
                                    </span>
                                    {type === 'pickup' ? 'Pickup' : 'Delivery'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add delivery note or instructions..."
                            className="w-full bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700 font-medium border border-slate-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none resize-none h-14 placeholder:text-slate-300"
                        />
                    </div>
                </div>

                {/* ── Bottom Bar ── */}
                <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50/50">
                    {/* Qty + Total */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white rounded-xl border border-slate-200 p-1">
                            <button
                                onClick={() => setQuantity(q => Math.max(minQty, q - minQty))}
                                disabled={quantity <= minQty}
                                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-base">remove</span>
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.min(maxQty, Math.max(minQty, parseInt(e.target.value) || minQty)))}
                                className="w-12 text-center text-base font-extrabold text-slate-800 bg-transparent outline-none"
                            />
                            <button
                                onClick={() => setQuantity(q => Math.min(maxQty, q + minQty))}
                                disabled={quantity >= maxQty}
                                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-base">add</span>
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Total</p>
                            <p className="text-xl font-extrabold text-indigo-600">₹{total.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2.5">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 py-3 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-base">shopping_cart</span>
                            Add to Cart
                        </button>
                        <button
                            onClick={handleOrderNow}
                            disabled={ordering}
                            className="flex-1 py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                            {ordering ? (
                                <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing...</>
                            ) : (
                                <><span className="material-symbols-outlined text-base">flash_on</span> Order Now</>
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
