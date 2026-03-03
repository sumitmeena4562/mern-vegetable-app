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
            <div className="bg-[#FFF7ED] rounded-3xl p-6 border border-orange-100/50">
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500 text-[22px]">location_on</span>
                        Farm Location
                    </div>
                    <Button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={gpsLoading}
                        isLoading={gpsLoading}
                        variant="outline"
                        size="sm"
                        className="rounded-full text-orange-500 border-orange-200 hover:bg-orange-50"
                        icon="my_location"
                    >
                        Use Current Location
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
                            ...states.map(state => ({ value: state.name || state, label: state.name || state }))
                        ]}
                        onChange={handleChange}
                        icon="map"
                        disabled={isFetchingLocations}
                        className="rounded-full"
                    />

                    {/* District Dropdown */}
                    <Select
                        label="District"
                        name="city" // Backend uses 'city' for district
                        value={formData.city}
                        options={[
                            { value: "", label: "Select District" },
                            ...districts.map(district => ({ value: district.name || district, label: district.name || district }))
                        ]}
                        onChange={handleChange}
                        icon="location_city"
                        disabled={districts.length === 0 || isFetchingLocations}
                        error={isTouched.city && errors.city ? errors.city : ""}
                        className="rounded-full"
                    />

                    {/* Village / Local Area */}
                    <div className="md:col-span-2">
                        <Input
                            label={<>Village / Local Area <span className="text-red-500">*</span></>}
                            name="village"
                            type="text"
                            value={formData.village}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="holiday_village"
                            placeholder="Enter your village or area name"
                            error={isTouched.village && errors.village ? errors.village : null}
                            className={`rounded-full ${isTouched.village && errors.village ? '' : 'focus:border-orange-500 focus:ring-orange-50'}`}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LocationSection;
