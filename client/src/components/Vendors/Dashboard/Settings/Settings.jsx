import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import api from '../../../../api/axios';
import { toast } from 'react-hot-toast';

import PersonalInfoForm from '../../../common/settings/PersonalInfoForm';
import ShopDetailsForm from '../../../common/settings/ShopDetailsForm';
import BankDetailsForm from '../../../common/settings/BankDetailsForm';
import SecurityForm from '../../../common/settings/SecurityForm';
import Button from '../../../ui/Button';

const Settings = () => {
    const { user } = useAuth();
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

            {/* Tab Contents */}
            {activeTab === 'profile' && (
                <PersonalInfoForm
                    profileData={formData}
                    handleInputChange={handleInputChange}
                    themeColor="indigo"
                    showAddress={false}
                />
            )}

            {activeTab === 'shop' && (
                <ShopDetailsForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    themeColor="indigo"
                />
            )}

            {activeTab === 'bank' && (
                <BankDetailsForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    themeColor="indigo"
                />
            )}

            {activeTab === 'security' && (
                <SecurityForm
                    securityData={securityData}
                    handleSecurityChange={handleSecurityChange}
                    themeColor="indigo"
                />
            )}

            {/* Form actions down below are unchanged */}

            {/* Save Button */}
            <div className="flex justify-end mt-8">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    isLoading={saving}
                    icon={!saving && <span className="material-symbols-outlined text-lg">save</span>}
                    className="rounded-2xl px-8 py-4 text-[10px] uppercase tracking-widest"
                >
                    Save Changes
                </Button>
            </div>


        </div>
    );
};

export default Settings;
