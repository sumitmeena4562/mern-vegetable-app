import React from 'react';
import CustomSelect from '../../common/CustomSelect';

const LocationSection = ({
    formData,
    errors,
    isTouched,
    handleChange,
    handleBlur,
    states,
    districts,
    isFetchingLocations,
    gpsLoading,
    handleGetLocation
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 relative z-[30]">
            <div className="bg-[#FFF7ED] rounded-3xl p-6 border border-orange-100/50">
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500 text-[22px]">location_on</span>
                        Farm Location
                    </div>
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={gpsLoading}
                        className="text-[13px] flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors font-medium shadow-sm hover:shadow active:scale-95"
                    >
                        {gpsLoading ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <span className="material-symbols-outlined text-[16px]">my_location</span>
                        )}
                        Use Current Location
                    </button>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* State Dropdown */}
                    <CustomSelect
                        label="State"
                        name="state"
                        value={formData.state}
                        options={states.map(state => ({ value: state.name || state, label: state.name || state }))}
                        onChange={handleChange}
                        placeholder="Select State"
                        icon="map"
                        disabled={isFetchingLocations}
                        loading={isFetchingLocations}
                    />

                    {/* District Dropdown */}
                    <CustomSelect
                        label="District"
                        name="city" // Backend uses 'city' for district
                        value={formData.city}
                        options={districts.map(district => ({ value: district.name || district, label: district.name || district }))}
                        onChange={handleChange}
                        placeholder="Select District"
                        icon="location_city"
                        disabled={districts.length === 0 || isFetchingLocations}
                        loading={isFetchingLocations && formData.state}
                        error={isTouched.city && errors.city ? errors.city : ""}
                    />

                    {/* Village / Local Area */}
                    <div className="relative group md:col-span-2">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Village / Local Area <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.village && errors.village ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-orange-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.village && errors.village ? 'text-red-500' : formData.village ? 'text-orange-500' : 'text-slate-400'}`}>holiday_village</span>
                            </div>
                            <input
                                type="text"
                                name="village"
                                value={formData.village}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] text-slate-700 font-medium
                  ${isTouched.village && errors.village ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50'}
                `}
                                placeholder="Enter your village or area name"
                            />
                        </div>
                        {isTouched.village && errors.village && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.village}</p>}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LocationSection;
