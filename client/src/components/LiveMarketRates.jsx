import React from 'react'

const LiveMarketRates = () => {
  const marketItems = [
    { icon: '🍅', name: 'Tomato', price: '₹20/kg', trend: '▼', trendColor: 'text-red-600' },
    { icon: '🥔', name: 'Potato', price: '₹15/kg', trend: '▲', trendColor: 'text-green-600' },
    { icon: '🧅', name: 'Onion', price: '₹30/kg', trend: '-', trendColor: 'text-gray-500' },
    { icon: '🥕', name: 'Carrot', price: '₹45/kg', trend: '▲', trendColor: 'text-green-600' },
    { icon: '🥬', name: 'Spinach', price: '₹10/bunch', trend: '▼', trendColor: 'text-red-600' },
    { icon: '🍆', name: 'Brinjal', price: '₹25/kg', trend: '▲', trendColor: 'text-green-600' },
    { icon: '🥦', name: 'Broccoli', price: '₹80/kg', trend: '▲', trendColor: 'text-green-600' },
    { icon: '🌶️', name: 'Chili', price: '₹40/kg', trend: '▼', trendColor: 'text-red-600' },
  ]

  return (
    <div  id="market-rates" className="w-full bg-[#ccebd8] dark:bg-[#14532d] border-y border-green-200 dark:border-green-800 overflow-hidden py-3">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto hide-scrollbar flex items-center gap-8 whitespace-nowrap">
        {marketItems.map((item, index) => (
          <span key={index} className="flex items-center font-bold text-[#0e1b13] dark:text-white text-sm">
            <span className="mr-2 text-xl">{item.icon}</span> {item.name}: {item.price} <span className={`ml-1 ${item.trendColor}`}>{item.trend}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default LiveMarketRates;