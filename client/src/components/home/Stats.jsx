import React from 'react';

const Stats = () => {
  const stats = [
    { value: '5,000+', label: 'Farmers' },
    { value: '10,000+', label: 'Tons Sold' },
    { value: '500+', label: 'Pincodes' }
  ];

  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {stats.map((stat, index) => (
            <div key={index} className="py-12 text-center">
              <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{stat.value}</p>
              <p className="text-gray-500 font-medium uppercase tracking-wide text-xs md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;