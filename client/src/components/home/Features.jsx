import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'diversity_3',
      title: 'Verified Community',
      description: '100% KYC verified Farmers and Vendors for a safe and trusted trading environment.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: 'currency_rupee',
      title: 'Live Mandi Rates',
      description: 'Real-time APMC market prices to help you negotiate better and sell smarter.',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: 'local_shipping',
      title: 'Integrated Logistics',
      description: 'We handle the pickup from farm gate to vendor doorstep. No transport hassle.',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      icon: 'verified_user',
      title: 'Digital Traceability',
      description: 'Scan QR code to see the farm origin, harvest date, and farmer profile.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl mb-4">
            Powerful Features, <span className="text-gray-400">Simple to Use</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to buy and sell agricultural produce efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6`}>
                <span className={`material-symbols-outlined text-3xl ${feature.color}`}>
                  {feature.icon}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;