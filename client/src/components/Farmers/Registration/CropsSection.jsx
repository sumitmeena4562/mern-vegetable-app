import React from 'react';
import Input from '../../ui/Input';
import { RegistrationCard } from '../../common/Registration/SharedUI';

const CropsSection = ({
    formData,
    errors,
    isTouched,
    handleCropToggle,
    handleChange,
    handleBlur
}) => {
    return (
        <RegistrationCard
            title="Crops You Grow"
            icon="eco"
            iconColor="text-emerald-500"
            bgColor="bg-[#F0FDF4]"
            borderColor="border-emerald-100/50"
            delayClass="delay-300"
        >
            <p className="text-[13px] text-slate-500 mb-6 font-medium">Select all the primary crops you cultivate. This helps us connect you with the right buyers.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                    { id: 'tomato', icon: '🍅', label: 'Tomato' },
                    { id: 'potato', icon: '🥔', label: 'Potato' },
                    { id: 'onion', icon: '🧅', label: 'Onion' },
                    { id: 'carrot', icon: '🥕', label: 'Carrot' },
                    { id: 'leafyVeg', icon: '🥬', label: 'Leafy Veg' },
                    { id: 'others', icon: '✨', label: 'Others' },
                ].map((crop) => (
                    <label
                        key={crop.id}
                        className={`relative flex items-center justify-center p-2.5 sm:p-3 rounded-full cursor-pointer border-2 transition-all duration-300 active:scale-95
                ${formData.crops[crop.id] ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-white border-transparent shadow-sm hover:border-emerald-200'}
              `}
                    >
                        <input
                            type="checkbox"
                            checked={formData.crops[crop.id]}
                            onChange={() => handleCropToggle(crop.id)}
                            className="hidden"
                        />
                        <div className="flex items-center gap-2 w-full justify-center">
                            <span className="text-2xl drop-shadow-sm">{crop.icon}</span>
                            <span className={`font-bold text-[13px] transition-colors ${formData.crops[crop.id] ? 'text-emerald-800' : 'text-slate-700'}`}>
                                {crop.label}
                            </span>
                        </div>
                        {/* Checkmark for selected state */}
                        {formData.crops[crop.id] && (
                            <div className="absolute -top-1 -right-1">
                                <span className="material-symbols-outlined text-emerald-500 text-[18px] font-bold bg-white rounded-full">
                                    check_circle
                                </span>
                            </div>
                        )}
                    </label>
                ))}
            </div>
            {/* Validation Error for Crops */}
            {isTouched.formSubmit && !Object.values(formData.crops).some(v => v) && (
                <p className="text-red-500 text-xs mt-3 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> Please select at least one crop.</p>
            )}

            {/* Conditional "Other Crops" Input with smooth animation */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${formData.crops.others ? 'max-h-40 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                <Input
                    label={<>Specify Other Crops <span className="text-red-500">*</span></>}
                    name="otherCropName"
                    type="text"
                    value={formData.otherCropName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    icon="edit_note"
                    placeholder="e.g. Wheat, Brinjal, Cabbage"
                    error={isTouched.otherCropName && errors.otherCropName ? errors.otherCropName : null}
                    className={`rounded-full ${isTouched.otherCropName && errors.otherCropName ? '' : 'focus:border-emerald-500 focus:ring-emerald-50'}`}
                />
            </div>
        </RegistrationCard>
    );
};

export default CropsSection;
