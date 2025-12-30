import React from 'react';
import BasicInfo from '../../components/Farmers/Dashboard/add-sabji/BasicInfo';
import AdditionalDetails from '../../components/Farmers/Dashboard/add-sabji/AdditionalDetails';
import PhotoUpload from '../../components/Farmers/Dashboard/add-sabji/PhotoUpload';
import VisibilityCard from '../../components/Farmers/Dashboard/add-sabji/VisibilityCard';
const AddSabji = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-6">
      {/* Page Title & Actions (Desktop) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Add New Sabji</h1>
          <p className="text-slate-500 text-lg font-medium mt-2">List your fresh produce for sale to vendors. Simple and quick!</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button className="px-5 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button className="px-8 py-3 bg-primary text-slate-900 rounded-xl font-bold hover:bg-green-400 shadow-lg shadow-green-300/40 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            List Sabji Now
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Forms) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <BasicInfo />
          <AdditionalDetails />
        </div>

        {/* Right Column (Photos & Visibility) */}
        <div className="flex flex-col gap-6">
          <PhotoUpload />
          <VisibilityCard />
        </div>

      </div>

      {/* Mobile Actions */}
      <div className="md:hidden flex flex-col gap-3 pb-8">
        <button className="w-full py-4 bg-primary text-slate-900 rounded-xl font-bold hover:bg-green-400 shadow-lg shadow-green-300/40 transition-all flex items-center justify-center gap-2 text-lg">
          <span className="material-symbols-outlined">check_circle</span>
          List Sabji Now
        </button>
        <button className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddSabji;