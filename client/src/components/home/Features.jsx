import React from 'react';

const Features = () => {
  const features = [
    { icon: 'diversity_3', title: 'Verified Community', description: '100% KYC verified Farmers and Vendors for safe trading.', emoji: '🤝', gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
    { icon: 'currency_rupee', title: 'Live Mandi Rates', description: 'Real-time APMC market prices for smarter selling.', emoji: '📈', gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
    { icon: 'local_shipping', title: 'Smart Logistics', description: 'Farm gate to vendor doorstep — zero transport hassle.', emoji: '🚛', gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50' },
    { icon: 'verified_user', title: 'QR Traceability', description: 'Scan QR code to see farm origin and harvest date.', emoji: '🔍', gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-50' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full text-purple-700 text-xs font-bold mb-4">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Features
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
            Powerful Features, <span className="text-slate-300">Simple to Use</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-lg mx-auto">
            Everything you need to buy and sell agricultural produce efficiently.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {features.map((feature, index) => (
            <div key={index}
              className="group bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="text-xl sm:text-2xl">{feature.emoji}</span>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-slate-800 mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;