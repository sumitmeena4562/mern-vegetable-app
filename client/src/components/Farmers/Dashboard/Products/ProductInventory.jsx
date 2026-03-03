import React, { useState, useEffect } from 'react';
import { getFarmerProducts, updateProductStatus, deleteProduct } from '@/api/userApi';
import ProductPlaceholder from '@/components/common/ProductPlaceholder';
import DeleteConfirmModal from './DeleteConfirmModal';
import ProductEditModal from './ProductEditModal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';

const ProductInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const ITEMS_PER_PAGE = 8;

    // Debounce search so we don't spam the API
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, currentPage, debouncedSearch]);

    // Reset page to 1 when filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, debouncedSearch]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await getFarmerProducts(filter, currentPage, ITEMS_PER_PAGE, debouncedSearch);
            if (res.success) {
                setProducts(res.data);
                if (res.pagination) {
                    setTotalPages(res.pagination.pages);
                    setTotalProducts(res.pagination.total);
                } else {
                    setTotalPages(1);
                    setTotalProducts(res.count || res.data.length);
                }
            }
        } catch (error) {
            console.error("Inventory loading error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (productId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'available' ? 'sold' : 'available';
            const res = await updateProductStatus(productId, newStatus);
            if (res.success) {
                setProducts(products.map(p => p._id === productId ? { ...p, status: newStatus } : p));
            }
        } catch (error) {
            console.error("Status toggle error:", error);
        }
    };

    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            const res = await deleteProduct(deleteModal.id);
            if (res.success) {
                // If it's the last item on the page, go to prev page
                if (products.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    fetchProducts(); // refresh list
                }
                setDeleteModal({ show: false, id: null, name: '' });
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Product Inventory</h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Manage your listed vegetables and stock status</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <Input
                        icon="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        wrapperClassName="w-full sm:w-56"
                        className="py-2.5 rounded-2xl border-slate-100 focus:ring-green-500/20"
                        rightElement={searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="text-slate-300 hover:text-slate-500 flex items-center justify-center p-1">
                                <span className="material-symbols-outlined text-lg leading-none">close</span>
                            </button>
                        )}
                    />
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        wrapperClassName="w-full sm:w-40"
                        className="py-2.5 rounded-2xl border-slate-100 focus:ring-green-500/20 text-xs font-black uppercase tracking-widest text-slate-700"
                        options={[
                            { value: 'all', label: 'All Status' },
                            { value: 'available', label: 'In Stock' },
                            { value: 'sold', label: 'Out of Stock' },
                            { value: 'expired', label: 'Expired' }
                        ]}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} variant="rectangular" className="h-64 rounded-[32px] w-full" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white/40 backdrop-blur-xl border border-white rounded-[40px]">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 opacity-30">
                        <span className="material-symbols-outlined text-5xl">{searchQuery ? 'search_off' : 'inventory_2'}</span>
                    </div>
                    <h3 className="text-xl font-black  text-slate-800 tracking-tight">{searchQuery ? 'No matching products' : 'Inventory Empty'}</h3>
                    <p className="text-sm font-medium mt-1">{searchQuery ? 'Try a different search.' : "You haven't listed any products yet."}</p>
                </div>
            ) : (
                <>
                    <p className="text-xs font-bold text-slate-400">Showing {products.length} of {totalProducts} products</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white group rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-green-200/30 transition-all overflow-hidden flex flex-col"
                            >
                                {/* Product Image */}
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
                                    ) : null}
                                    <div className={`${product.images?.[0]?.url ? 'hidden' : 'flex'} w-full h-full`}>
                                        <ProductPlaceholder />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg ${product.status === 'available'
                                            ? 'bg-green-500/80 text-white'
                                            : 'bg-slate-900/80 text-white'
                                            }`}>
                                            {product.status === 'available' ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setDeleteModal({ show: true, id: product._id, name: product.name })}
                                        className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-lg border border-red-100"
                                    >
                                        <span className="material-symbols-outlined text-xl font-black">delete</span>
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-auto">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight line-clamp-2">{product.name}</h4>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.variety || 'Standard'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="bg-green-50 px-2.5 py-1.5 rounded-xl border border-green-100 flex items-center shadow-sm">
                                                    <span className="text-green-700 font-black text-lg tracking-tighter">₹{product.pricePerUnit}</span>
                                                    <span className="text-[10px] text-green-600/60 font-black ml-0.5 uppercase tracking-tighter">/{product.unit}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-2 mb-6">
                                            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100/50">
                                                <div className="flex items-center gap-1.5 mb-1 opacity-60">
                                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Harvested</p>
                                                </div>
                                                <p className="text-xs font-black text-slate-700">{new Date(product.harvestDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100/50">
                                                <div className="flex items-center gap-1.5 mb-1 opacity-60">
                                                    <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Quantity</p>
                                                </div>
                                                <p className="text-xs font-black text-slate-700">{product.availableQuantity} <span className="text-[9px] text-slate-400 font-bold uppercase">{product.unit}</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <button
                                            onClick={() => handleToggleStatus(product._id, product.status)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all relative overflow-hidden group shadow-lg ${product.status === 'available'
                                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 hover:shadow-orange-200/50'
                                                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200/50'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-base">{product.status === 'available' ? 'block' : 'check_circle'}</span>
                                            {product.status === 'available' ? 'Mark Out of Stock' : 'Mark In Stock'}
                                        </button>
                                        <button
                                            onClick={() => setEditingProduct(product)}
                                            className="w-14 h-14 bg-white text-slate-400 rounded-2xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center shadow-sm active:scale-95"
                                        >
                                            <span className="material-symbols-outlined text-xl">edit</span>
                                        </button>
                                    </div>
                                </div>
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

            {/* Elite Deletion Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, id: null, name: '' })}
                onConfirm={confirmDelete}
                productName={deleteModal.name}
                loading={isDeleting}
            />

            {editingProduct && (
                <ProductEditModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSuccess={fetchProducts}
                />
            )}
        </div>
    );
};

export default ProductInventory;
