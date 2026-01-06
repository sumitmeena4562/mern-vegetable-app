import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section id="home" className="relative pt-16 pb-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content Left */}
                    <div className="text-center lg:text-left z-10">
                        <div className="inline-block px-4 py-2 bg-green-50 rounded-full mb-6">
                            <span className="text-green-700 font-semibold text-sm tracking-wide uppercase">
                                Direct • Fresh • Transparent
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                            Connecting <span className="text-green-600">Farmers, Vendors</span> & Customers.
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            India's first unified platform where Farmers sell directly, Vendors buy in bulk, and Customers get fresh produce at fair prices.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-3">
                            {/* Customer CTA */}
                            <Link
                                to="/customer-registration"
                                className="group p-4 rounded-xl border-2 border-green-100 hover:border-green-600 hover:bg-green-50 transition-all text-center"
                            >
                                <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-2 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">shopping_basket</span>
                                </div>
                                <h3 className="font-bold text-gray-900">Customer</h3>
                                <p className="text-xs text-gray-500">Buy Fresh</p>
                            </Link>

                            {/* Farmer CTA */}
                            <Link
                                to="/farmer-registration"
                                className="group p-4 rounded-xl border-2 border-green-100 hover:border-green-600 hover:bg-green-50 transition-all text-center"
                            >
                                <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-2 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">agriculture</span>
                                </div>
                                <h3 className="font-bold text-gray-900">Farmer</h3>
                                <p className="text-xs text-gray-500">Sell Produce</p>
                            </Link>

                            {/* Vendor CTA */}
                            <Link
                                to="/vendor-registration"
                                className="group p-4 rounded-xl border-2 border-green-100 hover:border-green-600 hover:bg-green-50 transition-all text-center"
                            >
                                <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-2 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">storefront</span>
                                </div>
                                <h3 className="font-bold text-gray-900">Vendor</h3>
                                <p className="text-xs text-gray-500">Bulk Buy</p>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-green-600 text-lg">verified</span>
                                <span>Verified Profiles</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-green-600 text-lg">bolt</span>
                                <span>Fast Logistics</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Right */}
                    <div className="relative lg:h-[500px] w-full flex items-center justify-center">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-green-50 rounded-full opacity-50 blur-3xl -z-10"></div>

                        <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Farmer and Market"
                                className="object-cover h-full w-full"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;