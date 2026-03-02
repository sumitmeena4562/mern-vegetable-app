import React from 'react';

const ShopDetailsForm = ({ formData, handleInputChange, themeColor = 'blue' }) => {
    const themes = {
        indigo: { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', focusRing: 'focus:border-indigo-500' },
        blue: { iconBg: 'bg-blue-50', iconColor: 'text-blue-600', focusRing: 'focus:border-blue-500' }
    };
    const theme = themes[themeColor] || themes.blue;

    const inputClass = `w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 ${theme.focusRing} focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all`;
    const selectClass = `w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 ${theme.focusRing} focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all appearance-none`;

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 ${theme.iconBg} rounded-2xl flex items-center justify-center ${theme.iconColor}`}>
                    <span className="material-symbols-outlined text-3xl">storefront</span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Business Details</h3>
                    <p className="text-xs text-slate-400 font-medium">Manage your shop visibility and operations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Shop Name</label>
                    <input
                        type="text"
                        name="shopName"
                        value={formData.shopName || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Business Type</label>
                    <select
                        name="businessType"
                        value={formData.businessType || 'retailer'}
                        onChange={handleInputChange}
                        className={selectClass}
                    >
                        <option value="retailer">Retailer</option>
                        <option value="wholesaler">Wholesaler</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="hotel">Hotel</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Shop Format</label>
                    <select
                        name="shopType"
                        value={formData.shopType || 'kirana'}
                        onChange={handleInputChange}
                        className={selectClass}
                    >
                        <option value="kirana">Kirana Shop</option>
                        <option value="supermarket">Supermarket</option>
                        <option value="mandi">Mandi Trader</option>
                        <option value="cart_vendor">Cart Vendor</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Daily Cap (kg)</label>
                    <input
                        type="number"
                        name="dailyCapacity"
                        value={formData.dailyCapacity || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">FSSAI No.</label>
                    <input
                        type="text"
                        name="fssaiNumber"
                        value={formData.fssaiNumber || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Optional"
                    />
                </div>
            </div>
        </div>
    );
};

export default ShopDetailsForm;
