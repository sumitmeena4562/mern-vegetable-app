import React, { useState } from 'react';
import axios from 'axios';

const AddProductModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: 'tomato', // Default to first valid enum
        variety: '',
        quantity: '',
        pricePerUnit: '',
        unit: 'kg',
        description: '',
        category: 'vegetable',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mongoose Enum Values
    const validCrops = ['tomato', 'potato', 'onion', 'carrot', 'spinach', 'cauliflower', 'brinjal', 'chili', 'cabbage', 'okra', 'cucumber', 'other'];
    const categories = ['vegetable', 'fruit', 'herb', 'other'];
    const units = ['kg', 'quintal', 'dozen', 'piece', 'bunch'];

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle Image Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create FormData for file upload
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'image') {
                    data.append(key, formData[key]);
                }
            });

            // Handle Dates
            const now = new Date();
            data.append('harvestDate', now.toISOString());

            // Calculate Expiry (Default +7 days)
            const expiry = new Date(now);
            expiry.setDate(expiry.getDate() + 7);
            data.append('expiryDate', expiry.toISOString());

            // Backend expects 'images' (array)
            if (formData.image) {
                data.append('images', formData.image);
            }

            // API call to backend
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL.replace('/auth', '')}/products`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                alert("Product added successfully! 🌱");
                onClose();

                // Trigger refresh if provided
                if (window.location.reload) window.location.reload();

                // Reset form
                setFormData({
                    name: 'tomato',
                    variety: '',
                    quantity: '',
                    pricePerUnit: '',
                    unit: 'kg',
                    description: '',
                    category: 'vegetable',
                    image: null
                });
                setImagePreview(null);
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert(error.response?.data?.message || "Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-600">add_circle</span>
                        Add New Produce
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Image Upload Area */}
                        <div className="relative group w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-green-50/30 hover:border-green-400 transition-all cursor-pointer overflow-hidden">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-600">Upload Crop Photo</p>
                                    <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG (Max 5MB)</p>
                                </div>
                            )}
                        </div>

                        {/* Product Name & Variety */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Crop Name</label>
                                <div className="relative">
                                    <select
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-gray-800 appearance-none cursor-pointer capitalize"
                                    >
                                        {validCrops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                                    </select>
                                    <span className="absolute right-3 top-3 text-gray-400 pointer-events-none material-symbols-outlined text-sm">expand_more</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Variety (Optional)</label>
                                <input
                                    type="text"
                                    name="variety"
                                    placeholder="e.g. Desi, Hybrid"
                                    value={formData.variety}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Quantity & Unit */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    required
                                    placeholder="e.g. 100"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Unit</label>
                                <div className="relative">
                                    <select
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-gray-800 appearance-none cursor-pointer"
                                    >
                                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                    <span className="absolute right-3 top-3 text-gray-400 pointer-events-none material-symbols-outlined text-sm">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Price (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-2.5 text-gray-500 font-bold">₹</span>
                                <input
                                    type="number"
                                    name="pricePerUnit"
                                    required
                                    placeholder="e.g. 25"
                                    value={formData.pricePerUnit}
                                    onChange={handleChange}
                                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-gray-800"
                                />
                                <span className="absolute right-4 top-2.5 text-xs font-bold text-gray-400">per {formData.unit}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Description (Optional)</label>
                            <textarea
                                name="description"
                                rows="3"
                                placeholder="Details about quality, harvest date, location etc."
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-gray-800 resize-none"
                            ></textarea>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">check</span>
                                        Add Product
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
