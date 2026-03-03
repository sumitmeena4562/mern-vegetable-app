import React, { useState, useEffect, useRef } from 'react';
import api from '../../../../api/axios';
import { useCart } from '../../../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import ProductCard from '../../../market/ProductCard';
import ProductDetailModal from '../../../market/ProductDetailModal';
import Skeleton from '../../../../components/ui/Skeleton';
import Select from '../../../../components/ui/Select';

const Market = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [maxPrice, setMaxPrice] = useState(2000);
    const [isOrganic, setIsOrganic] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'rating'
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const debounceTimer = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
    let filteredProducts = products.filter(p => {
        const matchesSearch = !debouncedSearch.trim() || p.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.category?.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.variety?.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCategory = filter === 'all' || p.category === filter;
        const matchesPrice = (p.pricePerUnit || p.price || 0) <= maxPrice;
        const matchesOrganic = !isOrganic || p.isOrganic;
        return matchesSearch && matchesCategory && matchesPrice && matchesOrganic;
    });

    if (sortBy === 'price-low') {
        filteredProducts.sort((a, b) => (a.pricePerUnit || a.price || 0) - (b.pricePerUnit || b.price || 0));
    } else if (sortBy === 'price-high') {
        filteredProducts.sort((a, b) => (b.pricePerUnit || b.price || 0) - (a.pricePerUnit || a.price || 0));
    } else if (sortBy === 'rating') {
        const getR = (p) => typeof p.farmer?.averageRating === 'object' ? (p.farmer.averageRating.average || 0) : (p.farmer?.averageRating || p.rating || 0);
        filteredProducts.sort((a, b) => getR(b) - getR(a));
    } else {
        // newest
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, filter, maxPrice, isOrganic, sortBy]);

    return (
        <>
            <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Mandi Market</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">Browse fresh produce listed directly by farmers</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-1 md:flex-none items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                            <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                            <input
                                type="text"
                                value={searchQuery || ''}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search produce..."
                                className="bg-transparent outline-none text-sm font-medium text-slate-700 w-full md:w-48 placeholder:text-slate-300"
                            />
                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(''); handleSearchChange(''); }} className="text-slate-300 hover:text-slate-500 flex items-center">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border-2 ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200 shadow-sm shadow-slate-200'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">tune</span>
                            Filters {(filter !== 'all' || maxPrice < 2000 || isOrganic || sortBy !== 'newest') && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
                        </button>
                    </div>
                </div>

                {/* Extended Filters Panel */}
                {showFilters && (
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-wrap gap-6 animate-in slide-in-from-top-2">
                        {/* Category */}
                        <div className="flex-1 min-w-[150px]">
                            <Select
                                label="Category"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                options={[
                                    { value: 'all', label: 'All Categories' },
                                    { value: 'vegetables', label: 'Vegetables' },
                                    { value: 'fruits', label: 'Fruits' },
                                    { value: 'exotic', label: 'Exotic' }
                                ]}
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex-1 min-w-[150px]">
                            <Select
                                label="Sort By"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                options={[
                                    { value: 'newest', label: 'Newest First' },
                                    { value: 'price-low', label: 'Price: Low to High' },
                                    { value: 'price-high', label: 'Price: High to Low' },
                                    { value: 'rating', label: 'Highest Rated' }
                                ]}
                            />
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2 flex-1 min-w-[200px]">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Price: ₹{maxPrice}</label>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="2000"
                                step="10"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Organic Toggle */}
                        <div className="flex items-end flex-wrap gap-3">
                            <button
                                onClick={() => setIsOrganic(!isOrganic)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isOrganic ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">eco</span>
                                Organic Only
                            </button>
                            {(filter !== 'all' || maxPrice < 2000 || isOrganic || sortBy !== 'newest') && (
                                <button
                                    onClick={() => { setFilter('all'); setMaxPrice(2000); setIsOrganic(false); setSortBy('newest'); }}
                                    className="text-xs font-bold text-slate-400 hover:text-indigo-600 underline underline-offset-2 transition-colors px-2 py-2"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <Skeleton key={i} variant="rectangular" className="h-72 rounded-[32px] w-full" />
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
                                <ProductCard key={product._id} product={product} onAddToCart={() => { addToCart(product, product.minimumOrder || 1); toast.success(`${product.name} added to cart!`); }} onViewDetails={() => setSelectedProduct(product)} />
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

            {/* Product Detail Modal */}
            {
                selectedProduct && (
                    <ProductDetailModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )
            }
        </>
    );
};

export default Market;
