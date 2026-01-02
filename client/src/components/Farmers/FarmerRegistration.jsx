import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const FarmerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
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
  const [isVerified, setIsVerified] = useState(false); // Mobile verification status
  const [showOtpModal, setShowOtpModal] = useState(false); // Modal visibility
  const [otpInput, setOtpInput] = useState(""); // User OTP input
  const [otpLoading, setOtpLoading] = useState(false); // OTP loading state
  const [otpValues, setOtpValues] = useState(["", "", "", ""]); // 4 boxes ke liye
  const [timer, setTimer] = useState(60); // Resend timer
  const [canResend, setCanResend] = useState(false); // Resend button status

  // Modal open hone par Timer shuru karne ke liye
  React.useEffect(() => {
    let interval;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  // Handle 4 Boxes Input
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...otpValues];
    newOtp[index] = element.value;
    setOtpValues(newOtp);
    setOtpInput(newOtp.join("")); // Main state update for API

    // Auto Focus Next Box
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  // Handle Backspace (Piche jaane ke liye)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  // Resend OTP Click
  const handleResendClick = async () => {
    setTimer(60);
    setCanResend(false);
    await handleSendOtp(); // Wahi purana function call
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCropChange = (crop) => {
    setFormData(prev => ({
      ...prev,
      crops: { ...prev.crops, [crop]: !prev.crops[crop] }
    }));
  };

  // 1. Send OTP Function
  const handleSendOtp = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      alert("❌ Please enter a valid mobile number.");
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      alert("❌ Please enter a valid email address.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', {
        mobile: formData.mobile,
        email: formData.email
      });

      if (res.data.success) {
        setShowOtpModal(true);
        alert(`✅ OTP Sent to ${formData.email}! Check Inbox.`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "❌ Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // 2. Verify OTP Function
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        mobile: formData.mobile,
        otp: otpInput
      });

      if (res.data.success) {
        setIsVerified(true);
        setShowOtpModal(false);
        setOtpInput("");
        alert("✅ Mobile Verified! You can now Register.");
      }
    } catch (error) {
      alert("❌ Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Password Check (Pehle ki tarah)
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords match nahi ho rahe hain!");
      return;
    }

    // 👇 2. STRICT VERIFICATION CHECK (Yahan badlaav kiya hai)
    if (!isVerified) {
      // Step A: User ko roko aur alert do
      alert("🛑 Rukiye! Registration se pehle Mobile Number verify karna zaroori hai.");

      // Step B: Automatic OTP bhej do aur Modal khol do
      // Hum direct handleSendOtp call kar rahe hain taaki user ko dhoondna na pade
      await handleSendOtp();

      // Step C: Code yahi rok do (Return kar do)
      // Isse niche ka registration code nahi chalega jab tak verify na ho
      return;
    }

    // Agar Verified hai, to Loading shuru karo
    setLoading(true);

    try {
      // ... (Baaki wahi same registration logic) ...
      const userEmail = formData.email || "";
      const payload = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        email:userEmail,
        password: formData.password,
        role: 'farmer',
        farmName: formData.fullName + "'s Farm",
        farmSize: 1,
        address: {
          village: formData.village,
          city: formData.city,
          state: formData.state,
          fullAddress: `${formData.village}, ${formData.city}, ${formData.state}`
        },
        crops: Object.keys(formData.crops)
          .filter(key => formData.crops[key])
          .map(key => ({ name: key }))
          
      };

      const response = await axios.post('http://localhost:5000/api/auth/register/farmer', payload);

      if (response.data.success) {
        alert("✅ Registration Successful!");
        window.location.href = '/login';
      }

    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "❌ Server connection failed!");
    } finally {
      setLoading(false);
    }
  };

  const states = ['Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'];
  const pickupTimes = ['Morning (6 AM - 10 AM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)'];
  const crops = [
    { key: 'tomato', label: 'Tomato', emoji: '🍅' },
    { key: 'potato', label: 'Potato', emoji: '🥔' },
    { key: 'onion', label: 'Onion', emoji: '🧅' },
    { key: 'carrot', label: 'Carrot', emoji: '🥕' },
    { key: 'leafyVeg', label: 'Leafy Veg', emoji: '🥬' },
    { key: 'others', label: 'Others', emoji: 'add' }
  ];

  return (
    // Changed min-h-full to min-h-screen taaki mobile pe background na kate
    <div className="min-h-screen font-display antialiased text-gray-900 bg-[#f3fbf6] flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ecfccb] via-[#f0fdf4] to-[#e0e7ff] opacity-80"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-200/40 rounded-full blur-[100px]"></div>
      </div>

      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="material-symbols-outlined text-green-600 text-4xl">eco</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight text-gray-900">AgriConnect</h2>
        <p className="mt-2 text-sm font-medium text-gray-600">India's most trusted farmer network 🌾</p>
      </div>

      {/* Main Registration Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-[1024px] relative z-10">
        {/* Responsive Padding: px-4 (Mobile) to px-10 (Desktop) */}
        <div className="glass-card shadow-xl rounded-2xl px-4 py-6 sm:px-10 sm:py-10 relative overflow-hidden">

          <style jsx>{`
            .glass-card {
              background: rgba(255, 255, 255, 0.75);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.6);
            }
            .glass-input {
              background: rgba(255, 255, 255, 0.5);
              border: 1px solid rgba(209, 213, 219, 0.6);
              transition: all 0.2s ease;
            }
            .glass-input:focus {
              background: rgba(255, 255, 255, 0.95);
              border-color: #16a34a;
              box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
            }
          `}</style>

          {/* Form Title */}
          <div className="mb-6 pb-4 border-b border-gray-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Farmer Registration</h1>
              <p className="mt-1 text-sm text-gray-600">Sell vegetables directly to vendors.</p>
            </div>
            {/* Verified Badge (Hidden on very small screens) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50/80 rounded-full border border-green-100 text-green-900 text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Secure & Verified</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Responsive Grid: 1 col on Mobile, 2 cols on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">

              {/* Left Column: Personal Details */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                    <span className="material-symbols-outlined text-lg">person</span>
                  </div>
                  Personal Details
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    className="glass-input block w-full rounded-lg py-2.5 px-3 text-base text-gray-900 focus:outline-none"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: Ram Kumar"
                    required
                  />
                </div>

                {/* Mobile & Verify Button */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <input
                      className={`glass-input block w-full rounded-lg py-2.5 px-3 text-base text-gray-900 focus:outline-none ${isVerified ? 'bg-green-50 border-green-500 text-green-700' : ''}`}
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+91 98765 00000"
                      type="tel"
                      disabled={isVerified}
                      required
                    />
                    {!isVerified ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors"
                      >
                        {otpLoading ? '...' : 'Verify'}
                      </button>
                    ) : (
                      <div className="flex items-center px-3 bg-green-100 text-green-700 rounded-lg border border-green-200 font-bold text-sm">
                        ✓
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email (For OTP)</label>
                  <input
                    className="glass-input block w-full rounded-lg py-2.5 px-3 text-base text-gray-900 focus:outline-none"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="farmer@example.com"
                    disabled={isVerified}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input
                      className="glass-input block w-full rounded-lg py-2.5 px-3 text-base text-gray-900 focus:outline-none"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Confirm</label>
                    <input
                      className="glass-input block w-full rounded-lg py-2.5 px-3 text-base text-gray-900 focus:outline-none"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Farm Location */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                  </div>
                  Farm Location
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Village / Address</label>
                  <input
                    className="glass-input block w-full rounded-lg py-2.5 px-3 text-base text-gray-900 focus:outline-none"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    placeholder="Address..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                    <input
                      className="glass-input block w-full rounded-lg py-2.5 px-3 text-base text-gray-900 focus:outline-none"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="District"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                    <select
                      className="glass-input block w-full rounded-lg py-2.5 px-3 text-base text-gray-900 focus:outline-none bg-white/50"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    >
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Pickup Time</label>
                  <select
                    className="glass-input block w-full rounded-lg py-2.5 px-3 text-base text-gray-900 focus:outline-none bg-white/50"
                    name="pickup"
                    value={formData.pickup}
                    onChange={handleInputChange}
                    required
                  >
                    {pickupTimes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Crops Section - Fully Responsive Grid */}
            <div className="pt-6 border-t border-gray-200/50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-green-700">potted_plant</span>
                What do you grow?
              </h3>

              {/* Mobile: 2 cols | Tablet: 3-4 cols | Desktop: 6 cols */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {crops.map((crop) => (
                  <label key={crop.key} className="cursor-pointer group relative">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      checked={formData.crops[crop.key]}
                      onChange={() => handleCropChange(crop.key)}
                    />
                    <div className="glass-input rounded-xl p-3 h-24 flex flex-col items-center justify-center text-center peer-checked:bg-green-100 peer-checked:border-green-500 peer-checked:ring-1 peer-checked:ring-green-500 hover:bg-white/80 transition-all">
                      <span className="text-2xl mb-1 filter drop-shadow-sm">
                        {crop.emoji === 'add' ? '+' : crop.emoji}
                      </span>
                      <span className="text-xs font-bold text-gray-800 leading-tight">{crop.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-green-600 to-green-500 transition-all transform active:scale-[0.98] ${loading ? 'opacity-70' : 'hover:from-green-700 hover:to-green-600'}`}
              >
                {loading ? 'Processing...' : 'Register as Farmer'}
              </button>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?
                <a href="#" className="font-bold text-green-700 hover:underline ml-1">Login here</a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* OTP Modal (Centered on Mobile) */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
          {/* Modal Animation */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-300">

            {/* Modal Header with Icon */}
            <div className="bg-white p-6 pb-0 text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <span className="material-symbols-outlined text-3xl text-green-600">lock_open</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Verification</h3>
              <p className="text-gray-500 text-sm mt-2">
                Enter the 4-digit code sent to <br />
                <span className="font-semibold text-gray-800">{formData.email}</span>
              </p>
            </div>

            {/* OTP Inputs (4 Boxes) */}
            <div className="p-6">
              <div className="flex justify-center gap-3 mb-6">
                {otpValues.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    name="otp"
                    maxLength="1"
                    className="w-14 h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-800 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:outline-none transition-all shadow-sm bg-gray-50"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Verify Now</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>

              {/* Resend Timer */}
              <div className="mt-6 text-center">
                {canResend ? (
                  <button
                    onClick={handleResendClick}
                    className="text-sm font-bold text-green-600 hover:text-green-700 hover:underline transition-all"
                  >
                    Resend Code
                  </button>
                ) : (
                  <p className="text-sm text-gray-400 font-medium">
                    Resend code in <span className="text-gray-600">{timer}s</span>
                  </p>
                )}
              </div>
            </div>

            {/* Cancel Button at bottom */}
            <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-gray-500 text-sm font-semibold hover:text-gray-700 transition-colors"
              >
                Cancel Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerRegistration;