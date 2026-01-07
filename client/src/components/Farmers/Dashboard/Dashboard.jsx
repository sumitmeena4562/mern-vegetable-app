import React, { useState, useEffect } from 'react';
import StatsGrid from './StatsGrid';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { getFullProfile } from '@/api/userApi';

const Dashboard = () => {

  const [fullData, setFullData] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getFullProfile();
        console.log(result);
        setFullData(result.data);
      } catch (error) {
        console.error("User Data Not found!", error);
      }
    };
    loadData();
  }, []);

  if (!fullData) return <div>Loading...</div>;
  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Good Morning, {fullData.user?.fullName}! ☀️</h2>
          <p className="text-slate-500 font-medium mt-1">Here is your farm's performance summary for today.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white/60 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600">check_circle</span>
            Tasks: 4/5 Done
          </div>
          <div className="px-4 py-2 bg-white/60 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">local_shipping</span>
            Next Pickup: 2:00 PM
          </div>
        </div>
      </div>

      {/* Grid Components */}
      <StatsGrid />

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

export default Dashboard;