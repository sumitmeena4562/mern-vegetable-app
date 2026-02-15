import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <>
            <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .anim-float { animation: float 6s ease-in-out infinite; }
        .anim-blob { animation: blob 8s ease-in-out infinite; }
        .anim-up-1 { animation: fadeUp 0.6s ease-out both; }
        .anim-up-2 { animation: fadeUp 0.6s ease-out 0.15s both; }
        .anim-up-3 { animation: fadeUp 0.6s ease-out 0.3s both; }
        .anim-up-4 { animation: fadeUp 0.6s ease-out 0.45s both; }
      `}</style>

            <section id="home" className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 overflow-hidden bg-gradient-to-b from-green-50/80 via-white to-white">

                {/* Background Blobs */}
                <div className="absolute top-20 -left-32 w-72 h-72 bg-green-200/30 rounded-full blur-3xl anim-blob" />
                <div className="absolute bottom-10 -right-32 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl anim-blob" style={{ animationDelay: '4s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                        {/* Content */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="anim-up-1 inline-flex items-center gap-2 px-4 py-2 bg-green-100/80 backdrop-blur-sm rounded-full mb-6">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-green-700 font-bold text-xs sm:text-sm tracking-wide uppercase">
                                    Farm to Fork — Direct & Fresh
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="anim-up-2 text-3xl sm:text-4xl lg:text-[3.25rem] font-black text-slate-900 leading-[1.15] mb-5">
                                Connecting{' '}
                                <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                                    Farmers
                                </span>
                                ,{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                    Vendors
                                </span>
                                {' '}& Customers.
                            </h1>

                            <p className="anim-up-3 text-base sm:text-lg text-slate-500 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                India's first unified platform — sell directly, buy in bulk, and get farm-fresh produce at fair prices. No middlemen.
                            </p>

                            {/* CTA Cards */}
                            <div className="anim-up-4 grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
                                {[
                                    { to: '/customer-registration', icon: 'shopping_basket', label: 'Customer', desc: 'Buy Fresh', gradient: 'from-green-500 to-emerald-600' },
                                    { to: '/farmer-registration', icon: 'agriculture', label: 'Farmer', desc: 'Sell Produce', gradient: 'from-amber-500 to-orange-600' },
                                    { to: '/vendor-registration', icon: 'storefront', label: 'Vendor', desc: 'Bulk Buy', gradient: 'from-blue-500 to-indigo-600' },
                                ].map(cta => (
                                    <Link key={cta.label} to={cta.to}
                                        className="group relative p-3 sm:p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 text-center active:scale-[0.96]">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gradient-to-br ${cta.gradient} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <span className="material-symbols-outlined text-white text-xl sm:text-2xl">{cta.icon}</span>
                                        </div>
                                        <h3 className="font-bold text-sm text-slate-800">{cta.label}</h3>
                                        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{cta.desc}</p>
                                    </Link>
                                ))}
                            </div>

                            {/* Trust Badges */}
                            <div className="anim-up-4 mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
                                {[
                                    { icon: 'verified', label: 'Verified Profiles' },
                                    { icon: 'bolt', label: 'Fast Logistics' },
                                    { icon: 'shield', label: 'Secure Payments' },
                                ].map(b => (
                                    <div key={b.label} className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm">
                                        <span className="material-symbols-outlined text-green-500 text-base sm:text-lg">{b.icon}</span>
                                        <span>{b.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative flex items-center justify-center mt-4 lg:mt-0">
                            {/* Glow behind image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-200/40 to-emerald-200/30 rounded-full blur-3xl scale-75" />

                            <div className="relative anim-float">
                                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/40 border-4 border-white/80 max-w-sm sm:max-w-md mx-auto">
                                    <img
                                        src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Fresh farm produce"
                                        className="object-cover w-full h-64 sm:h-80 lg:h-[420px]"
                                        loading="eager"
                                    />
                                </div>

                                {/* Floating Stats Card */}
                                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl shadow-xl shadow-slate-200/50 px-4 py-3 border border-slate-100"
                                    style={{ animation: 'fadeUp 0.6s ease-out 0.8s both' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-green-600">trending_up</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Farmers Earning</p>
                                            <p className="text-lg font-black text-slate-800">+40% <span className="text-green-500 text-xs font-bold">more</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 px-3 py-2 border border-slate-100"
                                    style={{ animation: 'fadeUp 0.6s ease-out 1s both' }}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🚚</span>
                                        <div>
                                            <p className="text-[10px] text-slate-400">Deliveries</p>
                                            <p className="text-sm font-black text-slate-800">15K+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;