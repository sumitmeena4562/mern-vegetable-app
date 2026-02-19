import React from 'react';

const ProductPlaceholder = ({ className = "" }) => {
    return (
        <div className={`relative w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center overflow-hidden ${className}`}>
            {/* Decorative abstract elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl"></div>

            {/* Minimalist leaf icon */}
            <div className="z-10 bg-white/60 backdrop-blur-md p-4 rounded-3xl shadow-xl shadow-green-200/30 border border-white">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1.8 7.5A7 7 0 0 1 11 20Z" />
                    <path d="M9.13 11.3a2.98 2.98 0 0 0 1.56 4.56" />
                    <path d="M20 10c-3 1.5-5.5 2-8 2" />
                </svg>
            </div>

            {/* Branding */}
            <div className="mt-4 text-center z-10">
                <h3 className="text-green-800 text-[10px] font-black uppercase tracking-[0.2em]">AgriConnect</h3>
                <p className="text-green-600/60 text-[8px] font-bold uppercase tracking-widest mt-1">Fresh Produce</p>
            </div>

            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]"></div>
        </div>
    );
};

export default ProductPlaceholder;
