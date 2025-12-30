import React, { useState } from 'react';
import axios from 'axios';
const FarmerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    village: '',
    city: '',
    state: 'Maharashtra',
    pickup: 'Morning (6 AM - 10 AM)',
    crops: {
      tomato: true,
      potato: false,
      onion: false,
      carrot: false,
      leafyVeg: false,
      others: false
    }
  });
  const [loading, setLoading] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCropChange = (crop) => {
    setFormData(prev => ({
      ...prev,
      crops: {
        ...prev.crops,
        [crop]: !prev.crops[crop]
      }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // ✅ SAHI PAYLOAD
      const payload = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        password: formData.password,
        role: 'farmer',

        // Farm details FIX karo:
        farmName: formData.fullName + "'s Farm",  // ✅ Backtick ki jagah simple string
        farmSize: Number(1),  // ✅ Explicitly number mein convert karo

        // Address (address field required hai)
        address: {
          village: formData.village,
          city: formData.city,
          state: formData.state,
          fullAddress: `${formData.village}, ${formData.city}, ${formData.state}`
        },

        // Crops (optional)
        crops: Object.keys(formData.crops)
          .filter(key => formData.crops[key])
          .map(key => ({ name: key }))
      };

      console.log("📤 Sending payload to server:", payload);

      // ✅ API CALL
      const response = await axios.post('http://localhost:5000/api/auth/register/farmer', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("✅ Server response:", response.data);

      if (response.data.success) {
        alert("✅ Registration Successful!");
        window.location.href = '/login';
      }

    } catch (error) {
      console.error("❌ Full error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      // User-friendly error message
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        alert(`❌ Validation failed:\n${errors.map(e => `${e.field}: ${e.message}`).join('\n')}`);
      } else {
        alert(error.response?.data?.message || "❌ Server connection failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  const states = [
    'Maharashtra',
    'Punjab',
    'Haryana',
    'Uttar Pradesh',
    'Madhya Pradesh'
  ];

  const pickupTimes = [
    'Morning (6 AM - 10 AM)',
    'Afternoon (12 PM - 4 PM)',
    'Evening (4 PM - 8 PM)'
  ];

  const crops = [
    { key: 'tomato', label: 'Tomato', emoji: '🍅' },
    { key: 'potato', label: 'Potato', emoji: '🥔' },
    { key: 'onion', label: 'Onion', emoji: '🧅' },
    { key: 'carrot', label: 'Carrot', emoji: '🥕' },
    { key: 'leafyVeg', label: 'Leafy Veg', emoji: '🥬' },
    { key: 'others', label: 'Others', emoji: 'add' }
  ];

  return (
    <div className="min-h-full font-display antialiased text-gray-900 bg-[#f3fbf6]">
      {/* Background Effects */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ecfccb] via-[#f0fdf4] to-[#e0e7ff] opacity-80"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-100/30 rounded-full blur-[80px]"></div>
      </div>

      <div className="min-h-full flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-[24px] bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl shadow-green-600/20 mb-4">
            <span className="material-symbols-outlined text-5xl">agriculture</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">AgriConnect</h2>
          <p className="mt-2 text-sm font-medium text-gray-600">India's most trusted farmer network</p>
        </div>

        {/* Registration Form Card */}
        <div className="sm:mx-auto sm:w-full sm:max-w-[1024px]">
          <div className="glass-card shadow-2xl rounded-card px-6 py-10 sm:px-10 lg:px-14 relative overflow-hidden">
            {/* Glass Card Effect */}
            <style jsx>{`
              .glass-card {
                background: rgba(255, 255, 255, 0.65);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.5);
              }
              .glass-input {
                background: rgba(255, 255, 255, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.8);
                transition: all 0.2s ease;
              }
              .glass-input:focus {
                background: rgba(255, 255, 255, 0.95);
                border-color: #16a34a;
                box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
              }
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            {/* Form Header */}
            <div className="relative z-10 mb-10 pb-6 border-b border-gray-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Farmer Registration</h1>
                <p className="mt-2 text-lg text-gray-600">Sell vegetables directly to vendors near you.</p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50/50 rounded-full border border-green-100 text-green-800 text-sm font-semibold">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span>Secure & Verified</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                {/* Personal Details Column */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    Personal Details
                  </h3>

                  <div className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="fullName">
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">badge</span>
                        </div>
                        <input
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Ex: Ram Kumar"
                          type="text"
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="mobile">
                        Mobile Number
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">smartphone</span>
                        </div>
                        <input
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="+91 98765 00000"
                          type="tel"
                          required
                        />
                      </div>
                      <p className="mt-1 ml-1 text-xs text-green-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        OTP verification required later
                      </p>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="password">
                          Password
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="material-symbols-outlined text-gray-400">lock</span>
                          </div>
                          <input
                            className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            type="password"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="material-symbols-outlined text-gray-400">lock_reset</span>
                          </div>
                          <input
                            className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            type="password"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Farm Location Column */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    Farm Location
                  </h3>

                  <div className="space-y-5">
                    {/* Village/Farm Address */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="village">
                        Village / Farm Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">home_pin</span>
                        </div>
                        <input
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="village"
                          name="village"
                          value={formData.village}
                          onChange={handleInputChange}
                          placeholder="Ex: Village Rampur, Near Old Well"
                          type="text"
                          required
                        />
                      </div>
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="city">
                          City / District
                        </label>
                        <input
                          className="glass-input block w-full rounded-input py-4 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="District"
                          type="text"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="state">
                          State
                        </label>
                        <select
                          className="glass-input block w-full rounded-input py-4 px-4 text-gray-900 focus:ring-2 focus:ring-primary sm:text-base font-medium appearance-none"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        >
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Preferred Pickup Time */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="pickup">
                        Preferred Pickup Time
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">schedule</span>
                        </div>
                        <select
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-10 text-gray-900 focus:ring-2 focus:ring-primary sm:text-base font-medium appearance-none"
                          id="pickup"
                          name="pickup"
                          value={formData.pickup}
                          onChange={handleInputChange}
                          required
                        >
                          {pickupTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                          <span className="material-symbols-outlined text-gray-400">expand_more</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What do you grow? Section */}
              <div className="pt-6 border-t border-gray-200/50">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                    <span className="material-symbols-outlined">potted_plant</span>
                  </div>
                  What do you grow?
                  <span className="text-sm font-normal text-gray-500 ml-2">(Select all that apply)</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {crops.map((crop) => (
                    <label key={crop.key} className="cursor-pointer group">
                      <input
                        className="peer sr-only"
                        type="checkbox"
                        checked={formData.crops[crop.key]}
                        onChange={() => handleCropChange(crop.key)}
                      />
                      <div className={`
                        glass-input rounded-input p-4 text-center hover:bg-white/80
                        peer-checked:bg-green-100 peer-checked:border-green-500 
                        peer-checked:ring-2 peer-checked:ring-green-500 transition-all 
                        h-full flex flex-col items-center justify-center
                      `}>
                        {crop.emoji === 'add' ? (
                          <span className="material-symbols-outlined text-3xl mb-2 text-gray-500 group-hover:scale-110 transition-transform">
                            add
                          </span>
                        ) : (
                          <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                            {crop.emoji}
                          </span>
                        )}
                        <span className="font-bold text-sm text-gray-900">{crop.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading} // 4. Loading ke waqt button disable karein
                  className={`w-full flex justify-center py-5 px-4 border border-transparent rounded-[20px] shadow-lg text-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-500 transition-all transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-700 hover:to-green-600'}`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin material-symbols-outlined">sync</span>
                      Processing...
                    </span>
                  ) : (
                    'Register as Farmer'
                  )}
                </button>

                <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-50/80 border border-yellow-200/60 rounded-xl">
                  <span className="material-symbols-outlined text-yellow-600 shrink-0">info</span>
                  <p className="text-sm text-yellow-800 font-medium">
                    Account will be active after admin verification. We usually verify details within 24 hours by calling your provided mobile number.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account?
            <a className="font-bold text-green-700 hover:text-green-800 ml-1 underline decoration-2 decoration-green-300 underline-offset-2" href="#">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegistration;