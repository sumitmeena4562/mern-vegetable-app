import React from 'react';

const StatsCards = ({ stats }) => {
  const earnings = stats?.totalEarnings?.toLocaleString('en-IN') || "0";
  const products = stats?.activeProducts || 0;
  const pendingOrders = stats?.pendingOrders || 0;
  const rating = stats?.rating || 0;

  const cards = [
    {
      label: 'Total Earnings',
      value: `₹${earnings}`,
      sub: 'Net Income',
      icon: 'payments',
      emoji: '💰',
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Active Products',
      value: products,
      sub: 'Items Listed',
      icon: 'inventory_2',
      emoji: '📦',
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      sub: 'Awaiting Action',
      icon: 'shopping_cart',
      emoji: '🛒',
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      label: 'Avg. Rating',
      value: rating.toFixed(1),
      sub: 'Buyer Feedback',
      icon: 'star',
      emoji: '⭐',
      gradient: 'from-purple-500 to-violet-600',
      bg: 'bg-purple-50',
      textColor: 'text-purple-700',
      isRating: true,
      ratingValue: rating,
    },
  ];

  return (
    <>
      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {cards.map((card, idx) => (
          <div key={idx}
            className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="text-lg">{card.emoji}</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${card.textColor} ${card.bg} px-2 py-1 rounded-lg`}>
                {card.sub}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 mb-1">{card.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{card.value}</h3>
              {card.isRating && (
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xs ${i < Math.floor(card.ratingValue) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="sm:hidden flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {cards.map((card, idx) => (
          <div key={idx}
            className="flex-shrink-0 w-[70vw] snap-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                <span className="text-lg">{card.emoji}</span>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">{card.label}</p>
                <h3 className="text-xl font-black text-slate-800">{card.value}</h3>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold ${card.textColor} ${card.bg} px-2 py-0.5 rounded-md`}>
                {card.sub}
              </span>
              {card.isRating && (
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xs ${i < Math.floor(card.ratingValue) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StatsCards;