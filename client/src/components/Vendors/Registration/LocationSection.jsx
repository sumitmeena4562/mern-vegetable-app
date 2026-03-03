import React from 'react';
import Select from '../../ui/Select';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

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
                    <Button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={gpsLoading}
                        isLoading={gpsLoading}
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${gpsLoading ? 'bg-cyan-100 text-cyan-400' : 'text-cyan-600 border-cyan-100 hover:bg-cyan-50'}`}
                        icon="my_location"
                    >
                        Use GPS
                    </Button>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* State Dropdown */}
                    <Select
                        label="State"
                        name="state"
                        value={formData.state}
                        options={[
                            { value: "", label: "Select State" },
                            ...states.map(s => ({ value: s, label: s }))
                        ]}
                        onChange={handleChange}
                        icon="map"
                        loading={isFetchingLocations && !districts.length}
                        className="rounded-full focus:ring-cyan-500/30 focus:border-cyan-500"
                    />

                    {/* District Dropdown */}
                    <Select
                        label="City/District"
                        name="city"
                        value={formData.city}
                        options={[
                            { value: "", label: "Select District" },
                            ...districts.map(d => ({ value: d, label: d }))
                        ]}
                        onChange={handleChange}
                        icon="location_city"
                        disabled={!formData.state}
                        loading={isFetchingLocations}
                        error={isTouched.city && errors.city}
                        className="rounded-full focus:ring-cyan-500/30 focus:border-cyan-500"
                    />

                    {/* Detailed Address */}
                    <div className="md:col-span-2">
                        <Input
                            label={<>Detailed Address <span className="text-red-500">*</span></>}
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="home"
                            placeholder="Street, Landmark, Area"
                            error={isTouched.address && errors.address ? errors.address : null}
                            className="rounded-full focus:ring-cyan-500/30 focus:border-cyan-500"
                        />
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
