import React, { useState } from 'react';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

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

/* ─── inline styles for animations (no external CSS needed) ────── */
const fadeStyle = {
    animation: 'fadeSlideIn 0.35s ease-out',
};
const keyframesStyle = `
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-ring {
  0%   { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}
`;

const FarmerOnboarding = ({ userName, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        farmName: '', farmSize: '', farmSizeUnit: 'acre', landOwnership: 'owned',
        farmingType: 'regular', soilType: 'other', irrigationSystem: 'manual',
        waterSource: 'well', hasColdStorage: false,
        primaryCrop: '', selectedCrops: [], farmingExperience: '', preferredPickupTime: 'morning',
    });

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
    const inputCls = 'w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/60 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-50 outline-none transition-all text-[15px] placeholder:text-slate-300';
    const selectCls = `${inputCls} bg-white appearance-none`;
    const labelCls = 'block text-[13px] font-bold text-slate-600 mb-2 tracking-wide uppercase';

    /* ─── STEP 1 ─── */
    const renderStep1 = () => (
        <div style={fadeStyle} className="space-y-6">
            {/* Farm Name */}
            <div>
                <label className={labelCls}>Farm Name <span className="text-red-400">*</span></label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xl">agriculture</span>
                    <input type="text" value={formData.farmName} onChange={e => handleChange('farmName', e.target.value)}
                        placeholder="e.g. Green Valley Farm" className={`${inputCls} pl-12`} />
                </div>
            </div>

            {/* Farm Size Row */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className={labelCls}>Farm Size <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xl">straighten</span>
                        <input type="number" value={formData.farmSize} onChange={e => handleChange('farmSize', e.target.value)}
                            placeholder="e.g. 5" min="0.1" step="0.1" className={`${inputCls} pl-12`} />
                    </div>
                </div>
                <div className="w-28">
                    <label className={labelCls}>Unit</label>
                    <select value={formData.farmSizeUnit} onChange={e => handleChange('farmSizeUnit', e.target.value)} className={selectCls}>
                        <option value="acre">Acre</option>
                        <option value="hectare">Hectare</option>
                        <option value="bigha">Bigha</option>
                    </select>
                </div>
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
                                    <span className="text-white text-xs">✓</span>
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
        <div style={fadeStyle} className="space-y-6">
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
                                    <span className="text-white text-xs">✓</span>
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
                            className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all active:scale-[0.96] ${formData.soilType === s.value
                                ? 'border-green-400 bg-green-50 text-green-700'
                                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}>
                            <span>{s.emoji}</span>
                            <span>{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Irrigation + Water Source */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className={labelCls}>Irrigation</label>
                    <select value={formData.irrigationSystem} onChange={e => handleChange('irrigationSystem', e.target.value)} className={selectCls}>
                        <option value="drip">💧 Drip</option>
                        <option value="sprinkler">🌧️ Sprinkler</option>
                        <option value="tubewell">🔧 Tubewell</option>
                        <option value="canal">🏞️ Canal</option>
                        <option value="manual">🪣 Manual</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className={labelCls}>Water Source</label>
                    <select value={formData.waterSource} onChange={e => handleChange('waterSource', e.target.value)} className={selectCls}>
                        <option value="borewell">🕳️ Borewell</option>
                        <option value="river">🏞️ River</option>
                        <option value="canal">🌊 Canal</option>
                        <option value="rainwater">🌧️ Rainwater</option>
                        <option value="well">⛲ Well</option>
                    </select>
                </div>
            </div>

            {/* Cold Storage Toggle */}
            <button type="button" onClick={() => handleChange('hasColdStorage', !formData.hasColdStorage)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${formData.hasColdStorage
                    ? 'border-blue-400 bg-blue-50'
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
        <div style={fadeStyle} className="space-y-6">
            {/* Primary Crop */}
            <div>
                <label className={labelCls}>Primary Crop (Specialization)</label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xl">local_florist</span>
                    <input type="text" value={formData.primaryCrop} onChange={e => handleChange('primaryCrop', e.target.value)}
                        placeholder="e.g. Tomato Expert" className={`${inputCls} pl-12`} />
                </div>
            </div>

            {/* Crop Selector */}
            <div>
                <label className={labelCls}>Select Your Crops <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {CROP_OPTIONS.map(crop => (
                        <button key={crop.name} type="button" onClick={() => toggleCrop(crop.name)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all active:scale-[0.94] ${formData.selectedCrops.includes(crop.name)
                                ? 'border-green-400 bg-green-50 text-green-700 shadow-md shadow-green-100/40'
                                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}>
                            <span className="text-xl">{crop.emoji}</span>
                            <span className="truncate w-full text-center">{crop.name}</span>
                            {formData.selectedCrops.includes(crop.name) && (
                                <span className="text-green-500 text-[10px] font-bold">✓ Selected</span>
                            )}
                        </button>
                    ))}
                </div>
                {formData.selectedCrops.length > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-2">
                        {formData.selectedCrops.length} crop{formData.selectedCrops.length > 1 ? 's' : ''} selected
                    </p>
                )}
            </div>

            {/* Experience + Pickup Time */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className={labelCls}>Experience (Years) <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xl">timer</span>
                        <input type="number" value={formData.farmingExperience} onChange={e => handleChange('farmingExperience', e.target.value)}
                            placeholder="e.g. 5" min="0" className={`${inputCls} pl-12`} />
                    </div>
                </div>
                <div className="flex-1">
                    <label className={labelCls}>Pickup Time</label>
                    <select value={formData.preferredPickupTime} onChange={e => handleChange('preferredPickupTime', e.target.value)} className={selectCls}>
                        <option value="morning">🌅 Morning</option>
                        <option value="afternoon">☀️ Afternoon</option>
                        <option value="evening">🌇 Evening</option>
                        <option value="any">📦 Any Time</option>
                    </select>
                </div>
            </div>
        </div>
    );

    /* ─── progress percentage ─── */
    const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

    /* ═══════════════════ MAIN RENDER ═══════════════════ */
    return (
        <>
            <style>{keyframesStyle}</style>
            <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50 flex flex-col">

                {/* ── Top Bar ── */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                    {/* Progress Bar */}
                    <div className="h-1 bg-slate-100">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out rounded-r-full" style={{ width: `${progressPercent}%` }} />
                    </div>

                    <div className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-lg">eco</span>
                            </div>
                            <span className="text-sm font-bold text-slate-700">AgriConnect</span>
                        </div>

                        {/* Step Pills */}
                        <div className="flex items-center gap-1.5">
                            {STEPS.map((step, idx) => (
                                <React.Fragment key={step.id}>
                                    <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 ${currentStep === step.id
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-200/50'
                                        : currentStep > step.id
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-slate-100 text-slate-400'}`}>
                                        {currentStep > step.id
                                            ? <span className="material-symbols-outlined text-xs">check</span>
                                            : <span>{step.id}</span>
                                        }
                                        <span className="hidden sm:inline">{step.title}</span>
                                    </div>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`w-4 h-0.5 rounded-full transition-colors duration-300 ${currentStep > step.id ? 'bg-green-300' : 'bg-slate-200'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div className="flex-1 flex flex-col items-center justify-start px-4 py-6 sm:py-10">
                    <div className="w-full max-w-lg">

                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                                {currentStep === 1 && <>Welcome, {userName}! 👋</>}
                                {currentStep === 2 && <>Let's set up your farm 🌾</>}
                                {currentStep === 3 && <>Almost done! 🚀</>}
                            </h1>
                            <p className="text-slate-400 text-sm mt-1.5">
                                Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].desc}
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/40 border border-slate-100/80 overflow-hidden">
                            <div className="p-5 sm:p-7">
                                {currentStep === 1 && renderStep1()}
                                {currentStep === 2 && renderStep2()}
                                {currentStep === 3 && renderStep3()}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-5 gap-3">
                            {currentStep > 1 ? (
                                <button onClick={handleBack}
                                    className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-600 bg-white border-2 border-slate-100 hover:border-slate-200 active:scale-[0.97] transition-all">
                                    ← Back
                                </button>
                            ) : <div className="flex-1 sm:flex-none" />}

                            {currentStep < 3 ? (
                                <button onClick={handleNext}
                                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl shadow-green-200/50 active:scale-[0.97] transition-all">
                                    Continue →
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={isSubmitting}
                                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl shadow-green-200/50 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                                    ) : (
                                        <>🚀 Start Farming</>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Footer */}
                        <p className="text-center text-[11px] text-slate-300 mt-6">
                            This information helps us connect you with better prices and trusted vendors.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FarmerOnboarding;
