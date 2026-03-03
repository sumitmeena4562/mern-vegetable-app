import React from 'react';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';

const AdditionalDetails = ({ data, onChange }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl soft-shadow space-y-6 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200/40">
          <span className="material-symbols-outlined text-white text-lg">local_shipping</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 leading-none">Logistics & Handling</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Delivery Settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-1">
          <Input
            label="Min Order Qty"
            type="number"
            value={data.minOrder}
            onChange={(e) => onChange('minOrder', e.target.value)}
            placeholder="1"
            icon="shopping_basket"
            className="rounded-xl py-3 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-1">
          <Select
            label="Packaging Type"
            value={data.packaging}
            onChange={(e) => onChange('packaging', e.target.value)}
            icon="package_2"
            options={[
              { value: 'Jute Bags', label: 'Jute Bags (Bori)' },
              { value: 'Plastic Crates', label: 'Plastic Crates' },
              { value: 'Cardboard Boxes', label: 'Cardboard Boxes' },
              { value: 'Net Bags', label: 'Net Bags' }
            ]}
            className="rounded-xl py-3 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-1">
          <Select
            label="Shelf Life"
            value={data.shelfLife}
            onChange={(e) => onChange('shelfLife', e.target.value)}
            icon="hourglass_top"
            options={[
              '1-2 Days',
              '3-5 Days',
              '1 Week'
            ]}
            className="rounded-xl py-3 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-1">
          <Select
            label="Pickup Slot"
            value={data.pickupSlot}
            onChange={(e) => onChange('pickupSlot', e.target.value)}
            icon="schedule"
            options={[
              'Morning (8 AM - 11 AM)',
              'Afternoon (12 PM - 3 PM)',
              'Evening (5 PM - 8 PM)'
            ]}
            className="rounded-xl py-3 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Trust Badge - Synced with Dashboard Secondary Cards */}
      <div className="pt-2">
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between group/washed transition-all hover:bg-white hover:shadow-lg hover:shadow-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover/washed:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">water_drop</span>
            </div>
            <div>
              <p className="font-black text-slate-800 text-sm">Washed & Clean</p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Premium Trust Badge</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer active:scale-[0.9] transition-transform">
            <input
              type="checkbox"
              checked={data.isWashed}
              onChange={(e) => onChange('isWashed', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetails;