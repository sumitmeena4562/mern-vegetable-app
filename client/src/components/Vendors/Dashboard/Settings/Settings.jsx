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
        bankDetails: {
            accountHolderName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: ''
        }
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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
                    bankDetails: p.bankDetails || {
                        accountHolderName: '',
                        accountNumber: '',
                        ifscCode: '',
                        bankName: '',
                        branch: ''
                    }
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
        if (name.startsWith('bank_')) {
            const field = name.split('_')[1];
            setFormData(prev => ({
                ...prev,
                bankDetails: { ...prev.bankDetails, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSecurityChange = (e) => {
        setSecurityData({ ...securityData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (activeTab === 'profile' || activeTab === 'shop' || activeTab === 'bank') {
                const response = await api.put('/vendors/profile', formData);
                if (response.data.success) {
                    toast.success('Profile updated successfully!');
                }
            } else if (activeTab === 'security') {
                if (securityData.newPassword !== securityData.confirmPassword) {
                    toast.error('New passwords do not match');
                    setSaving(false);
                    return;
                }
                const response = await api.put('/auth/change-password', securityData);
                if (response.data.success) {
                    toast.success('Password changed successfully');
                    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update settings');
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
                                value={formData.fullName || ''}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mobile (Read Only)</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile || ''}
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
            )}

            {/* Bank Details Tab */}
            {activeTab === 'bank' && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <span className="material-symbols-outlined text-3xl">account_balance</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Bank Details</h3>
                            <p className="text-xs text-slate-400 font-medium">Manage your payout account information securely</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Account Holder Name</label>
                            <input
                                type="text"
                                name="bank_accountHolderName"
                                value={formData.bankDetails?.accountHolderName || ''}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Account Number</label>
                            <input
                                type="text"
                                name="bank_accountNumber"
                                value={formData.bankDetails?.accountNumber || ''}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">IFSC Code</label>
                            <input
                                type="text"
                                name="bank_ifscCode"
                                value={formData.bankDetails?.ifscCode || ''}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bank Name</label>
                            <input
                                type="text"
                                name="bank_bankName"
                                value={formData.bankDetails?.bankName || ''}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Branch Name</label>
                            <input
                                type="text"
                                name="bank_branch"
                                value={formData.bankDetails?.branch || ''}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                            <span className="material-symbols-outlined text-3xl">security</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Security Settings</h3>
                            <p className="text-xs text-slate-400 font-medium">Update your password to keep your account secure</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={securityData.currentPassword || ''}
                                onChange={handleSecurityChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={securityData.newPassword || ''}
                                onChange={handleSecurityChange}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={securityData.confirmPassword || ''}
                                onChange={handleSecurityChange}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Save Button */}
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


        </div>
    );
};

export default Settings;
