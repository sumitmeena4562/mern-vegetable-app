import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';

const Market = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    // Dummy products until backend API is ready
    const dummyProducts = [
        { id: 1, name: 'Fresh Tomatoes', farmer: 'Rajesh Kumar', price: 40, unit: 'kg', minOrder: 50, stock: 500, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60', rating: 4.8, distance: '5 km' },
        { id: 2, name: 'Organic Potatoes', farmer: 'Suresh Singh', price: 25, unit: 'kg', minOrder: 100, stock: 1000, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60', rating: 4.5, distance: '12 km' },
        { id: 3, name: 'Red Onions', farmer: 'Anil Patil', price: 35, unit: 'kg', minOrder: 50, stock: 800, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60', rating: 4.9, distance: '3 km' },
        { id: 4, name: 'Green Chili', farmer: 'Vikram Das', price: 60, unit: 'kg', minOrder: 10, stock: 150, image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=500&auto=format&fit=crop&q=60', rating: 4.2, distance: '8 km' },
    ];

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setProducts(dummyProducts);
            setLoading(false);
        }, 1000);
    }, []);

    const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Exotic'];

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === 'All' || category === 'Vegetables') // Dummy logic for now
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-full flex flex-col">

            {/* Top Bar: Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
                <div className="relative w-full md:w-96 group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-blue-500 transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Search produce, farmers, or locations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                    />
                </div>

                {/* Categories Tab */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${category === cat ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 flex items-center gap-2 font-bold text-sm transition-colors shadow-sm ml-auto md:ml-2">
                        <span className="material-symbols-outlined text-lg">tune</span>
                        Filters
                    </button>
                </div>
            </div>

            {/* Product Grid Layout */}
            <div className="flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm text-center h-full">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">production_quantity_limits</span>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                        <p className="text-slate-500 max-w-sm">Try adjusting your search criteria or explore different categories.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

const ProductCard = ({ product }) => {
    return (
        <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1 border border-white/50">
                        <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                        {product.rating}
                    </div>
                </div>
                <div className="absolute top-3 right-3">
                    <div className="bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black text-white shadow-sm tracking-wide">
                        {product.distance} away
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-black text-slate-800 truncate pr-2">{product.name}</h3>
                </div>

                <p className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 mb-4">
                    <span className="material-symbols-outlined text-[16px]">agriculture</span>
                    <span className="truncate hover:text-blue-600 cursor-pointer transition-colors">{product.farmer}</span>
                </p>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-2 gap-3 mb-5 mt-auto bg-slate-50 rounded-2xl p-3 border border-slate-100/50">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Price</span>
                        <p className="text-slate-800 font-bold"><span className="text-lg">₹{product.price}</span><span className="text-xs text-slate-500">/{product.unit}</span></p>
                    </div>
                    <div className="flex flex-col pl-3 border-l border-slate-200/60">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Min. Order</span>
                        <p className="text-slate-800 font-bold">{product.minOrder} <span className="text-xs text-slate-500">{product.unit}</span></p>
                    </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-800">
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default Market;
