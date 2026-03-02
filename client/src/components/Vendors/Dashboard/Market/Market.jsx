import React, { useState, useEffect, useRef } from 'react';
import api from '../../../../api/axios';
import { useCart } from '../../../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import ProductCard from '../../../market/ProductCard';

const Market = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const debounceTimer = useRef(null);

    // 300ms debounce on search
    const handleSearchChange = (value) => {
        setSearchQuery(value);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300);
    };

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
        const matchesSearch = !debouncedSearch.trim() || p.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.category?.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.variety?.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCategory = filter === 'all' || p.category === filter;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, filter]);

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
                            onChange={(e) => handleSearchChange(e.target.value)}
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

export default Market;
