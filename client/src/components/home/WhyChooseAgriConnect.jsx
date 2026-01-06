import React from 'react';

const WhyChooseAgriConnect = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Old Way vs <span className="text-green-600">New Way</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            See why thousands of farmers and customers are switching to AgriConnect.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Old Way */}
          <div className="p-8 rounded-3xl border border-red-100 bg-red-50/50">
            <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">cancel</span>
              Traditional Mandi
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-1">remove</span>
                <span className="text-gray-700">Middlemen take 30-40% commission</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-1">remove</span>
                <span className="text-gray-700">Payment delays of weeks or months</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 mt-1">remove</span>
                <span className="text-gray-700">Vegetables lose freshness in transit</span>
              </li>
            </ul>
          </div>

          {/* New Way */}
          <div className="p-8 rounded-3xl border border-green-100 bg-green-50 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              AgriConnect
            </h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-600 mt-1">add</span>
                <span className="text-gray-900 font-medium">0% Commission (Direct Profits)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-600 mt-1">add</span>
                <span className="text-gray-900 font-medium">Instant Payment upon Delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-600 mt-1">add</span>
                <span className="text-gray-900 font-medium">Farm-fresh produce (Harvested {'<'} 24hrs)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseAgriConnect;