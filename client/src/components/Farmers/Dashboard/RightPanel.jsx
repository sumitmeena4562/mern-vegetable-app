import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { updateProductStatus } from '@/api/userApi';
import { toast } from 'react-hot-toast';

const RightPanel = ({ isNew, orders, products: initialProducts }) => {
  const navigate = useNavigate();
  const [todayOrders, setTodayOrders] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [products, setProducts] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orders) {
      const today = new Date().toDateString();
      const pickups = orders
        .filter(o => ['confirmed', 'processing', 'ready_for_pickup'].includes(o.status))
        .filter(o => {
          const orderDate = new Date(o.createdAt).toDateString();
          return orderDate === today;
        })
        .slice(0, 3);
      setTodayOrders(pickups);
      setLoadingOrders(false);
    }
  }, [orders]);

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts.slice(0, 3));
    }
  }, [initialProducts]);

  const handleToggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    setUpdatingId(productId);
    try {
      const res = await updateProductStatus(productId, newStatus);
      if (res.success) {
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, status: newStatus } : p));
        toast.success(`Inventory updated: ${newStatus === 'available' ? 'Now Available' : 'Marked Out of Stock'}`);
      }
    } catch (error) {
      toast.error("Failed to update stock status");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- Fetch weather using Open-Meteo (free, no API key needed) ---
  const fetchWeather = async () => {
    try {
      // Try to get farmer's location from profile
      const profileRes = await api.get('/farmers/profile');
      let lat = 20.59, lon = 78.96; // Default: India center
      let cityName = 'India';

      if (profileRes.data?.success) {
        const farmer = profileRes.data.data;
        if (farmer.location?.coordinates?.length === 2) {
          lon = farmer.location.coordinates[0];
          lat = farmer.location.coordinates[1];
        }
        cityName = farmer.farmName || farmer.address?.city || 'Your Farm';
      }

      // Open-Meteo free API — no key needed
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
      );
      const wData = await weatherRes.json();

      if (wData.current) {
        setWeather({
          temp: Math.round(wData.current.temperature_2m),
          code: wData.current.weather_code,
          location: cityName,
          description: getWeatherDescription(wData.current.weather_code),
          icon: getWeatherIcon(wData.current.weather_code)
        });
      }
    } catch (e) {
      console.error('Weather fetch error:', e);
    }
  };

  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rain Showers';
    if (code <= 86) return 'Snow Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown';
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return 'wb_sunny';
    if (code <= 3) return 'partly_cloudy_day';
    if (code <= 48) return 'foggy';
    if (code <= 67) return 'rainy';
    if (code <= 77) return 'ac_unit';
    if (code <= 86) return 'weather_snowy';
    if (code >= 95) return 'thunderstorm';
    return 'cloud';
  };

  const getStatusBadge = (status) => {
    const map = {
      confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
      processing: { label: 'Processing', color: 'bg-amber-100 text-amber-700' },
      ready_for_pickup: { label: 'Ready', color: 'bg-green-100 text-green-700' },
    };
    const s = map[status] || { label: status, color: 'bg-slate-100 text-slate-600' };
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>;
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="lg:col-span-4 flex flex-col gap-6">

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-[32px] shadow-xl shadow-slate-200/20">
        <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/farmer-dashboard/add-sabji')}
            className="col-span-2 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
          >
            <span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">add</span>
            Add New Sabji
          </button>
          <button
            onClick={() => navigate('/farmer-dashboard/inventory')}
            className="p-3 bg-white border border-slate-200 hover:border-green-300 hover:text-green-700 text-slate-600 rounded-2xl font-bold text-sm flex flex-col items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Manage Stock
          </button>
          <button
            onClick={() => navigate('/farmer-dashboard/orders')}
            className="p-3 bg-white border border-slate-200 hover:border-green-300 hover:text-green-700 text-slate-600 rounded-2xl font-bold text-sm flex flex-col items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined">local_shipping</span>
            View Orders
          </button>
        </div>
      </div>

      {/* Quick Stock Update */}
      {!isNew && products.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-[32px] shadow-xl shadow-slate-200/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Quick Stock Update</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent</span>
          </div>
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xl overflow-hidden shadow-sm">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400">image</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">{product.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">₹{product.price}/{product.unit}</p>
                  </div>
                </div>
                <button
                  disabled={updatingId === product._id}
                  onClick={() => handleToggleStatus(product._id, product.status)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${product.status === 'available'
                    ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                    : 'bg-slate-200 text-slate-500 border border-slate-300 hover:bg-slate-300'
                    } ${updatingId === product._id ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {updatingId === product._id ? 'Updating...' : product.status === 'available' ? 'Available' : 'Sold Out'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Pickups — Real Data */}
      {!isNew && (
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-[32px] shadow-xl shadow-slate-200/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Today's Pickups</h3>
            {todayOrders.length > 0 && (
              <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
                {todayOrders.length} Pending
              </span>
            )}
          </div>

          {loadingOrders ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-16 bg-slate-100 rounded-2xl"></div>
              <div className="h-16 bg-slate-100 rounded-2xl"></div>
            </div>
          ) : todayOrders.length > 0 ? (
            <div className="flex flex-col gap-3">
              {todayOrders.map((order) => (
                <div key={order._id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors">
                  <div className="bg-white p-2 rounded-xl text-slate-500 font-bold text-center min-w-[3.5rem] border border-slate-100">
                    <span className="block text-[10px] uppercase text-slate-400">Today</span>
                    <span className="block text-sm font-black text-slate-800">{formatTime(order.createdAt)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{order.buyer?.fullName || 'Buyer'}</h4>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      Order #{order.orderId || order._id.slice(-6)} • {order.products?.length || 0} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-3xl text-slate-300 mb-2 block">event_available</span>
              <p className="text-sm text-slate-400 font-medium">No pickups scheduled today</p>
            </div>
          )}
        </div>
      )}

      {/* Weather Widget — Real Data */}
      {weather ? (
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-40"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-blue-100 text-xs font-bold">{weather.location}</p>
                <h3 className="text-3xl font-black">{weather.temp}°C</h3>
                <p className="text-sm font-bold text-white/80">{weather.description}</p>
              </div>
              <span className="material-symbols-outlined text-4xl text-yellow-300">{weather.icon}</span>
            </div>
            {weather.temp > 35 && (
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/10 mt-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-yellow-300 text-lg mt-0.5">warning</span>
                  <p className="text-xs font-bold text-white/90 leading-relaxed">High temperature alert. Keep crops hydrated and use shade nets.</p>
                </div>
              </div>
            )}
            {weather.description.includes('Rain') && (
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/10 mt-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-yellow-300 text-lg mt-0.5">umbrella</span>
                  <p className="text-xs font-bold text-white/90 leading-relaxed">Rain expected. Cover harvested produce and check drainage.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[32px] p-6 text-white animate-pulse">
          <div className="h-6 bg-white/20 rounded w-20 mb-2"></div>
          <div className="h-10 bg-white/20 rounded w-16 mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-28"></div>
        </div>
      )}

      {/* Seasonal Tips — Dynamic based on month */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-[32px] shadow-xl shadow-slate-200/20">
        <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Seasonal Tips</h3>
        <div className="space-y-3">
          {getSeasonalTips().map((tip, idx) => (
            <div key={idx} className={`p-3 ${tip.bg} rounded-2xl border ${tip.border} flex items-start gap-3`}>
              <span className={`material-symbols-outlined ${tip.iconColor} text-lg mt-0.5`}>{tip.icon}</span>
              <p className={`text-xs font-bold ${tip.textColor} leading-relaxed`}>{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// --- Month-based tips instead of hardcoded ---
const getSeasonalTips = () => {
  const month = new Date().getMonth(); // 0-11

  if (month >= 2 && month <= 4) { // Mar-May (Summer)
    return [
      { icon: 'water_drop', text: 'Increase irrigation frequency — summer heat can dry soil fast.', bg: 'bg-blue-50', border: 'border-blue-100', iconColor: 'text-blue-500', textColor: 'text-blue-700' },
      { icon: 'wb_sunny', text: 'Use mulching to retain moisture and protect root systems.', bg: 'bg-amber-50', border: 'border-amber-100', iconColor: 'text-amber-500', textColor: 'text-amber-700' },
    ];
  }
  if (month >= 5 && month <= 8) { // Jun-Sep (Monsoon)
    return [
      { icon: 'umbrella', text: 'Ensure proper drainage to prevent waterlogging during monsoon.', bg: 'bg-green-50', border: 'border-green-100', iconColor: 'text-green-500', textColor: 'text-green-700' },
      { icon: 'bug_report', text: 'Watch for fungal infections — humid weather increases disease risk.', bg: 'bg-orange-50', border: 'border-orange-100', iconColor: 'text-orange-500', textColor: 'text-orange-700' },
    ];
  }
  if (month >= 9 && month <= 10) { // Oct-Nov (Post-Monsoon)
    return [
      { icon: 'eco', text: 'Great time to plant rabi crops — wheat, mustard, peas.', bg: 'bg-green-50', border: 'border-green-100', iconColor: 'text-green-500', textColor: 'text-green-700' },
      { icon: 'compost', text: 'Add compost or manure to replenish monsoon-depleted soil.', bg: 'bg-amber-50', border: 'border-amber-100', iconColor: 'text-amber-500', textColor: 'text-amber-700' },
    ];
  }
  // Nov-Feb (Winter)
  return [
    { icon: 'ac_unit', text: 'Protect seedlings from frost — use plastic covers at night.', bg: 'bg-cyan-50', border: 'border-cyan-100', iconColor: 'text-cyan-500', textColor: 'text-cyan-700' },
    { icon: 'local_florist', text: 'February is ideal for planting summer vegetables like tomatoes & okra.', bg: 'bg-green-50', border: 'border-green-100', iconColor: 'text-green-500', textColor: 'text-green-700' },
  ];
};

export default RightPanel;