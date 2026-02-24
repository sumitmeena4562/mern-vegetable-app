import React from 'react';

const CropsSection = ({
    formData,
    errors,
    isTouched,
    handleCropToggle,
    handleChange,
    handleBlur
}) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 bg-white p-2 rounded-lg shadow-sm">eco</span>
                    What do you grow?
                </h3>
                <p className="text-sm text-gray-500 mb-6">Select all the primary crops you cultivate. This helps us connect you with the right buyers.</p>

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
                            className={`relative flex items-center p-3 sm:p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 hover:shadow-md active:scale-95
                ${formData.crops[crop.id] ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-gray-100 hover:border-emerald-200'}
              `}
                        >
                            <input
                                type="checkbox"
                                checked={formData.crops[crop.id]}
                                onChange={() => handleCropToggle(crop.id)}
                                className="hidden"
                            />
                            <div className="flex flex-col sm:flex-row items-center sm:gap-3 w-full text-center sm:text-left">
                                <span className="text-2xl sm:text-3xl mb-1 sm:mb-0 grayscale-[0.2] drop-shadow-sm">{crop.icon}</span>
                                <span className={`font-semibold text-sm sm:text-base transition-colors ${formData.crops[crop.id] ? 'text-emerald-800' : 'text-gray-600'}`}>
                                    {crop.label}
                                </span>
                            </div>
                            {/* Added a cute checkmark for selected state */}
                            {formData.crops[crop.id] && (
                                <div className="absolute top-2 right-2 sm:static sm:absolute sm:top-auto sm:bottom-2 sm:right-2">
                                    <span className="material-symbols-outlined text-emerald-500 text-sm sm:text-base font-bold bg-white rounded-full">
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
                    <div className="relative group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Specify Other Crops <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-xl transition-all duration-300 ${isTouched.otherCropName && errors.otherCropName ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-emerald-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined transition-colors duration-300 ${isTouched.otherCropName && errors.otherCropName ? 'text-red-400' : formData.otherCropName ? 'text-emerald-500' : 'text-gray-400'}`}>edit_note</span>
                            </div>
                            <input
                                type="text"
                                name="otherCropName"
                                value={formData.otherCropName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-4 py-3 bg-white border rounded-xl outline-none transition-all duration-300
                  ${isTouched.otherCropName && errors.otherCropName ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}
                `}
                                placeholder="e.g. Wheat, Brinjal, Cabbage"
                            />
                        </div>
                        {isTouched.otherCropName && errors.otherCropName && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.otherCropName}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropsSection;
