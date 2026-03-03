import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
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

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Edit Product"
            subtitle="Update your product details"
        >
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
                    <Input
                        label="Product Name *"
                        value={form.name}
                        onChange={e => handleChange('name', e.target.value)}
                        placeholder="e.g., Fresh Tomato"
                    />
                </div>

                {/* Category + Grade Row */}
                <div className="grid grid-cols-2 gap-3">
                    <Select
                        label="Category"
                        value={form.category}
                        onChange={e => handleChange('category', e.target.value)}
                        options={[
                            { value: "vegetable", label: "Vegetable" },
                            { value: "fruit", label: "Fruit" },
                            { value: "grain", label: "Grain" },
                            { value: "pulse", label: "Pulse" },
                            { value: "spice", label: "Spice" }
                        ]}
                    />
                    <Select
                        label="Grade"
                        value={form.qualityGrade}
                        onChange={e => handleChange('qualityGrade', e.target.value)}
                        options={[
                            { value: "A+", label: "A+ (Premium)" },
                            { value: "A", label: "A (Standard)" },
                            { value: "B", label: "B (Economy)" }
                        ]}
                    />
                </div>

                {/* Quantity + Unit + Price Row */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Quantity *"
                        type="number"
                        value={form.quantity}
                        onChange={e => handleChange('quantity', e.target.value)}
                        min="0"
                        rightElement={
                            <select
                                value={form.unit}
                                onChange={e => handleChange('unit', e.target.value)}
                                className="bg-slate-100/50 border-l border-slate-200 h-full px-3 text-[10px] font-black uppercase text-slate-600 outline-none cursor-pointer rounded-r-xl"
                            >
                                <option value="kg">Kg</option>
                                <option value="quintal">Quintal</option>
                                <option value="dozen">Dozen</option>
                                <option value="piece">Piece</option>
                            </select>
                        }
                    />
                    <Input
                        label="Price (₹) *"
                        type="number"
                        value={form.pricePerUnit}
                        onChange={e => handleChange('pricePerUnit', e.target.value)}
                        min="0"
                        icon="currency_rupee"
                    />
                </div>

                {/* Min Order */}
                <div>
                    <Input
                        label={`Minimum Order (${form.unit})`}
                        type="number"
                        value={form.minimumOrder}
                        onChange={e => handleChange('minimumOrder', e.target.value)}
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
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                        icon="save"
                        className="flex-1"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductEditModal;
