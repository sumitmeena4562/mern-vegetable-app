import React from 'react';

/**
 * Shared StatsGrid component for dashboards.
 * 
 * @param {Array}  cards - Array of card objects:
 *   { label, value, sub, icon, emoji, gradient, bg, textColor, accentBg, isRating, ratingValue }
 * @param {object} theme - Generic theme settings:
 *   { gridGap, cardClass, iconContainerClass, subBadgeClass, valueClass }
 */

export const FARMER_STATS_THEME = {
    gridGap: 'gap-3 md:gap-4',
    cardClass: 'bg-white p-4 md:p-5 rounded-2xl border border-slate-100 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 group',
    iconContainerClass: 'w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform',
    subBadgeClass: 'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg',
    valueClass: 'text-2xl md:text-3xl font-black text-slate-800 tracking-tight',
    showMobileScroll: true
};

export const VENDOR_STATS_THEME = {
    gridGap: 'gap-4 md:gap-6',
    cardClass: 'animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/70 backdrop-blur-sm p-6 rounded-[2rem] border border-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(49,46,129,0.06)] hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden',
    iconContainerClass: 'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg',
    subBadgeClass: 'text-[10px] font-black uppercase tracking-widest',
    valueClass: 'text-2xl md:text-3xl font-black text-slate-900 tracking-tight',
    showMobileScroll: false,
    useVendorLayout: true // Vendor card has a sub-label above value
};

const StatsGrid = ({ cards, theme = FARMER_STATS_THEME }) => {
    const t = theme;

    const renderCard = (card, idx) => {
        if (t.useVendorLayout) {
            return (
                <div key={idx} className={t.cardClass} style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`${t.iconContainerClass} ${card.iconContainerBg || ''}`}>
                                <span className={`material-symbols-outlined text-[24px]`}>{card.icon}</span>
                            </div>
                            <div className="flex flex-col items-end text-right">
                                <span className={`${t.subBadgeClass} ${card.textColor} transition-colors line-clamp-1`}>{card.sub}</span>
                                <span className="text-xs mt-0.5">{card.emoji}</span>
                            </div>
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 line-clamp-1">{card.label}</p>
                        <h3 className={t.valueClass}>{card.value}</h3>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                </div>
            );
        }

        // Farmer / Default Layout
        return (
            <div key={idx} className={t.cardClass}>
                <div className="flex items-center justify-between mb-3">
                    <div className={`${t.iconContainerClass} bg-gradient-to-br ${card.gradient}`}>
                        <span className="text-lg">{card.emoji || <span className="material-symbols-outlined text-white">{card.icon}</span>}</span>
                    </div>
                    <span className={`${t.subBadgeClass} ${card.textColor} ${card.accentBg} line-clamp-1`}>
                        {card.sub}
                    </span>
                </div>
                <p className="text-xs font-medium text-slate-400 mb-1 line-clamp-1">{card.label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className={t.valueClass}>{card.value}</h3>
                    {card.isRating && card.ratingValue && (
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs ${i < Math.floor(card.ratingValue) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={`grid grid-cols-2 xl:grid-cols-4 ${t.gridGap} ${t.showMobileScroll ? 'hidden sm:grid' : 'grid'}`}>
                {cards.map((card, idx) => renderCard(card, idx))}
            </div>

            {t.showMobileScroll && (
                <div className="sm:hidden flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                    {cards.map((card, idx) => (
                        <div key={idx} className="flex-shrink-0 w-[75vw] snap-center">
                            {renderCard({ ...card, iconContainerBg: 'bg-white' }, idx)}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default StatsGrid;
