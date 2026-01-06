import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Farmers List',
      desc: 'Farmers record voice notes or list stock availability.',
      icon: 'mic'
    },
    {
      num: '02',
      title: 'Buyers Order',
      desc: 'Customers and Vendors place orders at market rates.',
      icon: 'shopping_cart_checkout'
    },
    {
      num: '03',
      title: 'Fast Delivery',
      desc: 'We pick up from farm and deliver to home or shop.',
      icon: 'local_shipping'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900">How It Works</h2>
          <p className="text-gray-600 mt-2">Simple process for everyone.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
              )}

              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm mb-6 z-10">
                <span className="material-symbols-outlined text-3xl text-green-600">{step.icon}</span>
              </div>

              <span className="text-sm font-bold text-green-600 mb-2">Step {step.num}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;