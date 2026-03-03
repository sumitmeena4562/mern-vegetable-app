import React, { useState, useEffect } from 'react';
import { getFarmerProfile, updateFarmerProfile } from '@/api/userApi';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

import PersonalInfoForm from '../../common/settings/PersonalInfoForm';
import FarmDetailsForm from '../../common/settings/FarmDetailsForm';
import NotificationsForm from '../../common/settings/NotificationsForm';
import SecurityForm from '../../common/settings/SecurityForm';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        mobile: '',
        address: { village: '', city: '', district: '', state: '', pincode: '' },
    });

    const [farm, setFarm] = useState({
        farmName: '',
        farmSize: '',
        farmSizeUnit: 'acre',
        farmingType: 'organic',
        soilType: 'other',
        irrigationSystem: 'manual',
        waterSource: 'well',
        hasColdStorage: false,
        landOwnership: 'owned',
        primaryCrop: '',
        farmingExperience: '',
        preferredPickupTime: 'morning',
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: true,
        push: true,
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSecurityChange = (e) => {
        setSecurityData({ ...securityData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const res = await getFarmerProfile();
            if (res.success) {
                const user = res.data?.user || res.data;
                const farmerData = res.data?.farmer || res.data;
                setProfile({
                    fullName: user.fullName || '',
                    email: user.email || '',
                    mobile: user.mobile || '',
                    address: user.address || { village: '', city: '', district: '', state: '', pincode: '' },
                });
                setFarm({
                    farmName: farmerData.farmName || '',
                    farmSize: farmerData.farmSize || '',
                    farmSizeUnit: farmerData.farmSizeUnit || 'acre',
                    farmingType: farmerData.farmingType || 'organic',
                    soilType: farmerData.soilType || 'other',
                    irrigationSystem: farmerData.irrigationSystem || 'manual',
                    waterSource: farmerData.waterSource || 'well',
                    hasColdStorage: farmerData.hasColdStorage || false,
                    landOwnership: farmerData.landOwnership || 'owned',
                    primaryCrop: farmerData.primaryCrop || '',
                    farmingExperience: farmerData.farmingExperience || '',
                    preferredPickupTime: farmerData.preferredPickupTime || 'morning',
                });
                setNotifications(user.settings?.notifications || { email: true, sms: true, push: true });
            }
        } catch (error) {
            console.error('Profile load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            if (activeTab === 'security') {
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
            } else {
                const payload = {
                    fullName: profile.fullName,
                    email: profile.email,
                    address: profile.address,
                    ...farm,
                };
                const res = await updateFarmerProfile(payload);
                if (res.success) {
                    toast.success('Profile updated successfully!');
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update changes');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: 'person' },
        { id: 'farm', label: 'Farm Details', icon: 'agriculture' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' },
        { id: 'security', label: 'Security', icon: 'security' },
    ];


    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6">
                <Skeleton variant="rectangular" className="h-10 rounded-2xl w-64" />
                <Skeleton variant="rectangular" className="h-96 rounded-[32px] w-full" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Manage your profile, farm details, and preferences</p>
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
                    profileData={profile}
                    handleInputChange={(e) => {
                        const { name, value } = e.target;
                        if (name.startsWith('address_')) {
                            const field = name.split('_')[1];
                            setProfile(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
                        } else {
                            setProfile(prev => ({ ...prev, [name]: value }));
                        }
                    }}
                    themeColor="green"
                    showAddress={true}
                />
            )}

            {activeTab === 'farm' && (
                <FarmDetailsForm
                    farm={farm}
                    handleFarmChange={(e) => setFarm({ ...farm, [e.target.name]: e.target.value })}
                    toggleColdStorage={() => setFarm({ ...farm, hasColdStorage: !farm.hasColdStorage })}
                />
            )}

            {activeTab === 'notifications' && (
                <NotificationsForm
                    notifications={notifications}
                    toggleNotification={(key) => setNotifications({ ...notifications, [key]: !notifications[key] })}
                    themeColor="green"
                />
            )}

            {activeTab === 'security' && (
                <SecurityForm
                    securityData={securityData}
                    handleSecurityChange={handleSecurityChange}
                    themeColor="green"
                />
            )}

            {/* Form actions down below are unchanged */}

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    isLoading={saving}
                    icon="save"
                    className="px-8 shadow-xl shadow-green-200"
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default Settings;
