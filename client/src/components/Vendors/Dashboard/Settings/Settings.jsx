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
        // Fetch detailed vendor profile on mount
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

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-full">

            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Settings & Profile</h1>
                    <p className="mt-2 text-sm md:text-base font-medium text-slate-500">Manage your business profile, documents, and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-2"
                >
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <span className="material-symbols-outlined text-[20px]">save</span>}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Sidebar Tabs */}
                <div className="lg:w-64 shrink-0">
                    <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar sticky top-24">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                        ? 'bg-slate-800 text-white shadow-md'
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 shadow-sm'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">

                    {/* Personal Info Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center material-symbols-outlined text-sm">person</span>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                                    <input type="text" name="mobile" value={formData.mobile} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-medium cursor-not-allowed outline-none" />
                                    <p className="text-[10px] text-slate-400 mt-1">Mobile number cannot be changed</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shop Details Tab */}
                    {activeTab === 'shop' && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center material-symbols-outlined text-sm">storefront</span>
                                Business Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shop Name</label>
                                    <input type="text" name="shopName" value={formData.shopName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Business Type</label>
                                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none appearance-none">
                                        <option value="retailer">Retailer</option>
                                        <option value="wholesaler">Wholesaler</option>
                                        <option value="restaurant">Restaurant</option>
                                        <option value="hotel">Hotel</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shop Format</label>
                                    <select name="shopType" value={formData.shopType} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none appearance-none">
                                        <option value="kirana">Kirana Shop</option>
                                        <option value="supermarket">Supermarket</option>
                                        <option value="mandi">Mandi Trader</option>
                                        <option value="cart_vendor">Cart Vendor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Daily Buying Capacity (kg)</label>
                                    <input type="number" name="dailyCapacity" value={formData.dailyCapacity} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">FSSAI License No.</label>
                                    <input type="text" name="fssaiNumber" value={formData.fssaiNumber} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" placeholder="Optional" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholders for other tabs */}
                    {(activeTab === 'bank' || activeTab === 'security') && (
                        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center animate-in fade-in">
                            <span className={`material-symbols-outlined text-6xl mb-4 ${activeTab === 'bank' ? 'text-blue-200' : 'text-purple-200'}`}>
                                {activeTab === 'bank' ? 'account_balance' : 'encrypted'}
                            </span>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{activeTab === 'bank' ? 'Bank Details' : 'Security Settings'}</h3>
                            <p className="text-slate-500 max-w-sm">This section is currently under development. You will be able to manage this soon.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Settings;
