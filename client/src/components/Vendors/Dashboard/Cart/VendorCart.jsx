import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import Button from '../../../ui/Button';

const VendorCart = () => {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, clearCart, checkout, cartTotal, cartItemCount } = useCart();
    const [placing, setPlacing] = useState(false);
    const [deliveryType, setDeliveryType] = useState('pickup');
    const [notes, setNotes] = useState('');

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setPlacing(true);
        try {
            const result = await checkout({ deliveryType, notes });
            toast.success(result.message || 'Order placed successfully!');
            navigate('/vendor-dashboard/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    // Group cart items by farmer
    const groupedByFarmer = cart.reduce((groups, item) => {
        const farmerId = item.farmerId || item.product.farmer?._id || 'unknown';
        const farmerName = item.product.farmer?.fullName || item.product.farmer?.farmName || 'Unknown Farmer';
        if (!groups[farmerId]) {
            groups[farmerId] = { farmerName, items: [] };
        }
        groups[farmerId].items.push(item);
        return groups;
    }, {});

    if (cart.length === 0) {
        return (
            <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
                <div className="flex flex-col items-center justify-center py-24 bg-white/60 backdrop-blur-xl rounded-[40px] border border-white shadow-xl">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
                        <span className="material-symbols-outlined text-5xl text-indigo-300">shopping_cart</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Your Cart is Empty</h3>
                    <p className="text-sm font-medium text-slate-400 mb-8">Browse the market to add fresh produce</p>
                    <Button onClick={() => navigate('/vendor-dashboard/market')}
                        icon={<span className="material-symbols-outlined text-lg">storefront</span>}
                        className="rounded-2xl px-8">
                        Browse Market
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in your cart</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => navigate('/vendor-dashboard/market')} variant="outline" size="sm"
                        icon={<span className="material-symbols-outlined text-sm">add</span>}
                        className="rounded-2xl text-xs uppercase tracking-widest">
                        Add More
                    </Button>
                    <Button onClick={() => { clearCart(); toast.success('Cart cleared'); }} variant="danger" size="sm"
                        icon={<span className="material-symbols-outlined text-sm">delete_sweep</span>}
                        className="rounded-2xl text-xs uppercase tracking-widest">
                        Clear All
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items — Left (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {Object.entries(groupedByFarmer).map(([farmerId, group]) => (
                        <div key={farmerId} className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                            {/* Farmer Header */}
                            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-indigo-600 text-lg">agriculture</span>
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm">{group.farmerName}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.items.length} item{group.items.length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-slate-50">
                                {group.items.map((item) => {
                                    const price = item.product.pricePerUnit || item.product.price || 0;
                                    const lineTotal = price * item.quantity;

                                    return (
                                        <div key={item.product._id} className="p-4 sm:p-5 flex flex-wrap sm:flex-nowrap items-center gap-y-4 gap-x-4 hover:bg-slate-50/50 transition-colors relative">
                                            {/* Product Image */}
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                                                {item.product.images?.[0]?.url ? (
                                                    <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <span className="material-symbols-outlined text-2xl">inventory_2</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                                                <h4 className="font-black text-slate-800 text-sm truncate">{item.product.name}</h4>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                                                    ₹{price}/{item.product.unit} • {item.product.variety || 'Standard'}
                                                </p>
                                            </div>

                                            {/* Controls Container */}
                                            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-20 sm:pl-0">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1 shrink-0 bg-slate-50/50 rounded-xl p-0.5 border border-slate-100/50">
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-[10px] bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">remove</span>
                                                    </button>
                                                    <span className="w-8 text-center font-black text-sm text-slate-800">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-[10px] bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add</span>
                                                    </button>
                                                </div>

                                                {/* Line Total */}
                                                <div className="text-right shrink-0 sm:w-20">
                                                    <p className="font-black text-indigo-600 text-sm">₹{lineTotal.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => { removeFromCart(item.product._id); toast.success('Removed'); }}
                                                className="absolute top-4 right-4 sm:static sm:top-auto sm:right-auto w-8 h-8 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center shrink-0"
                                            >
                                                <span className="material-symbols-outlined text-lg">close</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary — Right (1/3 width) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 space-y-6 sticky top-28">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Order Summary</h3>

                        {/* Items Summary */}
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.product._id} className="flex justify-between text-xs">
                                    <span className="text-slate-500 font-medium truncate pr-2">{item.product.name} × {item.quantity}</span>
                                    <span className="font-bold text-slate-700 shrink-0">₹{((item.product.pricePerUnit || item.product.price || 0) * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 pt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Subtotal</span>
                                <span className="font-black text-slate-800">₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Delivery</span>
                                <span className="font-bold text-emerald-600">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <div className="flex justify-between">
                                <span className="text-base font-black text-slate-800">Total</span>
                                <span className="text-xl font-black text-indigo-600">₹{cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Delivery Type */}
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Method</p>
                            <div className="grid grid-cols-2 gap-2">
                                {['pickup', 'delivery'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setDeliveryType(type)}
                                        className={`py-3 px-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-1.5 ${deliveryType === type
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {type === 'pickup' ? 'store' : 'local_shipping'}
                                        </span>
                                        {type === 'pickup' ? 'Pickup' : 'Delivery'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Notes</p>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Need by 8 AM, extra fresh only..."
                                className="w-full bg-slate-50 rounded-2xl p-3 text-sm text-slate-700 font-medium border border-slate-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none resize-none h-20 placeholder:text-slate-300"
                            />
                        </div>

                        {/* Place Order Button */}
                        <Button
                            onClick={handlePlaceOrder}
                            disabled={placing || cart.length === 0}
                            isLoading={placing}
                            fullWidth
                            size="lg"
                            icon={!placing && <span className="material-symbols-outlined text-lg">shopping_bag</span>}
                            className="rounded-2xl uppercase tracking-widest">
                            {placing ? 'Placing Order...' : `Place Order • ₹${cartTotal.toLocaleString()}`}
                        </Button>

                        {/* Info */}
                        <p className="text-[10px] text-slate-400 font-medium text-center leading-relaxed">
                            Orders with multiple farmers will be split into separate orders automatically. You'll receive tracking for each.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorCart;
