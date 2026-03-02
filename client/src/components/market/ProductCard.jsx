import React, { memo } from 'react';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
    const farmerName = product.farmer?.fullName || product.farmer?.farmName || product.farmer || 'Unknown Farmer';

    const getRating = (r) => {
        if (!r) return 4.5;
        if (typeof r === 'object') return r.average || 4.5;
        return r;
    };
    const rating = getRating(product.farmer?.averageRating || product.rating);

    return (
        <div className="bg-white group rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-200/30 transition-all overflow-hidden flex flex-col cursor-pointer">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
                {product.images?.[0]?.url ? (
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl">inventory_2</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-lg flex items-center gap-1.5 border border-white/50">
                        <span className="material-symbols-outlined text-[14px] text-amber-500 animate-pulse">star</span>
                        {rating}
                    </div>
                </div>
                <div className="absolute top-4 right-4">
                    <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg border border-white/10 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] text-blue-400">location_on</span>
                        {product.distance}
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-auto">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0 pr-2">
                            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight line-clamp-2">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.variety || 'Standard'}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-100 flex items-center shadow-sm">
                                <span className="text-indigo-700 font-black text-lg tracking-tighter">₹{product.pricePerUnit}</span>
                                <span className="text-[10px] text-indigo-600/60 font-black ml-0.5 uppercase tracking-tighter">/{product.unit}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm font-bold text-slate-500 flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <span className="material-symbols-outlined text-[10px]">agriculture</span>
                        </div>
                        <span className="truncate hover:text-indigo-600 transition-colors decoration-2 underline-offset-4">{farmerName}</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100/50">
                            <div className="flex items-center gap-1.5 mb-1 opacity-60">
                                <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Available</p>
                            </div>
                            <p className="text-xs font-black text-slate-700">{product.availableQuantity} <span className="text-[9px] text-slate-400 font-bold uppercase">{product.unit}</span></p>
                        </div>
                        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100/50">
                            <div className="flex items-center gap-1.5 mb-1 opacity-60">
                                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Min Order</p>
                            </div>
                            <p className="text-xs font-black text-slate-700">{product.minOrder} <span className="text-[9px] text-slate-400 font-bold uppercase">{product.unit}</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button onClick={(e) => { e.stopPropagation(); onViewDetails?.(); }} className="flex-1 py-3.5 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1.5">arrow_forward</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(); }} className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white border border-indigo-100 transition-all flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-lg">shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);
