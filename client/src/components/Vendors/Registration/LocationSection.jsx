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
            <div className="bg-[#ECFEFF] rounded-3xl p-6 border border-cyan-100/50">
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-cyan-600">location_on</span>
                        Shop Location
                    </div>
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={gpsLoading}
                        className={`text-[12px] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300
              ${gpsLoading ? 'bg-cyan-100 text-cyan-400 cursor-default' : 'bg-white text-cyan-600 hover:bg-cyan-50 shadow-sm border border-cyan-100'}
            `}
                    >
                        <span className={`material-symbols-outlined text-[18px] ${gpsLoading ? 'animate-spin' : ''}`}>my_location</span>
                        {gpsLoading ? 'Detecting...' : 'Use GPS'}
                    </button>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* State Dropdown */}
                    <CustomSelect
                        label="State"
                        name="state"
                        value={formData.state}
                        options={states.map(s => ({ value: s, label: s }))}
                        onChange={handleChange}
                        placeholder="Select State"
                        icon="map"
                        loading={isFetchingLocations && !districts.length}
                    />

                    {/* District Dropdown */}
                    <CustomSelect
                        label="City/District"
                        name="city"
                        value={formData.city}
                        options={districts.map(d => ({ value: d, label: d }))}
                        onChange={handleChange}
                        placeholder="Select District"
                        icon="location_city"
                        disabled={!formData.state}
                        loading={isFetchingLocations}
                        error={isTouched.city && errors.city}
                    />

                    {/* Detailed Address */}
                    <div className="relative group md:col-span-2">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Detailed Address <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.address && errors.address ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-cyan-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.address && errors.address ? 'text-red-500' : formData.address ? 'text-cyan-600' : 'text-slate-400'}`}>home</span>
                            </div>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.address && errors.address ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50'}
                `}
                                placeholder="Street, Landmark, Area"
                            />
                        </div>
                        {isTouched.address && errors.address && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.address}</p>}
                    </div>

                    {/* GPS Success Message */}
                    {formData.location?.coordinates?.[0] !== 0 && (
                        <div className="md:col-span-2 animate-in fade-in zoom-in duration-500">
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100/50 transform hover:scale-[1.01] transition-all">
                                <span className="material-symbols-outlined text-[18px]">verified</span>
                                <span className="text-[12px] font-bold uppercase tracking-wider">Exact shop location captured via GPS</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationSection;
