import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GlobalSidebar from "../../components/common/GlobalSidebar";
import GlobalHeader from "../../components/common/GlobalHeader";
import Overview from "../../components/Farmers/Dashboard/Overview";
import FarmerOnboarding from "../../components/Farmers/Dashboard/FarmerOnboarding";
import AddSabji from "./AddSabji";
import Wallet from "../../components/Farmers/Dashboard/Wallet/Wallet";
import OrderManagement from "../../components/Farmers/Dashboard/Orders/OrderManagement";
import ProductInventory from "../../components/Farmers/Dashboard/Products/ProductInventory";
import Analytics from "../../components/Farmers/Dashboard/Analytics/Analytics";
import Notifications from "../../components/Farmers/Dashboard/notification/Notifications";
import Settings from "../../components/Farmers/Dashboard/Settings";
import api from "../../api/axios"; // Import centralized API instance
import useGeolocation from "../../hooks/useGeolocation";

// ============================================
// 🧠 HELPER FUNCTIONS
// ============================================

const extractUserName = (userData) => {
  if (!userData) return "Farmer";
  return userData.fullName || userData.name || userData.username || "Farmer";
};

const extractUserEmail = (userData) => {
  if (!userData) return "farmer@example.com";
  if (userData.email && userData.email.includes('@')) return userData.email;
  if (userData.mobile) return `${userData.mobile} @user.com`;
  if (userData.username) return `${userData.username} @user.com`;
  return "farmer@example.com";
};



const extractUserLocation = (userData) => {
  if (!userData) return { city: "", state: "", hasLocation: false };
  const city = userData.address?.city || userData.location?.address?.city || userData.city || "";
  const state = userData.address?.state || userData.location?.address?.state || userData.state || "";
  const village = userData.address?.village || userData.location?.address?.village || "";
  const fullAddress = userData.address?.fullAddress || userData.location?.address?.fullAddress || "";

  let displayAddress = fullAddress;
  if (!displayAddress) {
    const parts = [];
    if (village) parts.push(village);
    if (city) parts.push(city);
    if (state) parts.push(state);
    displayAddress = parts.join(", ");
  }
  return {
    city: city || "",
    state: state || "",
    fullAddress: displayAddress,
    hasLocation: !!displayAddress
  };
};

const fetchUserDataFromAPI = async (token) => {
  try {
    // Fixed: Removed space in URL and Header
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/me`,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
    );
    if (response.data.success) {
      return response.data.user || response.data.data?.user || response.data.data;
    }
    return null;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

// Location logic extracted to useGeolocation hook

// ============================================
// 🎯 MAIN COMPONENT
// ============================================

export default function FarmerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [onboardingComplete, setOnboardingComplete] = useState(null);

  const farmerNav = [
    { to: '/farmer-dashboard', icon: 'dashboard', label: 'Dashboard', exact: true },
    { to: '/farmer-dashboard/add-sabji', icon: 'add_circle', label: 'Add Product' },
    { to: '/farmer-dashboard/inventory', icon: 'inventory_2', label: 'Products' },
    { to: '/farmer-dashboard/orders', icon: 'shopping_cart', label: 'Orders' },
    { to: '/farmer-dashboard/wallet', icon: 'payments', label: 'Finance' },
    { to: '/farmer-dashboard/analytics', icon: 'monitoring', label: 'Analytics' },
  ];

  const farmerBottomNav = [
    { to: '/farmer-dashboard/settings', icon: 'settings', label: 'Settings' },
  ];

  const headerNavLinks = [
    { to: '/farmer-dashboard/settings', icon: 'person', label: 'Profile', dropdown: true },
    { to: '/farmer-dashboard/notifications', icon: 'notifications', label: 'Notifications', dropdown: true }
  ];


  const { userLocation, setUserLocation, loadUserLocation } = useGeolocation();

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();

  // Cleaned: Removed local api instance creation to rely on imported api with interceptors

  useEffect(() => {
    const initializeDashboard = async () => {
      if (authLoading) { setIsLoading(true); return; }
      try {
        await loadUserProfile();
        await checkOnboardingStatus();
        await loadUserLocation();
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const loadUserProfile = async () => {
    try {
      let userData = null;
      const token = localStorage.getItem("token");
      if (token) {
        try {
          userData = await fetchUserDataFromAPI(token);
          if (userData) localStorage.setItem("user", JSON.stringify(userData));
        } catch (apiError) {
          if ([401, 403, 404].includes(apiError.response?.status)) { handleLogout(); return; }
        }
      }
      if (!userData) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) userData = JSON.parse(storedUser);
      }
      if (!userData) { handleLogout(); return; }

      setName(extractUserName(userData));
      setEmail(extractUserEmail(userData));

      // Use already-fetched userData for location (no duplicate API call)
      const savedLoc = extractUserLocation(userData);

      if (savedLoc.hasLocation) {
        setUserLocation({
          city: savedLoc.city, state: savedLoc.state, fullAddress: savedLoc.fullAddress,
          loading: false, hasLocation: true, showAddLocation: false, error: null, errorMessage: ""
        });
      }
    } catch {
      setName("Farmer"); setEmail("farmer@example.com");
    }
  };

  // Location detection methods extracted to useGeolocation hook

  const [locationModal, setLocationModal] = useState({ show: false, city: '', state: '' });


  const handleLocationSave = () => {
    const { city, state } = locationModal;
    if (!city || !state) return;
    setUserLocation(prev => ({ ...prev, city, state, loading: false, hasLocation: true, showAddLocation: false, error: null, errorMessage: "" }));
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      parsed.city = city; parsed.state = state;
      localStorage.setItem("user", JSON.stringify(parsed));
    }
    setLocationModal({ show: false, city: '', state: '' });
  };

  const handleLogout = () => { if (logout) logout(); localStorage.clear(); navigate("/login"); };

  const getHeaderData = () => {
    if (location.pathname.includes("/add-sabji")) {
      return { title: "Add New Sabji", showBack: true, subtitle: "Add fresh vegetables to your inventory" };
    }
    if (location.pathname.includes("/wallet")) {
      return { title: "Finance & Wallet", showBack: true, subtitle: "Track your earnings and payouts" };
    }
    if (location.pathname.includes("/orders")) {
      return { title: "Active Orders", showBack: true, subtitle: "Manage your logistics and pickups" };
    }
    if (location.pathname.includes("/inventory")) {
      return { title: "Product Inventory", showBack: true, subtitle: "Manage your listed vegetables" };
    }
    if (location.pathname.includes("/analytics")) {
      return { title: "Market Analytics", showBack: true, subtitle: "Data-driven insights for your farm" };
    }
    const displayName = name || "Farmer";
    let locationText = !userLocation.loading ? (userLocation.hasLocation ? userLocation.fullAddress || `${userLocation.city}, ${userLocation.state}` : "Location Unavailable") : "Detecting location...";
    return { title: `${displayName}'s Organic Farm`, showBack: false, subtitle: locationText };
  };

  const checkOnboardingStatus = async () => {
    try {
      // Uses correct endpoint /api/farmers/profile with auth header via interceptor
      const response = await api.get('/farmers/profile');
      if (response.data?.success && response.data?.data) {
        setOnboardingComplete(response.data.data.onboardingComplete === true);
      } else { setOnboardingComplete(false); }
    } catch { setOnboardingComplete(false); }
  };

  const headerData = getHeaderData();
  const isAuthenticated = user || localStorage.getItem("token");

  // Loading State
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-200/40 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] animate-pulse" />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl mb-4 mx-auto border border-white/60">
            <span className="material-symbols-outlined text-green-600 text-3xl animate-spin">sync</span>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Auth Gate
  if (!isAuthenticated) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 max-w-sm mx-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-500 text-3xl">lock</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Session Expired</h2>
        <p className="text-slate-500 mb-6 text-sm">Please login again to continue accessing your farm dashboard.</p>
        <button onClick={handleLogout} className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">Go to Login</button>
      </div>
    </div>
  );

  // Onboarding Gate
  if (onboardingComplete === false) return <FarmerOnboarding userName={name} onComplete={() => setOnboardingComplete(true)} />;

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
      {/* Global Dashboard Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-100/40 rounded-full blur-[120px] opacity-60 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] opacity-60 mix-blend-multiply"></div>
      </div>

      {/* SIDEBAR */}
      <GlobalSidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={name}
        userEmail={email}
        roleTitle="Farmer"
        roleIcon="eco"
        themeColor="green"
        navLinks={farmerNav}
        bottomNavLinks={farmerBottomNav}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <GlobalHeader
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={headerData.title}
          showBack={headerData.showBack}
          subtitle={headerData.subtitle}
          themeColor="green"
          roleIcon="eco"
          navLinks={headerNavLinks}
          onLogout={handleLogout}
        />

        {/* Scrollable Content (Added pb-24 on mobile to prevent bottom nav bar overlap) */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-24 xl:pb-0">
          {/* Page Transition Wrapper - Animation disabled for AddSabji to fix 'fixed' positioning issues */}
          <div className={location.pathname.includes('add-sabji') ? "min-h-full" : "animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-full"}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="add-sabji" element={<AddSabji />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="inventory" element={<ProductInventory />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Overview />} />
            </Routes>
          </div>
        </div>
      </main>

      {/* Location Modal */}
      {locationModal.show && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setLocationModal({ ...locationModal, show: false })} />
          <div className="relative bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Set Your Location</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">This helps us show local weather and pickups</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">City</label>
                <input
                  type="text" value={locationModal.city}
                  onChange={(e) => setLocationModal({ ...locationModal, city: e.target.value })}
                  placeholder="Enter your city"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-green-500 focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">State</label>
                <input
                  type="text" value={locationModal.state}
                  onChange={(e) => setLocationModal({ ...locationModal, state: e.target.value })}
                  placeholder="Enter your state"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-green-500 focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setLocationModal({ ...locationModal, show: false })} className="flex-1 py-3.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">
                Cancel
              </button>
              <button
                onClick={handleLocationSave}
                disabled={!locationModal.city || !locationModal.state}
                className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
