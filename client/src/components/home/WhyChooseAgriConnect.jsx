import React from 'react';

const WhyChooseAgriConnect = () => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full text-green-700 text-xs font-bold mb-4">
            <span className="material-symbols-outlined text-sm">compare_arrows</span>
            Why Switch?
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
            Old Way vs <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">New Way</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            See why thousands of farmers and customers are switching to AgriConnect.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {/* Old Way */}
          <div className="p-5 sm:p-8 rounded-3xl border-2 border-red-100 bg-gradient-to-br from-red-50/50 to-white">
            <div className="flex items-center gap-2 mb-5 sm:mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500">close</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-red-800">Traditional Mandi</h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { icon: '💸', text: 'Middlemen take 30-40% commission' },
                { icon: '⏳', text: 'Payment delays of weeks or months' },
                { icon: '🥀', text: 'Vegetables lose freshness in transit' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-red-50/60 rounded-xl">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-slate-600 text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* New Way */}
          <div className="p-5 sm:p-8 rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/50 relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-4 right-4 px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
              Better ✓
            </div>
            <div className="flex items-center gap-2 mb-5 sm:mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-green-800">AgriConnect</h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { icon: '💰', text: '0% Commission — Direct Profits' },
                { icon: '⚡', text: 'Instant Payment upon Delivery' },
                { icon: '🥬', text: 'Farm-fresh produce (Harvested < 24hrs)' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-green-100/50 rounded-xl">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-slate-700 text-sm font-medium leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseAgriConnect;