import React from 'react';

const HowItWorks = () => {
  const steps = [
    { num: '01', title: 'List Produce', desc: 'Farmers upload photos and details of their fresh harvest in seconds.', icon: 'add_a_photo', emoji: '📸', gradient: 'from-green-400 to-emerald-500' },
    { num: '02', title: 'Buyers Order', desc: 'Customers and Vendors place orders at live market rates.', icon: 'shopping_cart_checkout', emoji: '🛒', gradient: 'from-blue-400 to-indigo-500' },
    { num: '03', title: 'Fast Delivery', desc: 'We pick up from farm and deliver to home or shop.', icon: 'local_shipping', emoji: '🚚', gradient: 'from-amber-400 to-orange-500' },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full text-blue-700 text-xs font-bold mb-4">
            <span className="material-symbols-outlined text-sm">route</span>
            Simple Process
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
            How It Works
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-lg mx-auto">
            Three simple steps for everyone — from farm to doorstep.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto relative">
          {/* Connector Line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-green-200 via-blue-200 to-orange-200" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Step Number + Icon */}
              <div className="relative z-10 mb-4 sm:mb-6">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl`}>
                  <span className="text-2xl sm:text-3xl">{step.emoji}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-slate-100 flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-black text-slate-500">{step.num}</span>
                </div>
              </div>

              {/* Card */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow w-full">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;