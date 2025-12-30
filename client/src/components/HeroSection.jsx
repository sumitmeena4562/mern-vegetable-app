import React from 'react'
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section id="home" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0e1b13] dark:text-white leading-[1.1]">
                            Farm to Fork: <br />
                            <span className="text-primary">India's Direct Vegetable Supply Chain.</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto lg:mx-0">
                            Zero Commission. Fresh Produce. Instant Payments. Connecting Farmers, Vendors, and Customers directly.
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4 mt-8 w-full">
                            {/* Farmer Card */}
                            <Link
                                to="/farmer-registration" // <-- Yahan apna route dein (e.g. signup ya farmer page)
                                className="block no-underline" // Link ko block banayein taaki styling sahi rahe
                            >
                                <div className="group relative flex flex-col items-center p-6 bg-white dark:bg-[#1a2e22] rounded-2xl border-2 border-transparent hover:border-secondary shadow-lg hover:shadow-xl transition-all cursor-pointer">
                                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">agriculture</span>
                                    </div>
                                    <h3 className="font-bold text-[#0e1b13] dark:text-white mb-1">I am a Farmer</h3>
                                    <p className="text-xs text-center text-gray-500 mb-4 dark:text-gray-400">Sell Produce Directly</p>
                                    <button className="w-full py-2 rounded-full bg-secondary text-white text-sm font-bold">JOIN US</button>
                                </div>
                            </Link>

                            {/* Vendor Card */}
                            <Link
                                to="/vendor-registration" // <-- Yahan apna route dein (e.g. signup ya farmer page)
                                className="block no-underline" // Link ko block banayein taaki styling sahi rahe
                            >
                                <div className="group relative flex flex-col items-center p-6 bg-white dark:bg-[#1a2e22] rounded-2xl border-2 border-transparent hover:border-primary shadow-lg hover:shadow-xl transition-all cursor-pointer">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">storefront</span>
                                    </div>
                                    <h3 className="font-bold text-[#0e1b13] dark:text-white mb-1">I am a Vendor</h3>
                                    <p className="text-xs text-center text-gray-500 mb-4 dark:text-gray-400">Buy in Bulk</p>
                                    <button className="w-full py-2 rounded-full bg-primary text-white text-sm font-bold">JOIN US</button>
                                </div>
                            </Link>

                            {/* Customer Card */}

                            <Link
                                to="/customer-registration" // <-- Yahan apna route dein (e.g. signup ya farmer page)
                                className="block no-underline" // Link ko block banayein taaki styling sahi rahe
                            >
                                <div className="group relative flex flex-col items-center p-6 bg-white dark:bg-[#1a2e22] rounded-2xl border-2 border-transparent hover:border-orange-500 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">shopping_basket</span>
                                    </div>
                                    <h3 className="font-bold text-[#0e1b13] dark:text-white mb-1">I am a Customer</h3>
                                    <p className="text-xs text-center text-gray-500 mb-4 dark:text-gray-400">Order Fresh Veggies</p>
                                    <button className="w-full py-2 rounded-full bg-orange-500 text-white text-sm font-bold">JOIN</button>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyGxXHP4HHTGuUsJJYIW93tS0N6PZH8WFU6aCk__hZT7ENCbUoVX1sQX16Uq1NRYt76NE63vIpSTKZl_7pozVEWnCsy4RKzHysiH_4opVH4X4gW-pScKqmOFHmSAaBqL-UCV3nyfZKvA_U5k33cbyRgpuNeDd6Jiw1KYGkqVpQxWB0jwF_6SmhKthbem8CuVo3x3GFdG5WCwMZq0Ar3-mJqjmbnz3DGmOmojzJYO86TZvd3SRLdTdRBXxeWHF7SVhKFtCgX-wVUU4')` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                            <span className="material-symbols-outlined">verified</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Verified Quality</p>
                                            <p className="text-sm font-bold text-[#0e1b13]">100% Organic & Fresh</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection;