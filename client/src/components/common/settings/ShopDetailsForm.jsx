import React from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

const ShopDetailsForm = ({ formData, handleInputChange, themeColor = 'blue' }) => {
    const themes = {
        indigo: { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
        blue: { iconBg: 'bg-blue-50', iconColor: 'text-blue-600' }
    };
    const theme = themes[themeColor] || themes.blue;

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
                <div className="md:col-span-2">
                    <Input
                        label="Shop Name"
                        name="shopName"
                        value={formData.shopName || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <Select
                        label="Business Type"
                        name="businessType"
                        value={formData.businessType || 'retailer'}
                        onChange={handleInputChange}
                        options={[
                            { value: 'retailer', label: 'Retailer' },
                            { value: 'wholesaler', label: 'Wholesaler' },
                            { value: 'restaurant', label: 'Restaurant' },
                            { value: 'hotel', label: 'Hotel' }
                        ]}
                    />
                </div>
                <div>
                    <Select
                        label="Shop Format"
                        name="shopType"
                        value={formData.shopType || 'kirana'}
                        onChange={handleInputChange}
                        options={[
                            { value: 'kirana', label: 'Kirana Shop' },
                            { value: 'supermarket', label: 'Supermarket' },
                            { value: 'mandi', label: 'Mandi Trader' },
                            { value: 'cart_vendor', label: 'Cart Vendor' }
                        ]}
                    />
                </div>
                <div>
                    <Input
                        label="Daily Cap (kg)"
                        type="number"
                        name="dailyCapacity"
                        value={formData.dailyCapacity || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <Input
                        label="FSSAI No."
                        name="fssaiNumber"
                        placeholder="Optional"
                        value={formData.fssaiNumber || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ShopDetailsForm;
