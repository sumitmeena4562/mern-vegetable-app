import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Farmers/Dashboard/Sidebar";
import Header from "../../components/Farmers/Dashboard/Header";
import Dashboard from "../../components/Farmers/Dashboard/Dashboard";
import AddSabji from "./AddSabji";
import Notifications from "../../components/Farmers/Dashboard/notification/Notifications";

// ============================================
// 🧠 HELPER FUNCTIONS (Extract kar sakte ho alag file me)
// ============================================

/**
 * Extract user name from different possible fields
 * 🔥 Aage aur fields add kar sakte ho: lastName, nickname, etc.
 */
const extractUserName = (userData) => {
  if (!userData) return "Farmer";
  return userData.fullName || userData.name || userData.username || "Farmer";
};

/**
 * Extract user email from different possible fields
 * 🔥 Aage aur sources add kar sakte ho: alternateEmail, workEmail, etc.
 */
const extractUserEmail = (userData) => {
  if (!userData) return "farmer@example.com";

  // Priority order: email > mobile > username > default
  if (userData.email && userData.email.includes('@')) return userData.email;
  if (userData.mobile) return `${userData.mobile}@user.com`;
  if (userData.username) return `${userData.username}@user.com`;

  return "farmer@example.com";
};

const extractVerifiedStatus = (userData) => {
  if (!userData) return false;
  // Check karein agar value true hai ya string "true" hai
  return userData.isVerified === true || userData.isVerified === "true";
}
/**
 * Extract user location from different possible fields
 * 🔥 Aage aur location fields add kar sakte ho: address, pincode, country, etc.
 */
const extractUserLocation = (userData) => {
  if (!userData) return { city: "", state: "", hasLocation: false };

  const city = userData.city || userData.location?.city || "";
  const state = userData.state || userData.location?.state || "";

  return {
    city,
    state,
    hasLocation: !!(city && state)
  };
};

/**
 * Fetch user data from API
 * 🔥 Aage aur data types add kar sakte ho: profilePicture, farmDetails, etc.
 */
const fetchUserDataFromAPI = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      }
    );

    if (response.data.success) {
      // Support multiple response structures
      return response.data.user || response.data.data?.user || response.data.data;
    }
    return null;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

/**
 * Get address from coordinates using OpenStreetMap
 * 🔥 Aage aur geocoding services add kar sakte ho: Google Maps, Mapbox, etc.
 */
const getAddressFromCoordinates = async (lat, lng) => {
  try {
    console.log("🌍 Getting address for coordinates:", lat, lng);

    // Try multiple geocoding services (fallback chain)
    const services = [
      {
        name: "OpenStreetMap",
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
        parser: (data) => ({
          city: data.address?.city || data.address?.town || data.address?.village || "",
          state: data.address?.state || data.address?.region || "",
          country: data.address?.country || "India"
        })
      },
      {
        name: "BigDataCloud",
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        parser: (data) => ({
          city: data.city || data.locality || "",
          state: data.principalSubdivision || "",
          country: data.countryName || "India"
        })
      }
    ];

    for (const service of services) {
      try {
        console.log(`Trying ${service.name}...`);
        const response = await fetch(service.url, { timeout: 5000 });

        if (response.ok) {
          const data = await response.json();
          const address = service.parser(data);

          if (address.city || address.state) {
            console.log(`✅ Address found via ${service.name}:`, address);
            return address;
          }
        }
      } catch (error) {
        console.log(`${service.name} failed:`, error.message);
        continue;
      }
    }

    console.log("❌ All geocoding services failed");
    return { city: "", state: "", country: "India" };

  } catch (error) {
    console.error("Geocoding error:", error);
    return { city: "", state: "", country: "India" };
  }
};

const detectGeolocation = () => {
  return new Promise((resolve) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.log("❌ Geolocation not supported by browser");
      resolve({ success: false, error: "Geolocation not supported" });
      return;
    }

    // Geolocation options - optimized for faster response
    const options = {
      enableHighAccuracy: false, // ❌ High accuracy slows down, set to false
      timeout: 8000, // Reduce timeout
      maximumAge: 5 * 60 * 1000 // Cache location for 5 minutes
    };

    console.log("📍 Requesting location...");

    navigator.geolocation.getCurrentPosition(
      // Success callback
      async (position) => {
        console.log("✅ Location permission granted");
        console.log("Coordinates:", position.coords);

        resolve({
          success: true,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      // Error callback
      (error) => {
        console.log("📍 Geolocation error:", error.code, error.message);

        let errorType = "unknown";
        let userMessage = "Location access needed";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorType = "permission_denied";
            userMessage = "Location permission denied. Please enable in browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorType = "position_unavailable";
            userMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorType = "timeout";
            userMessage = "Location request timed out. Please check your internet connection.";
            break;
          default:
            errorType = "unknown";
            userMessage = "Unable to detect location.";
        }

        resolve({
          success: false,
          error: errorType,
          message: userMessage
        });
      },
      options
    );
  });
};

// ============================================
// 🎯 MAIN COMPONENT
// ============================================

export default function FarmerDashboard() {
  // =========== STATE MANAGEMENT ===========
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified,setVerified]=useState(false);

  // 🔥 Aage aur user data add kar sakte ho:
  // const [phone, setPhone] = useState("");
  // const [farmName, setFarmName] = useState("");
  // const [profileImage, setProfileImage] = useState("");

  const [userLocation, setUserLocation] = useState({
    city: "",
    state: "",
    loading: true,
    hasLocation: false,
    showAddLocation: false,
    error: null,
    errorMessage: ""
  });

  // =========== HOOKS ===========
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();

  // =========== MAIN DATA FETCH ===========
  useEffect(() => {
    const initializeDashboard = async () => {
      if (authLoading) {
        setIsLoading(true);
        return;
      }

      try {
        await Promise.all([
          loadUserProfile(),
          loadUserLocation()
        ]);
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [user, authLoading]);

  // =========== CORE FUNCTIONS ===========

  /**
   * Load user profile data from multiple sources
   */
  const loadUserProfile = async () => {
    try {
      let userData = null;

      // Source 1: AuthContext (fastest)
      if (user) {
        userData = user;
        console.log("✅ Using user from AuthContext");
      }

      // Source 2: LocalStorage (fallback)
      if (!userData) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            userData = JSON.parse(storedUser);
            console.log("✅ Using user from localStorage");
          } catch (e) {
            console.warn("Failed to parse stored user:", e);
          }
        }
      }

      // Source 3: API call (last resort)
      if (!userData) {
        const token = localStorage.getItem("token");
        if (token) {
          userData = await fetchUserDataFromAPI(token);
          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
            console.log("✅ Using user from API");
          }
        }
      }

      // Extract and set data
      if (userData) {


        console.log("🔥 USER DATA FROM API:", userData);
        console.log("🔎 isVerified Value:", userData.isVerified);
        setName(extractUserName(userData));
        setEmail(extractUserEmail(userData));
        setVerified(extractVerifiedStatus(userData));

        // 🔥 Yaha aur data extract kar sakte ho:
        // setPhone(userData.mobile || "");
        // setFarmName(userData.farmName || "");
        // setProfileImage(userData.profileImage || "");
        const savedLoc = extractUserLocation(userData);
        if (savedLoc.hasLocation) {
          setUserLocation({
            city: savedLoc.city,
            state: savedLoc.state,
            loading: false,
            hasLocation: true,
            showAddLocation: false,
            error: null,
            errorMessage: ""
          });
          console.log("✅ Using saved location from user data");
        }


      } else {
        setName("Farmer");
        setEmail("farmer@example.com");
      }

    } catch (error) {
      console.error("Profile load error:", error);
      setName("Farmer");
      setEmail("farmer@example.com");
    }
  };

  /**
   * Load user location with priority logic
   */
  const loadUserLocation = async () => {
    // If we already have location from user data, skip
    if (userLocation.hasLocation && !userLocation.loading) {
      return;
    }

    setUserLocation(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log("🔄 Starting location detection...");

      // Step 1: Try geolocation
      const geoResult = await detectGeolocation();

      if (geoResult.success && geoResult.coordinates) {
        console.log("📍 Got coordinates, fetching address...");

        const address = await getAddressFromCoordinates(
          geoResult.coordinates.latitude,
          geoResult.coordinates.longitude
        );

        if (address.city || address.state) {
          setUserLocation({
            city: address.city || "Unknown",
            state: address.state || "Unknown",
            loading: false,
            hasLocation: true,
            showAddLocation: false,
            error: null,
            errorMessage: ""
          });
          console.log("✅ Location set:", address);
          return;
        }
      }

      // Step 2: Geolocation failed or no address
      if (geoResult.error === "timeout") {
        console.log("⏱️ Location timeout - using IP-based fallback");
        const ipLocation = await getLocationByIP();

        if (ipLocation.city && ipLocation.state) {
          setUserLocation({
            city: ipLocation.city,
            state: ipLocation.state,
            loading: false,
            hasLocation: true,
            showAddLocation: false,
            error: "timeout",
            errorMessage: "Using approximate location (IP-based)"
          });
          return;
        }
      }

      // Step 3: No location available
      setUserLocation({
        city: "",
        state: "",
        loading: false,
        hasLocation: false,
        showAddLocation: true,
        error: geoResult.error || "no_location",
        errorMessage: geoResult.message || "Location not available"
      });

    } catch (error) {
      console.error("Location load error:", error);
      setUserLocation({
        city: "",
        state: "",
        loading: false,
        hasLocation: false,
        showAddLocation: true,
        error: "exception",
        errorMessage: "Failed to detect location"
      });
    }
  };

  // ✅ NEW: IP-based location fallback
  const getLocationByIP = async () => {
    try {
      console.log("🌐 Trying IP-based location...");

      // Try multiple IP geolocation services
      const services = [
        "https://ipapi.co/json/",
        "https://ipinfo.io/json?token=demo", // Note: demo token has limits
        "https://geolocation-db.com/json/"
      ];

      for (const url of services) {
        try {
          const response = await fetch(url, { timeout: 5000 });
          if (response.ok) {
            const data = await response.json();

            // Parse response based on service
            let city = "", state = "";

            if (url.includes("ipapi.co")) {
              city = data.city || "";
              state = data.region || "";
            } else if (url.includes("ipinfo.io")) {
              city = data.city || "";
              state = data.region || "";
            } else if (url.includes("geolocation-db")) {
              city = data.city || "";
              state = data.state || "";
            }

            if (city || state) {
              console.log("✅ IP location found:", { city, state });
              return { city, state };
            }
          }
        } catch (error) {
          console.log(`IP service failed (${url}):`, error.message);
          continue;
        }
      }

      return { city: "", state: "" };

    } catch (error) {
      console.error("IP location error:", error);
      return { city: "", state: "" };
    }
  };

  /**
   * Fetch saved location from backend
   */
  const fetchSavedLocation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { city: "", state: "", hasLocation: false };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        return extractUserLocation(
          response.data.user || response.data.data?.user
        );
      }
    } catch (error) {
      console.error("Saved location fetch error:", error);
    }
    return { city: "", state: "", hasLocation: false };
  };

  /**
   * Get current geolocation
   */
  const getCurrentGeolocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const address = await getAddressFromCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );

            resolve({
              city: address.city,
              state: address.state,
              hasLocation: !!(address.city && address.state)
            });
          } catch (error) {
            console.error("Geocoding failed:", error);
            resolve({ city: "", state: "", hasLocation: false });
          }
        },
        (error) => {
          console.log("Geolocation permission denied:", error.message);
          resolve({ city: "", state: "", hasLocation: false });
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  };

  // =========== EVENT HANDLERS ===========

  const handleAddLocation = () => {
    // Option 1: Navigate to settings
    navigate('/farmer-dashboard/settings?tab=location');

    // Option 2: Show modal (uncomment to use)
    // const city = window.prompt("Enter your city:", userLocation.city || "");
    // const state = window.prompt("Enter your state:", userLocation.state || "");
    // if (city && state) {
    //   setUserLocation({
    //     city,
    //     state,
    //     loading: false,
    //     hasLocation: true,
    //     showAddLocation: false,
    //     error: null,
    //     errorMessage: ""
    //   });
    //   // Save to backend here
    // }
  };


  // ✅ NEW: Retry location detection
  const handleRetryLocation = async () => {
    console.log("🔄 Retrying location detection...");
    await loadUserLocation();
  };
  const handleLogout = () => {
    console.log("User logging out...");

    // Clear all user data
    if (logout) logout();
    localStorage.clear();

    // Redirect to login
    navigate("/login");
  };

  // 🔥 Aage aur event handlers add kar sakte ho:
  // const handleProfileUpdate = (updatedData) => { ... }
  // const handleNotificationClick = () => { ... }
  // const handleThemeToggle = () => { ... }

  // =========== UI LOGIC ===========

  /**
   * Get header data based on current route
   * 🔥 Aage aur routes ke liye header data add kar sakte ho
   */
  const getHeaderData = () => {
    if (location.pathname.includes("/add-sabji")) {
      return {
        title: "Add New Sabji",
        showBack: true,
        subtitle: "Add fresh vegetables to your inventory"
      };
    }

    const displayName = name || "Farmer";

    // ✅ FIXED: Better location display with error handling
    let locationText = "Detecting location...";
    let showRetryButton = false;

    if (!userLocation.loading) {
      if (userLocation.city && userLocation.state) {
        locationText = `${userLocation.city}, ${userLocation.state}`;
        if (userLocation.errorMessage) {
          locationText += ` (${userLocation.errorMessage})`;
        }
      } else if (userLocation.showAddLocation) {
        if (userLocation.error === "timeout") {
          locationText = (
            <div className="flex items-center gap-2">
              <span>Location timeout</span>
              <button
                onClick={handleRetryLocation}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Retry
              </button>
              <span>or</span>
              <button
                onClick={handleAddLocation}
                className="text-green-600 hover:text-green-800 underline text-sm"
              >
                Add Manually
              </button>
            </div>
          );
        } else {
          locationText = (
            <button
              onClick={handleAddLocation}
              className="text-blue-600 hover:text-blue-800 underline text-sm flex items-center gap-1"
            >
              <span className="material-icons text-xs">add_location</span>
              Add Your Location
            </button>
          );
        }
      } else {
        locationText = "Pune, Maharashtra";
      }
    }

    return {
      title: `${displayName}'s Organic Farm`,
      showBack: false,
      subtitle: locationText,
    };
  };

  const headerData = getHeaderData();

  // =========== RENDER CONDITIONS ===========

  // Show loading spinner
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f2fcf5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  const isAuthenticated = user || localStorage.getItem("token");
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f2fcf5]">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Session Expired</h2>
          <p className="text-gray-600 mb-6">Please login again to continue</p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // =========== MAIN RENDER ===========
  return (
    <div className="flex h-screen w-full bg-[#f2fcf5]">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={name}
        userEmail={email}
        userLocation={userLocation}
        onLogout={handleLogout}
        onAddLocation={handleAddLocation}
      // 🔥 Aage aur props pass kar sakte ho:
      // userPhone={phone}
      // farmName={farmName}
      // profileImage={profileImage}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={headerData.title}
          showBack={headerData.showBack}
          subtitle={headerData.subtitle}
          userName={name}
          Verified={isVerified}
          locationData={userLocation}
          onAddLocation={handleAddLocation}
        />

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="add-sabji" element={<AddSabji />} />
            <Route path="notifications"element={<Notifications/>}/>

            {/* 🔥 Yaha aur routes add kar sakte ho: */}
            {/* <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} /> */}
          </Routes>
        </div>

        {/* 🔥 Yaha footer add kar sakte ho: */}
        {/* <DashboardFooter /> */}
      </main>
    </div>
  );
}

// ============================================
// 📝 EXTENSION NOTES:
// ============================================

/*
🔥 FUTURE ENHANCEMENTS:

1. USER PROFILE DATA:
   - Add phone number display
   - Add farm name/type
   - Add profile picture
   - Add farmer rating/score
   - Add join date/member since

2. LOCATION FEATURES:
   - Manual location input
   - Multiple saved locations
   - Location-based services
   - Distance to nearest market

3. DASHBOARD WIDGETS:
   - Weather widget
   - Market prices
   - Task reminders
   - Revenue charts
   - Inventory status

4. NOTIFICATION SYSTEM:
   - Order alerts
   - Price drop alerts
   - Weather alerts
   - Payment reminders

5. SETTINGS & PREFERENCES:
   - Theme (light/dark)
   - Language (Hindi/English)
   - Notification preferences
   - Privacy settings

6. ADDITIONAL PAGES:
   - Products management
   - Orders history
   - Payment methods
   - Customer reviews
   - Farm gallery

IMPLEMENTATION TIPS:
- Create separate service files for API calls
- Use context for global state (user, theme, etc.)
- Implement loading skeletons for better UX
- Add error boundaries for crash protection
- Use React Query for data caching
- Implement proper form validation
*/

/*
📁 SUGGESTED FOLDER STRUCTURE:

src/
├── components/
│   ├── Farmers/
│   │   └── Dashboard/
│   │       ├── Sidebar.jsx
│   │       ├── Header.jsx
│   │       ├── Dashboard.jsx (main content)
│   │       └── Widgets/ (dashboard widgets)
│   └── Common/ (reusable components)
├── services/
│   ├── UserService.js
│   ├── LocationService.js
│   ├── ProductService.js
│   └── OrderService.js
├── contexts/ (React contexts)
├── hooks/ (custom hooks)
├── utils/ (helper functions)
└── pages/
    └── Farmers/
        ├── FarmerDashboard.jsx (this file)
        ├── AddSabji.jsx
        ├── Products.jsx
        ├── Orders.jsx
        └── Settings.jsx
*/