import React, { useState, useEffect } from 'react';
import { getFarmerProfile, updateFarmerProfile } from '@/api/userApi';
import { toast } from 'react-hot-toast';

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
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: 'person' },
        { id: 'farm', label: 'Farm Details', icon: 'agriculture' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    ];

    const selectClass = "w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-green-500 focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all appearance-none";
    const inputClass = "w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-green-500 focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all";

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

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <span className="material-symbols-outlined text-3xl">person</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Personal Information</h3>
                            <p className="text-xs text-slate-400 font-medium">Update your name, email, and address</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mobile (Read Only)</label>
                            <input
                                type="text"
                                value={profile.mobile}
                                readOnly
                                className="w-full px-4 py-3.5 bg-slate-100 border-2 border-slate-100 rounded-2xl outline-none text-sm font-bold text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="pt-4 border-t border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-4">Address</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {['village', 'city', 'district', 'state', 'pincode'].map((field) => (
                                <div key={field} className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 capitalize">{field}</label>
                                    <input
                                        type="text"
                                        value={profile.address?.[field] || ''}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            address: { ...profile.address, [field]: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 focus:border-green-500 focus:bg-white rounded-xl outline-none text-sm font-bold text-slate-900 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Farm Tab */}
            {activeTab === 'farm' && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <span className="material-symbols-outlined text-3xl">agriculture</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Farm Details</h3>
                            <p className="text-xs text-slate-400 font-medium">Update your farm information and infrastructure</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Farm Name */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Farm Name</label>
                            <input
                                type="text"
                                value={farm.farmName}
                                onChange={(e) => setFarm({ ...farm, farmName: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        {/* Farm Size + Unit */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Farm Size</label>
                                <input
                                    type="number"
                                    value={farm.farmSize}
                                    onChange={(e) => setFarm({ ...farm, farmSize: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Unit</label>
                                <select
                                    value={farm.farmSizeUnit}
                                    onChange={(e) => setFarm({ ...farm, farmSizeUnit: e.target.value })}
                                    className={selectClass}
                                >
                                    <option value="acre">Acres</option>
                                    <option value="hectare">Hectares</option>
                                    <option value="bigha">Bigha</option>
                                </select>
                            </div>
                        </div>

                        {/* Farming Type */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Farming Type</label>
                            <select
                                value={farm.farmingType}
                                onChange={(e) => setFarm({ ...farm, farmingType: e.target.value })}
                                className={selectClass}
                            >
                                <option value="organic">Organic</option>
                                <option value="natural">Natural</option>
                                <option value="regular">Regular</option>
                                <option value="hydroponic">Hydroponic</option>
                            </select>
                        </div>

                        {/* Soil Type */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Soil Type</label>
                            <select
                                value={farm.soilType}
                                onChange={(e) => setFarm({ ...farm, soilType: e.target.value })}
                                className={selectClass}
                            >
                                <option value="black">Black Soil</option>
                                <option value="red">Red Soil</option>
                                <option value="alluvial">Alluvial Soil</option>
                                <option value="sandy">Sandy Soil</option>
                                <option value="clay">Clay Soil</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Irrigation System */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Irrigation System</label>
                            <select
                                value={farm.irrigationSystem}
                                onChange={(e) => setFarm({ ...farm, irrigationSystem: e.target.value })}
                                className={selectClass}
                            >
                                <option value="drip">Drip Irrigation</option>
                                <option value="sprinkler">Sprinkler</option>
                                <option value="tubewell">Tubewell</option>
                                <option value="canal">Canal</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>

                        {/* Water Source */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Water Source</label>
                            <select
                                value={farm.waterSource}
                                onChange={(e) => setFarm({ ...farm, waterSource: e.target.value })}
                                className={selectClass}
                            >
                                <option value="borewell">Borewell</option>
                                <option value="river">River</option>
                                <option value="canal">Canal</option>
                                <option value="rainwater">Rainwater</option>
                                <option value="well">Well</option>
                            </select>
                        </div>

                        {/* Land Ownership */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Land Ownership</label>
                            <select
                                value={farm.landOwnership}
                                onChange={(e) => setFarm({ ...farm, landOwnership: e.target.value })}
                                className={selectClass}
                            >
                                <option value="owned">Owned</option>
                                <option value="leased">Leased</option>
                            </select>
                        </div>

                        {/* Primary Crop */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Crop</label>
                            <input
                                type="text"
                                value={farm.primaryCrop}
                                onChange={(e) => setFarm({ ...farm, primaryCrop: e.target.value })}
                                placeholder="e.g., Tomato Specialist"
                                className={inputClass + " placeholder:text-slate-300"}
                            />
                        </div>

                        {/* Experience */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Experience (Years)</label>
                            <input
                                type="number"
                                value={farm.farmingExperience}
                                onChange={(e) => setFarm({ ...farm, farmingExperience: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        {/* Preferred Pickup Time */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Pickup Time</label>
                            <select
                                value={farm.preferredPickupTime}
                                onChange={(e) => setFarm({ ...farm, preferredPickupTime: e.target.value })}
                                className={selectClass}
                            >
                                <option value="morning">Morning (6 AM - 10 AM)</option>
                                <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                                <option value="evening">Evening (4 PM - 7 PM)</option>
                                <option value="any">Any Time</option>
                            </select>
                        </div>
                    </div>

                    {/* Cold Storage Toggle */}
                    <div className="pt-4 border-t border-slate-50">
                        <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                                    <span className="material-symbols-outlined text-blue-500">ac_unit</span>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800">Cold Storage Available</p>
                                    <p className="text-xs text-slate-400 font-medium">Do you have cold storage on your farm?</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFarm({ ...farm, hasColdStorage: !farm.hasColdStorage })}
                                className={`relative w-12 h-7 rounded-full transition-all ${farm.hasColdStorage ? 'bg-green-500' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${farm.hasColdStorage ? 'left-6' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined text-3xl">notifications</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Notification Preferences</h3>
                            <p className="text-xs text-slate-400 font-medium">Control how you receive alerts</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { key: 'email', label: 'Email Notifications', desc: 'Receive order updates and reports via email', icon: 'mail' },
                            { key: 'sms', label: 'SMS Notifications', desc: 'Get text alerts for urgent updates', icon: 'sms' },
                            { key: 'push', label: 'Push Notifications', desc: 'Browser and mobile push alerts', icon: 'notifications_active' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                                        <span className="material-symbols-outlined text-slate-500">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{item.label}</p>
                                        <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                                    className={`relative w-12 h-7 rounded-full transition-all ${notifications[item.key] ? 'bg-green-500' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${notifications[item.key] ? 'left-6' : 'left-1'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
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
