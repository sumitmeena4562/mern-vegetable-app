import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import api from '../../../../api/axios';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        shopName: '',
        shopType: '',
        businessType: '',
        dailyCapacity: '',
        fssaiNumber: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await api.get('/vendors/profile');
            if (response.data.success) {
                const p = response.data.data;
                setFormData(prev => ({
                    ...prev,
                    shopName: p.shopName || '',
                    shopType: p.shopType || '',
                    businessType: p.businessType || '',
                    dailyCapacity: p.dailyCapacity || '',
                    fssaiNumber: p.fssaiNumber || '',
                }));
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load profile details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.put('/vendors/profile', formData);
            if (response.data.success) {
                toast.success('Profile updated successfully!');
            }
        } catch (err) {
            toast.error('Failed to update profile');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Personal Info', icon: 'person' },
        { id: 'shop', label: 'Shop Details', icon: 'storefront' },
        { id: 'bank', label: 'Bank Account', icon: 'account_balance' },
        { id: 'security', label: 'Security', icon: 'security' },
    ];

    const selectClass = "w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all appearance-none";
    const inputClass = "w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all";

    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6 animate-pulse">
                <div className="h-10 bg-slate-100 rounded-2xl w-64"></div>
                <div className="h-96 bg-slate-100 rounded-[32px]"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Manage your business profile, documents, and system preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeTab === tab.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                            : 'bg-white text-slate-500 border-white hover:border-slate-100 hover:bg-slate-50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Personal Info Tab */}
            {activeTab === 'profile' && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <span className="material-symbols-outlined text-3xl">person</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Personal Information</h3>
                            <p className="text-xs text-slate-400 font-medium">Update your basic profile details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mobile (Read Only)</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                readOnly
                                className="w-full px-4 py-3.5 bg-slate-100 border-2 border-slate-100 rounded-2xl outline-none text-sm font-bold text-slate-500 cursor-not-allowed opacity-80"
                            />
                            <p className="text-[10px] text-slate-400 mt-2 px-1 font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">lock</span> Mobile number is verified and cannot be changed.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Shop Details Tab */}
            {activeTab === 'shop' && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
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
                                value={formData.shopName}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Business Type</label>
                            <select
                                name="businessType"
                                value={formData.businessType}
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
                                value={formData.shopType}
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
                                value={formData.dailyCapacity}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">FSSAI No.</label>
                            <input
                                type="text"
                                name="fssaiNumber"
                                value={formData.fssaiNumber}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Optional"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Placeholders for other tabs */}
            {(activeTab === 'bank' || activeTab === 'security') && (
                <div className="bg-white rounded-[32px] p-16 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner ${activeTab === 'bank' ? 'bg-blue-50 text-blue-300' : 'bg-indigo-50 text-indigo-300'}`}>
                        <span className="material-symbols-outlined text-5xl">
                            {activeTab === 'bank' ? 'account_balance' : 'encrypted'}
                        </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{activeTab === 'bank' ? 'Bank Details' : 'Security Settings'}</h3>
                    <p className="text-slate-500 max-w-sm font-medium">This section is currently under development. You will be able to manage these settings soon.</p>
                </div>
            )}

            {/* Save Button */}
            {(activeTab === 'profile' || activeTab === 'shop') && (
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">save</span>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            )}

        </div>
    );
};

export default Settings;
