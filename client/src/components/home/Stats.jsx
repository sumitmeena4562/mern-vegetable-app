import React from 'react';

const Stats = () => {
  const stats = [
    { value: '15,000+', label: 'Registered Farmers' },
    { value: '₹50 Cr+', label: 'Trade Volume' },
    { value: '25+', label: 'Districts Covered' }
  ];

  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {stats.map((stat, index) => (
            <div key={index} className="py-8 md:py-12 text-center">
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