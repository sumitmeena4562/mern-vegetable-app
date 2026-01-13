import React from 'react';

const LiveMarketRates = () => {
  const marketItems = [
    { icon: '🍅', name: 'Tomato', price: '₹20/kg', trend: '▼' },
    { icon: '🥔', name: 'Potato', price: '₹15/kg', trend: '▲' },
    { icon: '🧅', name: 'Onion', price: '₹30/kg', trend: '-' },
    { icon: '🥕', name: 'Carrot', price: '₹45/kg', trend: '▲' },
    { icon: '🌶️', name: 'Chili', price: '₹40/kg', trend: '▼' },
  ];

  return (
    <div id="market-rates" className="bg-gray-900 py-3 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-marquee">
        {marketItems.map((item, index) => (
          <span key={index} className="inline-flex items-center mx-8 text-sm font-medium text-gray-300">
            <span className="mr-2 text-lg">{item.icon}</span>
            {item.name}: <span className="text-white ml-1">{item.price}</span>
            <span className={`ml-2 ${item.trend === '▲' ? 'text-green-400' : 'text-red-400'}`}>{item.trend}</span>
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {marketItems.map((item, index) => (
          <span key={`dup-${index}`} className="inline-flex items-center mx-8 text-sm font-medium text-gray-300">
            <span className="mr-2 text-lg">{item.icon}</span>
            {item.name}: <span className="text-white ml-1">{item.price}</span>
            <span className={`ml-2 ${item.trend === '▲' ? 'text-green-400' : 'text-red-400'}`}>{item.trend}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LiveMarketRates;