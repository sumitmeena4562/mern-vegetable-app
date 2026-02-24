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
            <label className="block text-sm font-bold text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>

            {/* Main Select Box (Trigger) */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full rounded-xl py-3 pl-10 pr-10 bg-white border cursor-pointer flex items-center justify-between transition-all duration-200
          ${disabled ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'hover:border-green-400 shadow-sm hover:shadow-md'}
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${isOpen ? 'ring-4 ring-green-100 border-green-500' : ''}
        `}
            >
                {/* Left Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className={`material-symbols-outlined transition-colors ${value ? 'text-green-600' : 'text-gray-400'}`}>
                        {icon}
                    </span>
                </div>

                {/* Selected Value Text */}
                <span className={`block truncate ${!value ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                    {value || placeholder}
                </span>

                {/* Right Icon (Arrow or Loader) */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-green-600' : ''}`}>
                            expand_more
                        </span>
                    )}
                </div>
            </div>

            {/* The Designer List (Pop-up) */}
            {isOpen && !disabled && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="py-1">
                        {options.length > 0 ? (
                            options.map((option, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors
                    ${value === option.value ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'}
                  `}
                                >
                                    {value === option.value && (
                                        <span className="material-symbols-outlined text-sm">check</span>
                                    )}
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-gray-500 text-center text-sm">No options available</li>
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
