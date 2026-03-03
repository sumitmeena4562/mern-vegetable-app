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

    const [images, setImages] = useState(product.images || []);
    const [newImages, setNewImages] = useState([]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + newImages.length + files.length > 5) {
            toast.error("You can upload a maximum of 5 images");
            return;
        }
        setNewImages(prev => [...prev, ...files]);
    };

    const removeExistingImage = (publicId) => {
        setImages(images.filter(img => img.publicId !== publicId));
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.quantity || !form.pricePerUnit) {
            toast.error('Name, Quantity, and Price are required');
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            const productData = {
                ...form,
                quantity: Number(form.quantity),
                pricePerUnit: Number(form.pricePerUnit),
                minimumOrder: Number(form.minimumOrder),
                images: images
            };

            formData.append('productData', JSON.stringify(productData));

            newImages.forEach(file => {
                formData.append('images', file);
            });

            const res = await updateProduct(product._id, formData);
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
                    {/* Image Upload Area */}
                    <div>
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Product Images ({images.length + newImages.length}/5)</label>
                        <div className="grid grid-cols-5 gap-3">
                            {/* Existing Images */}
                            {images.map((img) => (
                                <div key={img.publicId} className="aspect-square relative rounded-xl overflow-hidden group border border-slate-200">
                                    <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img.publicId)}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                    </button>
                                </div>
                            ))}
                            {/* New Previews */}
                            {newImages.map((file, idx) => (
                                <div key={idx} className="aspect-square relative rounded-xl overflow-hidden group border border-green-200">
                                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(idx)}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                    </button>
                                </div>
                            ))}
                            {/* Upload Button */}
                            {(images.length + newImages.length) < 5 && (
                                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-green-400 hover:bg-green-50/50 flex flex-col items-center justify-center cursor-pointer transition-all text-slate-400 hover:text-green-500">
                                    <span className="material-symbols-outlined text-2xl mb-1">add_photo_alternate</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Add</span>
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>

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
