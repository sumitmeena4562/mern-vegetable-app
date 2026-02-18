import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Farmers/Dashboard/Sidebar";
import Header from "../../components/Farmers/Dashboard/Header";
import Overview from "../../components/Farmers/Dashboard/Overview";
import FarmerOnboarding from "../../components/Farmers/Dashboard/FarmerOnboarding";
import AddSabji from "./AddSabji";
import api from "../../api/axios"; // Import centralized API instance

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

const extractVerifiedStatus = (userData) => {
  if (!userData) return false;
  return userData.isVerified === true || userData.isVerified === "true";
}

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

const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const services = [
      {
        name: "BigDataCloud",
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        parser: (data) => ({
          city: data.city || data.locality || "",
          state: data.principalSubdivision || "",
          country: data.countryName || "India"
        })
      },
      {
        name: "OpenStreetMap (Fallback)",
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
        parser: (data) => ({
          city: data.address?.city || data.address?.town || data.address?.village || "",
          state: data.address?.state || data.address?.region || "",
          country: data.address?.country || "India"
        })
      }
    ];

    for (const service of services) {
      try {
        const response = await fetch(service.url, { timeout: 5000 });
        if (response.ok) {
          const data = await response.json();
          const address = service.parser(data);
          if (address.city || address.state) return address;
        }
      } catch (error) { continue; }
    }
    return { city: "", state: "", country: "India" };
  } catch (error) {
    return { city: "", state: "", country: "India" };
  }
};

const detectGeolocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ success: false, error: "Geolocation not supported" });
      return;
    }
    const options = { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 };
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        resolve({
          success: true,
          coordinates: { latitude: position.coords.latitude, longitude: position.coords.longitude }
        });
      },
      (error) => {
        let errorType = "unknown";
        if (error.code === error.PERMISSION_DENIED) errorType = "permission_denied";
        if (error.code === error.POSITION_UNAVAILABLE) errorType = "position_unavailable";
        if (error.code === error.TIMEOUT) errorType = "timeout";
        resolve({ success: false, error: errorType, message: error.message });
      },
      options
    );
  });
};

// ============================================
// 🎯 MAIN COMPONENT
// ============================================

export default function FarmerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setVerified] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(null);

  const [userLocation, setUserLocation] = useState({
    city: "", state: "", loading: true, hasLocation: false,
    showAddLocation: false, error: null, errorMessage: ""
  });

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
  }, [user, authLoading]);

  const loadUserProfile = async () => {
    try {
      let userData = null;
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Use fetchUserDataFromAPI which now has corrected URL
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
      setVerified(extractVerifiedStatus(userData));

      let savedLoc = extractUserLocation(userData);
      if (!savedLoc.hasLocation && token) {
        const freshData = await fetchUserDataFromAPI(token);
        if (freshData) {
          userData = freshData;
          localStorage.setItem("user", JSON.stringify(freshData));
          savedLoc = extractUserLocation(freshData);
        }
      }

      if (savedLoc.hasLocation) {
        setUserLocation({
          city: savedLoc.city, state: savedLoc.state, fullAddress: savedLoc.fullAddress,
          loading: false, hasLocation: true, showAddLocation: false, error: null, errorMessage: ""
        });
      }
    } catch (error) {
      setName("Farmer"); setEmail("farmer@example.com");
    }
  };

  const loadUserLocation = async () => {
    setUserLocation(prev => ({ ...prev, loading: true, error: null }));
    try {
      const geoResult = await detectGeolocation();
      if (geoResult.success && geoResult.coordinates) {
        const address = await getAddressFromCoordinates(geoResult.coordinates.latitude, geoResult.coordinates.longitude);
        if (address.city || address.state) {
          setUserLocation({
            city: address.city || "Unknown", state: address.state || "Unknown",
            loading: false, hasLocation: true, showAddLocation: false, error: null, errorMessage: ""
          });
          return;
        }
      }
      if (geoResult.error === "timeout") {
        const ipLocation = await getLocationByIP();
        if (ipLocation.city && ipLocation.state) {
          setUserLocation({
            city: ipLocation.city, state: ipLocation.state,
            loading: false, hasLocation: true, showAddLocation: false, error: "timeout", errorMessage: "Using approximate location"
          });
          return;
        }
      }
      setUserLocation(prev => {
        if (prev.hasLocation) return { ...prev, loading: false, error: "", errorMessage: "" };
        return {
          city: "", state: "", fullAddress: "Location Unavailable", loading: false,
          hasLocation: false, showAddLocation: false, error: geoResult.error || "no_location", errorMessage: "Location not available"
        };
      });
    } catch (error) {
      setUserLocation({ city: "", state: "", loading: false, hasLocation: false, showAddLocation: true, error: "exception", errorMessage: "Failed to detect location" });
    }
  };

  const getLocationByIP = async () => {
    try {
      const services = ["https://ipapi.co/json/", "https://ipinfo.io/json?token=demo", "https://geolocation-db.com/json/"];
      for (const url of services) {
        try {
          const response = await fetch(url, { timeout: 5000 });
          if (response.ok) {
            const data = await response.json();
            let city = data.city || "", state = data.region || data.state || "";
            if (city || state) return { city, state };
          }
        } catch (error) { continue; }
      }
      return { city: "", state: "" };
    } catch (error) { return { city: "", state: "" }; }
  };

  const handleAddLocation = () => {
    const city = window.prompt("Enter your city:", userLocation.city || "");
    if (!city) return;
    const state = window.prompt("Enter your state:", userLocation.state || "");
    if (!state) return;
    if (city && state) {
      setUserLocation(prev => ({ ...prev, city, state, loading: false, hasLocation: true, showAddLocation: false, error: null, errorMessage: "" }));
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.city = city; parsed.state = state;
        localStorage.setItem("user", JSON.stringify(parsed));
      }
    }
  };

  const handleLogout = () => { if (logout) logout(); localStorage.clear(); navigate("/login"); };

  const getHeaderData = () => {
    if (location.pathname.includes("/add-sabji")) {
      return { title: "Add New Sabji", showBack: true, subtitle: "Add fresh vegetables to your inventory" };
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
    } catch (error) { setOnboardingComplete(false); }
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
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} userName={name} userEmail={email} userLocation={userLocation} onLogout={handleLogout} onAddLocation={handleAddLocation} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={headerData.title} showBack={headerData.showBack} subtitle={headerData.subtitle} userName={name} Verified={isVerified} locationData={userLocation} onAddLocation={handleAddLocation} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {/* Page Transition Wrapper - Animation disabled for AddSabji to fix 'fixed' positioning issues */}
          <div className={location.pathname.includes('add-sabji') ? "min-h-full" : "animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-full"}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="add-sabji" element={<AddSabji />} />
              <Route path="notifications" element={<div className="p-8 text-center text-slate-500">Notifications coming soon...</div>} />
              <Route path="*" element={<Overview />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}
