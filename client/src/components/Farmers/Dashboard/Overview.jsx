import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { getFullProfile } from '@/api/userApi';
import DashboardSkeleton from './DashboardSkeleton';

const Overview = () => {

  const [fullData, setFullData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getFullProfile();
        console.log(result);
        if (result && result.data) {
          setFullData(result.data);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (error) {
        console.error("User Data Not found!", error);
        setError("Failed to load dashboard data. Please try again.");
      }
    };
    loadData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-64">
        <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Something went wrong</h3>
        <p className="text-slate-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!fullData) return <DashboardSkeleton />;
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 md:gap-8 relative z-10">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-100/40 via-transparent to-transparent pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none -z-10"></div>
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Good Morning, {fullData.user?.fullName}! ☀️</h2>
          <p className="text-slate-500 font-medium mt-1">Here is your farm's performance summary for today.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex-1 md:flex-none px-4 py-2 bg-white/60 backdrop-blur-md rounded-xl text-sm font-medium text-slate-700 border border-white/50 shadow-sm flex items-center justify-center gap-2 hover:bg-white/80 transition-colors">
            <span className="material-symbols-outlined text-green-600 text-[20px]">check_circle</span>
            Tasks: 4/5 Done
          </div>
          <div className="flex-1 md:flex-none px-4 py-2 bg-white/60 backdrop-blur-md rounded-xl text-sm font-medium text-slate-700 border border-white/50 shadow-sm flex items-center justify-center gap-2 hover:bg-white/80 transition-colors">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">local_shipping</span>
            Next Pickup: 2:00 PM
          </div>
        </div>
      </div>

      {/* Grid Components */}
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <LeftPanel />
        <RightPanel />
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm pb-8">
        <p>© 2024 Farm2Vendor. Supporting Indian Farmers.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-slate-600">Help Center</a>
          <a href="#" className="hover:text-slate-600">Privacy</a>
          <a href="#" className="hover:text-slate-600">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default Overview;