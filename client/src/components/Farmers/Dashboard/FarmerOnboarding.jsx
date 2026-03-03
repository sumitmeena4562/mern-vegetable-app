import React, { useState } from 'react';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { RegistrationCard, RegistrationHeader } from '../../common/Registration/SharedUI';
import useGPS from '@/hooks/useGPS';

const STEPS = [
    { id: 1, title: 'Farm Info', icon: 'home_work', desc: 'Enter your basic farm information' },
    { id: 2, title: 'Resources', icon: 'water_drop', desc: 'Tell us about your soil, water and farming type' },
    { id: 3, title: 'Crops', icon: 'eco', desc: 'Share your crop details and experience' },
];

const CROP_OPTIONS = [
    { name: 'Tomato', emoji: '🍅' },
    { name: 'Potato', emoji: '🥔' },
    { name: 'Onion', emoji: '🧅' },
    { name: 'Spinach', emoji: '🥬' },
    { name: 'Cauliflower', emoji: '🥦' },
    { name: 'Cabbage', emoji: '🥬' },
    { name: 'Brinjal', emoji: '🍆' },
    { name: 'Chili', emoji: '🌶️' },
    { name: 'Okra', emoji: '🫑' },
    { name: 'Cucumber', emoji: '🥒' },
    { name: 'Carrot', emoji: '🥕' },
    { name: 'Peas', emoji: '🫛' },
    { name: 'Garlic', emoji: '🧄' },
    { name: 'Ginger', emoji: '🫚' },
];

const FARMING_TYPES = [
    { value: 'organic', label: 'Organic', emoji: '🌿', desc: 'Chemical-free farming', color: 'from-green-400 to-emerald-500' },
    { value: 'natural', label: 'Natural', emoji: '🌱', desc: 'Traditional methods', color: 'from-lime-400 to-green-500' },
    { value: 'regular', label: 'Regular', emoji: '🌾', desc: 'Standard farming', color: 'from-yellow-400 to-amber-500' },
    { value: 'hydroponic', label: 'Hydroponic', emoji: '💧', desc: 'Soilless farming', color: 'from-cyan-400 to-blue-500' },
];

const SOIL_TYPES = [
    { value: 'black', label: 'Black', emoji: '⬛' },
    { value: 'red', label: 'Red', emoji: '🟥' },
    { value: 'alluvial', label: 'Alluvial', emoji: '🟫' },
    { value: 'sandy', label: 'Sandy', emoji: '🟨' },
    { value: 'clay', label: 'Clay', emoji: '🟧' },
    { value: 'other', label: 'Other', emoji: '⬜' },
];

const FarmerOnboarding = ({ userName, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        farmName: '', farmSize: '', farmSizeUnit: 'acre', landOwnership: 'owned',
        farmingType: 'regular', soilType: 'other', irrigationSystem: 'manual',
        waterSource: 'well', hasColdStorage: false,
        primaryCrop: '', selectedCrops: [], farmingExperience: '', preferredPickupTime: 'morning',
        location: { coordinates: [] }
    });

    const { gpsLoading, handleGetLocation } = useGPS((coords) => {
        setFormData(p => ({
            ...p,
            location: { coordinates: [coords.longitude, coords.latitude] }
        }));
    }, "Farm location verified! 📍");

    const handleChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));

    const toggleCrop = (crop) => {
        setFormData(p => ({
            ...p,
            selectedCrops: p.selectedCrops.includes(crop)
                ? p.selectedCrops.filter(c => c !== crop)
                : [...p.selectedCrops, crop]
        }));
    };

    const validateStep = () => {
        if (currentStep === 1) {
            if (!formData.farmName.trim()) { toast.error('Please enter your farm name'); return false; }
            if (!formData.farmSize || formData.farmSize <= 0) { toast.error('Please enter a valid farm size'); return false; }
            if (formData.location.coordinates.length !== 2) { toast.error('Please verify your farm location via GPS'); return false; }
        }
        if (currentStep === 3) {
            if (formData.selectedCrops.length === 0) { toast.error('Please select at least one crop'); return false; }
            if (!formData.farmingExperience && formData.farmingExperience !== 0) { toast.error('Please enter your farming experience'); return false; }
        }
        return true;
    };

    const handleNext = () => { if (validateStep()) setCurrentStep(p => Math.min(p + 1, 3)); };
    const handleBack = () => setCurrentStep(p => Math.max(p - 1, 1));

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        try {
            await api.put('/farmers/complete-onboarding', {
                farmName: formData.farmName,
                farmSize: parseFloat(formData.farmSize),
                farmSizeUnit: formData.farmSizeUnit,
                landOwnership: formData.landOwnership,
                farmingType: formData.farmingType,
                soilType: formData.soilType,
                irrigationSystem: formData.irrigationSystem,
                waterSource: formData.waterSource,
                hasColdStorage: formData.hasColdStorage,
                primaryCrop: formData.primaryCrop,
                crops: formData.selectedCrops.map(n => ({ name: n })),
                farmingExperience: parseInt(formData.farmingExperience) || 0,
                preferredPickupTime: formData.preferredPickupTime,
                location: formData.location
            });
            toast.success('🎉 Onboarding complete! Welcome aboard!');
            if (onComplete) onComplete();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ─── Shared classes ─── */
    const labelCls = 'block text-[11px] font-black text-slate-400 mb-2 tracking-widest uppercase';

    /* ─── STEP 1 ─── */
    const renderStep1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Farm Name */}
            <Input
                label={<>Farm Name <span className="text-red-400">*</span></>}
                type="text"
                value={formData.farmName}
                onChange={e => handleChange('farmName', e.target.value)}
                placeholder="e.g. Green Valley Farm"
                icon="agriculture"
                className="rounded-2xl"
            />

            {/* Farm Size Row */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <Input
                        label={<>Farm Size <span className="text-red-400">*</span></>}
                        type="number"
                        value={formData.farmSize}
                        onChange={e => handleChange('farmSize', e.target.value)}
                        placeholder="e.g. 5"
                        min="0.1"
                        step="0.1"
                        icon="straighten"
                        className="rounded-2xl"
                    />
                </div>
                <div className="w-28">
                    <Select
                        label="Unit"
                        value={formData.farmSizeUnit}
                        onChange={e => handleChange('farmSizeUnit', e.target.value)}
                        options={[
                            { value: 'acre', label: 'Acre' },
                            { value: 'hectare', label: 'Hectare' },
                            { value: 'bigha', label: 'Bigha' }
                        ]}
                        className="rounded-2xl"
                    />
                </div>
            </div>

            {/* GPS Verification Section */}
            <div className="p-5 rounded-3xl border-2 border-slate-50 bg-slate-50/50 space-y-3">
                <label className={labelCls}>Precise Farm Location <span className="text-red-400">*</span></label>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={gpsLoading}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${formData.location.coordinates.length === 2
                            ? 'bg-green-50 text-green-700 border-2 border-green-200'
                            : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-green-400 shadow-sm'
                            }`}
                    >
                        {gpsLoading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            <span className="material-symbols-outlined">my_location</span>
                        )}
                        {formData.location.coordinates.length === 2 ? 'Location Verified' : 'Verify Farm Location'}
                    </button>

                    {formData.location.coordinates.length === 2 && (
                        <div className="px-4 py-2 bg-white rounded-xl border border-green-100 flex flex-col items-center">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Registered GPS</span>
                            <span className="text-[11px] font-bold text-green-600">
                                {formData.location.coordinates[1].toFixed(4)}, {formData.location.coordinates[0].toFixed(4)}
                            </span>
                        </div>
                    )}
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    📍 Precision location helps transport partners find your farm for quick pickups and better route planning.
                </p>
            </div>

            {/* Land Ownership */}
            <div>
                <label className={labelCls}>Land Ownership</label>
                <div className="grid grid-cols-2 gap-3">
                    {[{ v: 'owned', l: 'Self Owned', i: '🏠', d: 'Your own land' }, { v: 'leased', l: 'Leased', i: '🔑', d: 'Rented land' }].map(o => (
                        <button key={o.v} type="button" onClick={() => handleChange('landOwnership', o.v)}
                            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.97] ${formData.landOwnership === o.v
                                ? 'border-green-400 bg-green-50 shadow-lg shadow-green-100/50'
                                : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                            <div className="text-2xl mb-1">{o.i}</div>
                            <div className="font-bold text-sm text-slate-700">{o.l}</div>
                            <div className="text-[11px] text-slate-400">{o.d}</div>
                            {formData.landOwnership === o.v && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-black">✓</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ─── STEP 2 ─── */
    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Farming Type */}
            <div>
                <label className={labelCls}>Farming Type</label>
                <div className="grid grid-cols-2 gap-3">
                    {FARMING_TYPES.map(opt => (
                        <button key={opt.value} type="button" onClick={() => handleChange('farmingType', opt.value)}
                            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.97] ${formData.farmingType === opt.value
                                ? 'border-green-400 bg-green-50 shadow-lg shadow-green-100/50'
                                : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                            <div className="text-2xl mb-1">{opt.emoji}</div>
                            <div className="font-bold text-sm text-slate-700">{opt.label}</div>
                            <div className="text-[11px] text-slate-400">{opt.desc}</div>
                            {formData.farmingType === opt.value && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-black">✓</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Soil Type */}
            <div>
                <label className={labelCls}>Soil Type</label>
                <div className="grid grid-cols-3 gap-2">
                    {SOIL_TYPES.map(s => (
                        <button key={s.value} type="button" onClick={() => handleChange('soilType', s.value)}
                            className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-xs font-bold transition-all active:scale-[0.96] uppercase tracking-wider ${formData.soilType === s.value
                                ? 'border-green-600 bg-green-50 text-green-700 shadow-lg shadow-green-100'
                                : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>
                            <span className="text-base">{s.emoji}</span>
                            <span>{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Irrigation + Water Source */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <Select
                        label="Irrigation"
                        value={formData.irrigationSystem}
                        onChange={e => handleChange('irrigationSystem', e.target.value)}
                        options={[
                            { value: 'drip', label: '💧 Drip' },
                            { value: 'sprinkler', label: '🌧️ Sprinkler' },
                            { value: 'tubewell', label: '🔧 Tubewell' },
                            { value: 'canal', label: '🏞️ Canal' },
                            { value: 'manual', label: '🪣 Manual' }
                        ]}
                        className="rounded-2xl"
                    />
                </div>
                <div className="flex-1">
                    <Select
                        label="Water Source"
                        value={formData.waterSource}
                        onChange={e => handleChange('waterSource', e.target.value)}
                        options={[
                            { value: 'borewell', label: '🕳️ Borewell' },
                            { value: 'river', label: '🏞️ River' },
                            { value: 'canal', label: '🌊 Canal' },
                            { value: 'rainwater', label: '🌧️ Rainwater' },
                            { value: 'well', label: '⛲ Well' }
                        ]}
                        className="rounded-2xl"
                    />
                </div>
            </div>

            {/* Cold Storage Toggle */}
            <button type="button" onClick={() => handleChange('hasColdStorage', !formData.hasColdStorage)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${formData.hasColdStorage
                    ? 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-100/50'
                    : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                <div className={`w-12 h-7 rounded-full flex items-center transition-all duration-300 ${formData.hasColdStorage ? 'bg-blue-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md mx-1 transition-all`} />
                </div>
                <div className="text-left">
                    <div className="font-bold text-sm text-slate-700">❄️ Cold Storage</div>
                    <div className="text-[11px] text-slate-400">Do you have cold storage facility?</div>
                </div>
            </button>
        </div>
    );

    /* ─── STEP 3 ─── */
    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Primary Crop */}
            <Input
                label="Primary Crop (Specialization)"
                type="text"
                value={formData.primaryCrop}
                onChange={e => handleChange('primaryCrop', e.target.value)}
                placeholder="e.g. Tomato Expert"
                icon="local_florist"
                className="rounded-2xl"
            />

            {/* Crop Selector */}
            <div>
                <label className={labelCls}>Select Your Crops <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {CROP_OPTIONS.map(crop => (
                        <button key={crop.name} type="button" onClick={() => toggleCrop(crop.name)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.94] ${formData.selectedCrops.includes(crop.name)
                                ? 'border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-100/40'
                                : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>
                            <span className="text-xl mb-1">{crop.emoji}</span>
                            <span className="truncate w-full text-center leading-none">{crop.name}</span>
                            {formData.selectedCrops.includes(crop.name) && (
                                <span className="absolute top-1 right-1 text-green-500 material-symbols-outlined text-sm font-black">check_circle</span>
                            )}
                        </button>
                    ))}
                </div>
                {formData.selectedCrops.length > 0 && (
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mt-3 bg-green-50 inline-block px-3 py-1 rounded-full border border-green-100">
                        {formData.selectedCrops.length} crop{formData.selectedCrops.length > 1 ? 's' : ''} selected
                    </p>
                )}
            </div>

            {/* Experience + Pickup Time */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <Input
                        label={<>Experience (Years) <span className="text-red-400">*</span></>}
                        type="number"
                        value={formData.farmingExperience}
                        onChange={e => handleChange('farmingExperience', e.target.value)}
                        placeholder="e.g. 5"
                        min="0"
                        icon="timer"
                        className="rounded-2xl"
                    />
                </div>
                <div className="flex-1">
                    <Select
                        label="Pickup Time"
                        value={formData.preferredPickupTime}
                        onChange={e => handleChange('preferredPickupTime', e.target.value)}
                        options={[
                            { value: 'morning', label: '🌅 Morning' },
                            { value: 'afternoon', label: '☀️ Afternoon' },
                            { value: 'evening', label: '🌇 Evening' },
                            { value: 'any', label: '📦 Any Time' }
                        ]}
                        className="rounded-2xl"
                    />
                </div>
            </div>
        </div>
    );

    /* ─── progress percentage ─── */
    const progressPercent = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

    return (
        <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
            {/* Background Decorative Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]" />
            </div>

            <RegistrationHeader
                title={
                    currentStep === 1 ? `Welcome, ${userName}! 👋` :
                        currentStep === 2 ? "Farm Setup 🌾" :
                            "Final Details 🚀"
                }
                subtitle={`Step ${currentStep} of ${STEPS.length}: ${STEPS[currentStep - 1].title}`}
                icon={STEPS[currentStep - 1].icon}
                iconBg="bg-green-600"
                progress={progressPercent}
                progressText={STEPS[currentStep - 1].desc}
            />

            <div className="sm:mx-auto sm:w-full sm:max-w-xl">
                <RegistrationCard
                    title={STEPS[currentStep - 1].title}
                    icon={STEPS[currentStep - 1].icon}
                    iconColor="text-green-600"
                >
                    <div className="mt-2">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                    </div>

                    <div className="mt-10 flex items-center justify-between gap-4">
                        {currentStep > 1 ? (
                            <Button
                                onClick={handleBack}
                                variant="outline"
                                className="flex-1 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                <span className="material-symbols-outlined mr-2">arrow_back</span>
                                Back
                            </Button>
                        ) : <div className="flex-1" />}

                        {currentStep < 3 ? (
                            <Button
                                onClick={handleNext}
                                className="flex-1 rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200"
                            >
                                Continue
                                <span className="material-symbols-outlined ml-2">arrow_forward</span>
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                                className="flex-1 rounded-2xl bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200"
                            >
                                Start Farming
                                <span className="material-symbols-outlined ml-2">eco</span>
                            </Button>
                        )}
                    </div>
                </RegistrationCard>

                <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                    Supporting Indian Farmers & Merchants <br />
                    AgriConnect Digital Ecosystem
                </p>
            </div>
        </div>
    );
};

export default FarmerOnboarding;
