import React from 'react';
import StatsGrid, { FARMER_STATS_THEME } from '../../common/Dashboard/StatsGrid';

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
      accentBg: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Active Products',
      value: products,
      sub: 'Items Listed',
      icon: 'inventory_2',
      emoji: '📦',
      gradient: 'from-blue-500 to-indigo-600',
      accentBg: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      sub: 'Awaiting Action',
      icon: 'shopping_cart',
      emoji: '🛒',
      gradient: 'from-amber-500 to-orange-600',
      accentBg: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      label: 'Avg. Rating',
      value: rating.toFixed(1),
      sub: 'Buyer Feedback',
      icon: 'star',
      emoji: '⭐',
      gradient: 'from-purple-500 to-violet-600',
      accentBg: 'bg-purple-50',
      textColor: 'text-purple-700',
      isRating: true,
      ratingValue: rating,
    },
  ];

  return <StatsGrid cards={cards} theme={FARMER_STATS_THEME} />;
};

export default StatsCards;