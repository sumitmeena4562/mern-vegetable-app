import React from 'react';

const LiveMarketRates = () => {
  const marketItems = [
    { icon: '🍅', name: 'Tomato', price: '₹20/kg', trend: '▲', up: true },
    { icon: '🥔', name: 'Potato', price: '₹15/kg', trend: '▲', up: true },
    { icon: '🧅', name: 'Onion', price: '₹30/kg', trend: '▼', up: false },
    { icon: '🥕', name: 'Carrot', price: '₹45/kg', trend: '▲', up: true },
    { icon: '🌶️', name: 'Chili', price: '₹40/kg', trend: '▼', up: false },
    { icon: '🫑', name: 'Capsicum', price: '₹35/kg', trend: '▲', up: true },
    { icon: '🥒', name: 'Cucumber', price: '₹18/kg', trend: '▲', up: true },
  ];

  const items = [...marketItems, ...marketItems];

  return (
    <>
      <style>{`
        @keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .ticker-track { animation: scroll 30s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>
      <div id="market-rates" className="bg-slate-900 py-3 overflow-hidden relative">
        {/* Live Badge */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-white text-[10px] font-black uppercase tracking-wider">Live</span>
        </div>

        <div className="ticker-track inline-flex whitespace-nowrap pl-20">
          {items.map((item, index) => (
            <span key={index} className="inline-flex items-center mx-5 sm:mx-8 text-sm font-medium text-slate-300">
              <span className="mr-1.5 text-base">{item.icon}</span>
              <span className="text-slate-400">{item.name}</span>
              <span className="text-white font-bold ml-1.5">{item.price}</span>
              <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-black ${item.up ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {item.trend}
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default LiveMarketRates;