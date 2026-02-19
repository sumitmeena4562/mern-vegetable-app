import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { getFullProfile, getFarmerStats } from '@/api/userApi';
import WelcomeOnboarding from './WelcomeOnboarding';
import DashboardSkeleton from './DashboardSkeleton';

const Overview = () => {
  const [fullData, setFullData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [error, setError] = useState(null);

  const isNewFarmer = dashboardStats && dashboardStats.onboarding.productsCount === 0;

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
    return { text: 'Good Evening', emoji: '🌙' };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          getFullProfile(),
          getFarmerStats()
        ]);
        if (profileRes && profileRes.data) setFullData(profileRes.data);
        if (statsRes && statsRes.data) setDashboardStats(statsRes.data);
      } catch (error) {
        console.error("Dashboard Data Fetch error!", error);
        setError("Failed to load dashboard data. Please try again.");
      }
    };
    loadData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-64">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl text-red-400">error</span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Something went wrong</h3>
        <p className="text-slate-400 text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-200/40"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!fullData) return <DashboardSkeleton />;

  const greeting = getGreeting();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-4 md:gap-6 relative z-10 pb-20 xl:pb-8">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-blue-50/20 pointer-events-none -z-10" />

      {/* Welcome Section */}
      {!isNewFarmer && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
              {greeting.text}, {fullData.user?.fullName}! {greeting.emoji}
            </h2>
            <p className="text-slate-400 font-medium text-sm mt-1">
              Here's your farm's performance summary for today.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 border border-slate-100 flex items-center justify-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
              Tasks: 4/5
            </div>
            <div
              className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-xl text-xs font-bold text-blue-500 border border-blue-100 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:bg-blue-50 transition-all transition-transform active:scale-95"
              onClick={() => window.location.hash = '#/farmer-dashboard/analytics'}
            >
              <span className="material-symbols-outlined text-blue-500 text-base">monitoring</span>
              Market Insights
            </div>
          </div>
        </div>
      )}

      {/* Welcome Onboarding for New Farmers */}
      {isNewFarmer && (
        <WelcomeOnboarding
          userName={fullData.user?.fullName}
          stats={dashboardStats.onboarding}
        />
      )}

      {/* Dashboard Content */}
      {!isNewFarmer ? (
        <>
          <StatsCards stats={dashboardStats?.stats} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
            <LeftPanel />
            <RightPanel isNew={false} />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">analytics</span>
                  Current Market Rates
                </h3>
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg text-[10px] font-bold text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-400 font-semibold border-b border-slate-100 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="pb-3 pl-2">Crop</th>
                      <th className="pb-3">Market Avg</th>
                      <th className="pb-3">Trend</th>
                      <th className="pb-3 pr-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pl-2 font-medium">🍅 Tomato</td>
                      <td className="py-3">₹18/kg</td>
                      <td className="py-3">
                        <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs font-bold">▲ +5%</span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button className="text-green-600 font-bold text-xs hover:underline">List to Sell</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pl-2 font-medium">🧅 Onion</td>
                      <td className="py-3">₹25/kg</td>
                      <td className="py-3">
                        <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded text-xs font-bold">▼ -2%</span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button className="text-green-600 font-bold text-xs hover:underline">List to Sell</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-xl text-blue-600 text-xs font-medium border border-blue-100">
                💡 Start listing your products to get better prices and connect with vendors.
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <RightPanel isNew={true} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-4 md:mt-8 pt-6 border-t border-slate-100 text-center text-slate-300 text-xs pb-4">
        <p>© 2025 AgriConnect. Supporting Indian Farmers.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-slate-500 transition-colors">Help</a>
          <a href="#" className="hover:text-slate-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-500 transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default Overview;