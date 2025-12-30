// components/RecentOrders.jsx
import React from 'react';

const RecentOrders = () => {
  return (
    <div className="glass-panel p-6 rounded-3xl shadow-glass lg:col-span-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input 
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-xl border-gray-200 bg-gray-50 text-sm focus:border-green-500 focus:ring-green-500" 
              placeholder="Search orders..." 
              type="text"
            />
          </div>
          <button className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b border-gray-200">
              <th className="py-3 pl-4 font-medium">Order ID</th>
              <th className="py-3 font-medium">Buyer</th>
              <th className="py-3 font-medium">Items</th>
              <th className="py-3 font-medium">Amount</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* Order 1 */}
            <tr className="group hover:bg-green-50/30 transition-colors border-b border-gray-100">
              <td className="py-4 pl-4 font-mono text-gray-500">#8824</td>
              <td className="py-4">
                <div className="font-bold text-gray-900">Local Mandi Trader</div>
                <div className="text-xs text-gray-500">Nashik Main Market</div>
              </td>
              <td className="py-4 text-gray-600">Onion (250kg)</td>
              <td className="py-4 font-bold text-gray-900">₹7,500</td>
              <td className="py-4">
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">Pending Pickup</span>
              </td>
              <td className="py-4 pr-4 text-right">
                <button className="text-gray-400 hover:text-green-600 transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </td>
            </tr>
            
            {/* Order 2 */}
            <tr className="group hover:bg-green-50/30 transition-colors border-b border-gray-100">
              <td className="py-4 pl-4 font-mono text-gray-500">#8823</td>
              <td className="py-4">
                <div className="font-bold text-gray-900">Reliance Fresh</div>
                <div className="text-xs text-gray-500">Mumbai Hub</div>
              </td>
              <td className="py-4 text-gray-600">Tomato (100kg), Chilli (20kg)</td>
              <td className="py-4 font-bold text-gray-900">₹4,200</td>
              <td className="py-4">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">Completed</span>
              </td>
              <td className="py-4 pr-4 text-right">
                <button className="text-gray-400 hover:text-green-600 transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </td>
            </tr>
            
            {/* Order 3 */}
            <tr className="group hover:bg-green-50/30 transition-colors">
              <td className="py-4 pl-4 font-mono text-gray-500">#8822</td>
              <td className="py-4">
                <div className="font-bold text-gray-900">Swiggy Instamart</div>
                <div className="text-xs text-gray-500">Pune Dark Store</div>
              </td>
              <td className="py-4 text-gray-600">Spinach (200 bunches)</td>
              <td className="py-4 font-bold text-gray-900">₹2,000</td>
              <td className="py-4">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-bold">Cancelled</span>
              </td>
              <td className="py-4 pr-4 text-right">
                <button className="text-gray-400 hover:text-green-600 transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;