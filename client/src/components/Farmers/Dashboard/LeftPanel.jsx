import React from 'react';

const LeftPanel = () => {
  return (
    <div className="lg:col-span-8 flex flex-col gap-6">
      
      {/* Revenue Analytics */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Revenue Analytics</h3>
            <p className="text-sm text-slate-500">Last 30 days performance</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold">
              <button className="px-3 py-1 bg-white text-slate-800 rounded shadow-sm">Daily</button>
              <button className="px-3 py-1 text-slate-500 hover:bg-white/50 rounded">Weekly</button>
              <button className="px-3 py-1 text-slate-500 hover:bg-white/50 rounded">Monthly</button>
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </div>
        <div className="h-64 w-full flex items-end justify-between gap-2 px-8 pb-1 border-b border-slate-200 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-slate-400">
            <div className="border-t border-dashed border-slate-200 w-full pt-1">₹50k</div>
            <div className="border-t border-dashed border-slate-200 w-full pt-1">₹25k</div>
            <div className="border-t border-dashed border-slate-200 w-full pt-1">₹10k</div>
            <div className="border-t border-dashed border-slate-200 w-full pt-1">0</div>
          </div>
          {/* Chart Bars */}
          <div className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm relative group" style={{height: '40%'}}>
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none">₹20k</div>
          </div>
          <div className="w-full bg-primary/30 hover:bg-primary/50 transition-all rounded-t-sm relative group" style={{height: '65%'}}>
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none">₹32k</div>
          </div>
          <div className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm relative group" style={{height: '45%'}}></div>
          <div className="w-full bg-primary/40 hover:bg-primary/60 transition-all rounded-t-sm relative group" style={{height: '80%'}}>
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none">₹40k</div>
          </div>
          <div className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm relative group" style={{height: '30%'}}></div>
          <div className="w-full bg-primary/30 hover:bg-primary/50 transition-all rounded-t-sm relative group" style={{height: '55%'}}></div>
          <div className="w-full bg-primary/50 hover:bg-primary/70 transition-all rounded-t-sm relative group" style={{height: '90%'}}>
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none">₹45k</div>
          </div>
        </div>
      </div>

      {/* Live Order Tracking */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Live Order Tracking</h3>
          <a href="#" className="text-sm text-primary-dark font-semibold">View All</a>
        </div>
        <div className="relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200"></div>
          {/* Item 1 */}
          <div className="relative pl-16 py-2 mb-4">
            <div className="absolute left-4 top-3 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100"></div>
            <div className="flex justify-between items-start bg-white/50 p-4 rounded-md border border-slate-100">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">ORDER #8832 • Just Now</p>
                <h4 className="font-bold text-slate-800">Delivered to Vendor</h4>
                <p className="text-sm text-slate-600">50kg Potatoes received by ABC Mart.</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Completed</span>
            </div>
          </div>
          {/* Item 2 */}
          <div className="relative pl-16 py-2">
            <div className="absolute left-4 top-3 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/50 p-4 rounded-md border border-slate-100 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1">ORDER #8834 • 30 mins ago</p>
                <h4 className="font-bold text-slate-800">Ready for Pickup</h4>
                <p className="text-sm text-slate-600">200 Bunches of Spinach packed.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-slate-900 text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-all">Mark Picked</button>
                <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
                  <span className="material-symbols-outlined text-xl">print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Prices */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">analytics</span>
            Market Prices (Live)
          </h3>
          <p className="text-xs text-slate-400">Updated: 10:00 AM</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="pb-3 pl-2">Crop</th>
                <th className="pb-3">Market Avg</th>
                <th className="pb-3">Your Price</th>
                <th className="pb-3">Trend</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 pl-2 font-medium">Tomato (Desi)</td>
                <td className="py-3">₹18/kg</td>
                <td className="py-3 text-green-700 font-bold">₹20/kg</td>
                <td className="py-3"><span className="text-green-600 flex items-center text-xs font-bold"><span className="material-symbols-outlined text-sm">arrow_upward</span> +5%</span></td>
                <td className="py-3 pr-2 text-right"><button className="text-blue-600 font-semibold text-xs hover:underline">Update</button></td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 pl-2 font-medium">Onion (Red)</td>
                <td className="py-3">₹25/kg</td>
                <td className="py-3 text-red-600 font-bold">₹28/kg</td>
                <td className="py-3"><span className="text-red-500 flex items-center text-xs font-bold"><span className="material-symbols-outlined text-sm">arrow_downward</span> -2%</span></td>
                <td className="py-3 pr-2 text-right"><button className="text-blue-600 font-semibold text-xs hover:underline">Update</button></td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 pl-2 font-medium">Okra</td>
                <td className="py-3">₹40/kg</td>
                <td className="py-3 text-slate-600 font-bold">₹40/kg</td>
                <td className="py-3"><span className="text-slate-400 flex items-center text-xs font-bold"><span className="material-symbols-outlined text-sm">remove</span> 0%</span></td>
                <td className="py-3 pr-2 text-right"><button className="text-blue-600 font-semibold text-xs hover:underline">Update</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Lower Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <div className="glass-panel p-6 rounded-2xl soft-shadow md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Search..." className="bg-white border-slate-200 rounded-lg text-sm py-1.5 px-3 focus:ring-green-500 focus:border-green-500" />
              <button className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-600 hover:bg-slate-50">
                <span className="material-symbols-outlined text-sm">filter_list</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500 font-semibold rounded-lg">
                <tr>
                  <th className="p-3 rounded-l-lg">Order ID</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-mono text-xs">#ORD-9921</td>
                  <td className="p-3 font-medium">Fresh Mart</td>
                  <td className="p-3">Tomato (50kg)</td>
                  <td className="p-3 font-bold">₹1,000</td>
                  <td className="p-3"><span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">Pending</span></td>
                  <td className="p-3 text-slate-400 hover:text-slate-600 cursor-pointer"><span className="material-symbols-outlined text-lg">visibility</span></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-mono text-xs">#ORD-9920</td>
                  <td className="p-3 font-medium">City Veggies</td>
                  <td className="p-3">Spinach (100b)</td>
                  <td className="p-3 font-bold">₹1,500</td>
                  <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Completed</span></td>
                  <td className="p-3 text-slate-400 hover:text-slate-600 cursor-pointer"><span className="material-symbols-outlined text-lg">visibility</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-panel p-6 rounded-2xl soft-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Products</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBq_PcKdHAV-xvZ5XxrpKXB3QRdK-M6z-VAKGf6Smqb3y0LHjZKlU_CEdYXtA2p2tYpbkT5Rb2YAhRF84D_0YJHVxFxyMf3m6MuJo3YCglXXWw1z-ccBOLQBW1O7Pj9OtLffmTxl6KjuTxq5uMFDXeQMnJ5H4ISM1z1r7B8IXU8NgkAHy4B6jKlyUk0w6uV6lYBLgKJEcaGvg7obf-_2adr2J33GvYupa6G9vm5D8-b54LcpJI6SCvIxKog8vzrDX2Tg2xBBawpe0c')"}}></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold text-slate-700">Tomato</h4>
                  <span className="text-green-600 font-bold">₹12k</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-lg bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCSNMmuHmsw1VNIKitnqsFDZDgyJVc-i0DViCHylmp9PSu0A76uA_HYnbNzoGlVbFufWFwtixZ-R-udpUrfEZ91-NaxzCv9BvmjM0AlM1qV8X_cDsXNbcFUixV3w3jO3NSRx-SAM2F9HS3DsYvfgtvQHoSsG-3v1w0MBoXwIw8djV9aKneUshpGqxxEirqkMBd1LIsC3JFAaLFH0lo0eXq74ROj6dBAxYN5dOQe53DfIPDpMj7iyNazFHsenyiXIbD0VtQAcJIXQAg')"}}></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold text-slate-700">Potato</h4>
                  <span className="text-green-600 font-bold">₹8.5k</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="glass-panel p-6 rounded-2xl soft-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Reviews</h3>
            <span className="text-sm font-bold text-slate-500">4.8/5</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between items-start">
                <div className="flex gap-1 text-yellow-400">
                  <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                  <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                  <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                  <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                  <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                </div>
                <span className="text-[10px] text-slate-400">2d ago</span>
              </div>
              <p className="text-sm text-slate-600 mt-1 italic">"Excellent quality tomatoes. Very fresh!"</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">- Rameshwar Gupta</p>
            </div>
          </div>
          <button className="w-full mt-3 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium">View All Reviews</button>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;