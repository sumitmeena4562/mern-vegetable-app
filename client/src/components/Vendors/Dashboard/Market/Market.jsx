import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';
import { useCart } from '../../../../contexts/CartContext';
import { toast } from 'react-hot-toast';

const Market = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10; // Similar pagination

    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/vendors/products');
            if (res.data.success) {
                setProducts(res.data.data.products);
            }
        } catch (error) {
            console.error("Failed to fetch market products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    // Client-side search and filter
    const filteredProducts = products.filter(p => {
        const matchesSearch = !searchQuery.trim() || p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase()) || p.variety?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filter === 'all' || p.category === filter; // Placeholder filter logic
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, filter]);

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Mandi Market</h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Browse fresh produce listed directly by farmers</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                        <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                        <input
                            type="text"
                            value={searchQuery || ''}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search produce, farmers..."
                            className="bg-transparent outline-none text-sm font-medium text-slate-700 w-full md:w-48 placeholder:text-slate-300"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="text-slate-300 hover:text-slate-500">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        )}
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-indigo-500 transition-all shadow-sm shadow-slate-200"
                    >
                        <option value="all">All Categories</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="fruits">Fruits</option>
                        <option value="exotic">Exotic</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="h-72 bg-slate-100 rounded-[32px]"></div>
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white/40 backdrop-blur-xl border border-white rounded-[40px]">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 opacity-30">
                        <span className="material-symbols-outlined text-5xl">{searchQuery ? 'search_off' : 'production_quantity_limits'}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{searchQuery ? 'No matching produce' : 'Market Empty'}</h3>
                    <p className="text-sm font-medium mt-1">{searchQuery ? 'Try a different search term.' : "No farmers have listed produce yet."}</p>
                </div>
            ) : (
                <>
                    <p className="text-xs font-bold text-slate-400">Showing {paginatedProducts.length} of {filteredProducts.length} items</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedProducts.map((product) => (
                            <ProductCard key={product._id} product={product} onAddToCart={() => { addToCart(product, product.minimumOrder || 1); toast.success(`${product.name} added to cart!`); }} />
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
                                                ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-300'
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
    );
};

const ProductCard = ({ product, onAddToCart }) => {
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
                    <button className="flex-1 py-3.5 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
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

export default Market;
