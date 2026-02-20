import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { updateProduct } from '@/api/userApi';
import { toast } from 'react-hot-toast';

const ProductEditModal = ({ product, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: product.name || '',
        category: product.category || 'vegetable',
        variety: product.variety || '',
        quantity: product.quantity || '',
        unit: product.unit || 'kg',
        pricePerUnit: product.pricePerUnit || '',
        qualityGrade: product.qualityGrade || 'A',
        minimumOrder: product.minimumOrder || 1,
        description: product.description || '',
        packaging: product.packaging || '',
        shelfLife: product.shelfLife || '',
        isOrganic: product.tags?.includes('organic') || false,
    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.quantity || !form.pricePerUnit) {
            toast.error('Name, Quantity, and Price are required');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...form,
                quantity: Number(form.quantity),
                pricePerUnit: Number(form.pricePerUnit),
                minimumOrder: Number(form.minimumOrder),
            };
            const res = await updateProduct(product._id, payload);
            if (res.success) {
                toast.success('Product updated successfully!');
                onSuccess?.();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-[32px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-xl px-6 pt-6 pb-4 border-b border-slate-100 rounded-t-[32px] z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Edit Product</h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Update your product details</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-slate-500">close</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Product Name */}
                    <div>
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Product Name *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
                            placeholder="e.g., Fresh Tomato"
                        />
                    </div>

                    {/* Category + Grade Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={e => handleChange('category', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                            >
                                <option value="vegetable">Vegetable</option>
                                <option value="fruit">Fruit</option>
                                <option value="grain">Grain</option>
                                <option value="pulse">Pulse</option>
                                <option value="spice">Spice</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Grade</label>
                            <select
                                value={form.qualityGrade}
                                onChange={e => handleChange('qualityGrade', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                            >
                                <option value="A+">A+ (Premium)</option>
                                <option value="A">A (Standard)</option>
                                <option value="B">B (Economy)</option>
                            </select>
                        </div>
                    </div>

                    {/* Quantity + Unit + Price Row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Quantity *</label>
                            <input
                                type="number"
                                value={form.quantity}
                                onChange={e => handleChange('quantity', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Unit</label>
                            <select
                                value={form.unit}
                                onChange={e => handleChange('unit', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                            >
                                <option value="kg">Kg</option>
                                <option value="quintal">Quintal</option>
                                <option value="dozen">Dozen</option>
                                <option value="piece">Piece</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Price (₹) *</label>
                            <input
                                type="number"
                                value={form.pricePerUnit}
                                onChange={e => handleChange('pricePerUnit', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Min Order */}
                    <div>
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Minimum Order ({form.unit})</label>
                        <input
                            type="number"
                            value={form.minimumOrder}
                            onChange={e => handleChange('minimumOrder', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                            min="1"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 resize-none"
                            placeholder="Describe your product..."
                        />
                    </div>

                    {/* Organic Toggle */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🌿</span>
                            <div>
                                <p className="text-sm font-bold text-green-800">Organic Product</p>
                                <p className="text-[11px] text-green-600">Mark as organically grown</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleChange('isOrganic', !form.isOrganic)}
                            className={`w-12 h-7 rounded-full transition-all ${form.isOrganic ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform mx-1 ${form.isOrganic ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-slate-300"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">save</span>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ProductEditModal;
