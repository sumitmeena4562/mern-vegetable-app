import React from 'react';
import Select from '../../ui/Select';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

/**
 * Shared LocationSection — used by both FarmerRegistration and VendorRegistration.
 *
 * @param {object} theme - Visual theme config
 */

// Pre-built theme configs
export const FARMER_LOCATION_THEME = {
    bg: 'bg-[#FFF7ED]',
    border: 'border-orange-100/50',
    iconColor: 'text-orange-500',
    title: 'Farm Location',
    gpsBtnClass: 'text-orange-500 border-orange-200 hover:bg-orange-50',
    gpsBtnLoadingClass: '',
    gpsBtnLabel: 'Use Current Location',
    focusRing: '',
    addressLabel: <>Village / Local Area <span className="text-red-500">*</span></>,
    addressName: 'village',
    addressPlaceholder: 'Enter your village or area name',
    addressIcon: 'holiday_village',
    showGpsSuccess: false,
    statesMapper: (states) => states.map(s => ({ value: s.name || s, label: s.name || s })),
    districtsMapper: (districts) => districts.map(d => ({ value: d.name || d, label: d.name || d })),
    selectLoading: false,
    districtDisabledCheck: (districts) => districts.length === 0,
};

export const VENDOR_LOCATION_THEME = {
    bg: 'bg-[#ECFEFF]',
    border: 'border-cyan-100/50',
    iconColor: 'text-cyan-600',
    title: 'Shop Location',
    gpsBtnClass: 'text-cyan-600 border-cyan-100 hover:bg-cyan-50',
    gpsBtnLoadingClass: 'bg-cyan-100 text-cyan-400',
    gpsBtnLabel: 'Use GPS',
    focusRing: 'focus:ring-cyan-500/30 focus:border-cyan-500',
    addressLabel: <>Detailed Address <span className="text-red-500">*</span></>,
    addressName: 'address',
    addressPlaceholder: 'Street, Landmark, Area',
    addressIcon: 'home',
    showGpsSuccess: true,
    statesMapper: (states) => states.map(s => ({ value: s, label: s })),
    districtsMapper: (districts) => districts.map(d => ({ value: d, label: d })),
    selectLoading: true,
    districtDisabledCheck: (districts, formData) => !formData.state,
};

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
    handleGetLocation,
    theme = FARMER_LOCATION_THEME,
}) => {
    const t = theme;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 relative z-[30]">
            <div className={`${t.bg} rounded-3xl p-6 border ${t.border}`}>
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined ${t.iconColor}`}>location_on</span>
                        {t.title}
                    </div>
                    <Button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={gpsLoading}
                        isLoading={gpsLoading}
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${gpsLoading ? t.gpsBtnLoadingClass : t.gpsBtnClass}`}
                        icon="my_location"
                    >
                        {t.gpsBtnLabel}
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
                            ...t.statesMapper(states)
                        ]}
                        onChange={handleChange}
                        icon="map"
                        loading={t.selectLoading ? (isFetchingLocations && !districts.length) : undefined}
                        disabled={!t.selectLoading ? isFetchingLocations : undefined}
                        className={`rounded-full ${t.focusRing}`}
                    />

                    {/* District Dropdown */}
                    <Select
                        label={t.selectLoading ? "City/District" : "District"}
                        name="city"
                        value={formData.city}
                        options={[
                            { value: "", label: "Select District" },
                            ...t.districtsMapper(districts)
                        ]}
                        onChange={handleChange}
                        icon="location_city"
                        disabled={t.districtDisabledCheck(districts, formData)}
                        loading={t.selectLoading ? isFetchingLocations : undefined}
                        error={isTouched.city && errors.city ? errors.city : ""}
                        className={`rounded-full ${t.focusRing}`}
                    />

                    {/* Address / Village */}
                    <div className="md:col-span-2">
                        <Input
                            label={t.addressLabel}
                            name={t.addressName}
                            type="text"
                            value={formData[t.addressName]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon={t.addressIcon}
                            placeholder={t.addressPlaceholder}
                            error={isTouched[t.addressName] && errors[t.addressName] ? errors[t.addressName] : null}
                            className={`rounded-full ${t.focusRing || 'focus:border-orange-500 focus:ring-orange-50'}`}
                        />
                    </div>

                    {/* GPS Success Message (Vendor only) */}
                    {t.showGpsSuccess && formData.location?.coordinates?.[0] !== 0 && (
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
