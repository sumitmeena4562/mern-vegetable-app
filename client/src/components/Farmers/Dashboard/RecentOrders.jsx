import React from 'react';

const RecentOrders = () => {
  // Mock Data (Baad mein API se aayega)
  const orders = [
    { id: '#ORD-9921', buyer: 'Fresh Mart', item: 'Tomato (50kg)', amount: '₹1,000', status: 'Pending', statusColor: 'yellow' },
    { id: '#ORD-9920', buyer: 'City Veggies', item: 'Spinach (100b)', amount: '₹1,500', status: 'Completed', statusColor: 'green' },
    { id: '#ORD-9918', buyer: 'Big Basket', item: 'Okra (20kg)', amount: '₹800', status: 'Cancelled', statusColor: 'red' },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl soft-shadow md:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
        <button className="text-sm text-green-600 font-semibold hover:underline">See All</button>
      </div>

      {/* DESKTOP VIEW: Table (Hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold rounded-lg">
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
            {orders.map((order, index) => (
              <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="p-3 font-mono text-xs text-slate-500">{order.id}</td>
                <td className="p-3 font-medium">{order.buyer}</td>
                <td className="p-3">{order.item}</td>
                <td className="p-3 font-bold">{order.amount}</td>
                <td className="p-3">
                  <span className={`bg-${order.statusColor}-100 text-${order.statusColor}-700 px-2 py-0.5 rounded text-xs font-bold uppercase`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW: Cards (Visible only on small screens) */}
      <div className="md:hidden flex flex-col gap-3">
        {orders.map((order, index) => (
          <div key={index} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full">
                   <span className="material-symbols-outlined text-slate-600 text-xl">inventory_2</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{order.buyer}</h4>
                  <p className="text-xs text-slate-400 font-mono">{order.id}</p>
                </div>
              </div>
              <span className={`bg-${order.statusColor}-50 text-${order.statusColor}-700 border border-${order.statusColor}-100 px-2 py-1 rounded text-[10px] font-bold uppercase`}>
                {order.status}
              </span>
            </div>
            
            <div className="border-t border-dashed border-slate-100"></div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">{order.item}</span>
              <span className="font-bold text-slate-900">{order.amount}</span>
            </div>
            
            <button className="w-full py-2.5 mt-1 text-xs font-bold text-slate-700 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all">
              View Order Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;