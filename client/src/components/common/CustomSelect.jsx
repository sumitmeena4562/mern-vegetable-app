import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ label, name, value, options, onChange, placeholder, icon, disabled, loading, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Click outside close logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        const fakeEvent = {
            target: { name: name, value: optionValue }
        };
        onChange(fakeEvent);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-[13px] font-bold text-slate-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>

            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`relative w-full rounded-full py-2.5 pl-11 pr-10 bg-white border cursor-pointer flex items-center transition-all duration-300 text-sm
          ${disabled ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'hover:border-green-400 shadow-sm hover:shadow-md'}
          ${error ? 'border-red-400' : 'border-slate-200'}
          ${isOpen ? 'ring-4 ring-green-50 border-green-500' : ''}
        `}
            >
                {/* Left Icon (Inside) */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className={`material-symbols-outlined text-[20px] transition-colors ${value || isOpen ? 'text-green-600' : 'text-slate-400'}`}>
                        {icon}
                    </span>
                </div>

                {/* Selected Value Text */}
                <span className={`block w-full text-left pl-1 truncate ${!value ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                    {value || placeholder}
                </span>

                {/* Right Icon (Arrow or Loader) */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <span className={`material-symbols-outlined text-[20px] text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-green-600' : ''}`}>
                            expand_more
                        </span>
                    )}
                </div>
            </div>

            {/* The Designer List (Pop-up) */}
            {isOpen && !disabled && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="py-2">
                        {options.length > 0 ? (
                            options.map((option, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-5 py-2.5 cursor-pointer flex items-center gap-3 transition-colors text-[14px]
                    ${value === option.value ? 'text-green-600 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-5 py-3 text-slate-400 text-center text-[13px]">No options available</li>
                        )}
                    </ul>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default CustomSelect;
