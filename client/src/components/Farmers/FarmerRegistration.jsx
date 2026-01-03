import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'; // New Import

const FarmerRegistration = () => {
  // API URL Constant (Change karke production mein easy rahega)
  const API_URL = "http://localhost:5000/api/auth";

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
    otherCropName: '', // New Field for "Others" input
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
  const [isVerified, setIsVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Modal Timer
  useEffect(() => {
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

  // Handle OTP Input Boxes
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    let newOtp = [...otpValues];
    newOtp[index] = element.value;
    setOtpValues(newOtp);
    setOtpInput(newOtp.join(""));
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleResendClick = async () => {
    setTimer(60);
    setCanResend(false);
    await handleSendOtp();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Mobile Validation: Sirf numbers allow karein
    if (name === 'mobile') {
      if (/\D/.test(value)) return; // Agar number nahi hai toh return
      if (value.length > 10) return; // 10 digit limit
      if (isVerified) setIsVerified(false);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCropChange = (crop) => {
    setFormData(prev => ({
      ...prev,
      crops: { ...prev.crops, [crop]: !prev.crops[crop] }
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      toast.error("❌ Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      toast.error("❌ Please enter a valid email address.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await axios.post(`${API_URL}/send-otp`, {
        mobile: formData.mobile,
        email: formData.email
      });
      if (res.data.success) {
        toast.success("OTP Sent Successfully!");
        setShowOtpModal(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, {
        mobile: formData.mobile,
        otp: otpInput
      });
      if (res.data.success) {
        setIsVerified(true);
        setShowOtpModal(false);
        setOtpValues(["", "", "", ""]);
        toast.success("✅ Mobile Verified!");
      }
    } catch (error) {
      toast.error("❌ Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }
    if (!isVerified) {
      toast.error("🛑 Please verify your mobile number first.");
      await handleSendOtp();
      return;
    }

    setLoading(true);
    try {
      // Data prepare kar rahe hain
      const payload = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        role: 'farmer',
        farmName: formData.fullName + "'s Farm",
        address: {
          village: formData.village,
          city: formData.city,
          state: formData.state,
          fullAddress: `${formData.village}, ${formData.city}, ${formData.state}`
        },
        crops: Object.keys(formData.crops)
          .filter(key => formData.crops[key])
          .map(key => ({ 
            // Agar "others" hai aur user ne naam likha hai, toh woh bhejenge
            name: (key === 'others' && formData.otherCropName) ? formData.otherCropName : key 
          }))
      };

      const response = await axios.post(`${API_URL}/register/farmer`, payload);
      if (response.data.success) {
        toast.success("✅ Registration Successful!");
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const states = ['Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'];
  const pickupTimes = ['Morning (6 AM - 10 AM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)'];
  const cropList = [
    { key: 'tomato', label: 'Tomato', emoji: '🍅' },
    { key: 'potato', label: 'Potato', emoji: '🥔' },
    { key: 'onion', label: 'Onion', emoji: '🧅' },
    { key: 'carrot', label: 'Carrot', emoji: '🥕' },
    { key: 'leafyVeg', label: 'Leafy Veg', emoji: '🥬' },
    { key: 'others', label: 'Others', emoji: 'add' }
  ];

  return (
    <div className="min-h-screen font-display antialiased text-gray-900 bg-[#f3fbf6] flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast Notification Container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ecfccb] via-[#f0fdf4] to-[#e0e7ff] opacity-80"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <span className="material-symbols-outlined text-green-600 text-4xl">eco</span>
        <h2 className="text-3xl font-black text-gray-900">AgriConnect</h2>
        <p className="mt-2 text-sm text-gray-600">Farmer Registration 🌾</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[1024px] relative z-10">
        <div className="glass-card shadow-xl rounded-2xl px-4 py-6 sm:px-10 sm:py-10 relative overflow-hidden bg-white/75 backdrop-blur-xl border border-white/60">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-700">person</span>
                  Personal Details
                </h3>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Ram Kumar" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <input required name="mobile" maxLength="10" value={formData.mobile} onChange={handleInputChange} className={`w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none ${isVerified ? 'border-green-500 bg-green-50' : ''}`} placeholder="9876543210" />
                    {!isVerified ? (
                      <button type="button" onClick={handleSendOtp} disabled={otpLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                        {otpLoading ? 'Sending...' : 'Verify'}
                      </button>
                    ) : (
                      <span className="flex items-center px-3 bg-green-100 text-green-700 rounded-lg font-bold">✓</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none" placeholder="ram@example.com" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input required name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none pr-10" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400">
                      <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility' : 'visibility_off'}</span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Confirm</label>
                    <input required name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              {/* Farm Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-700">location_on</span>
                  Farm Location
                </h3>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Village Address</label>
                  <input required name="village" value={formData.village} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none" placeholder="Your Village" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none" placeholder="District" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none">
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pickup Time</label>
                  <select name="pickup" value={formData.pickup} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none">
                    {pickupTimes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Crops Grid */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-green-700">potted_plant</span>
                What do you grow?
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {cropList.map(crop => (
                  <label key={crop.key} className="cursor-pointer group">
                    <input type="checkbox" className="peer sr-only" checked={formData.crops[crop.key]} onChange={() => handleCropChange(crop.key)} />
                    <div className="rounded-xl p-2 h-20 flex flex-col items-center justify-center text-center bg-white/50 border border-gray-200 peer-checked:bg-green-600 peer-checked:text-white transition-all shadow-sm">
                      <span className="text-xl mb-1">{crop.emoji === 'add' ? '➕' : crop.emoji}</span>
                      <span className="text-[10px] uppercase font-bold">{crop.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Conditional Input for 'Others' */}
              {formData.crops.others && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Please specify other crop name</label>
                  <input 
                    type="text"
                    name="otherCropName"
                    value={formData.otherCropName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Ex: Sugarcane, Cotton..."
                  />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-4 rounded-xl text-white font-black shadow-lg transition-all 
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'}`}
            >
              {loading ? 'Processing...' : 'Register as Farmer'}
            </button>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in duration-300">
            <h3 className="text-2xl font-bold text-center">Verification</h3>
            <p className="text-center text-gray-500 mb-6">OTP sent to {formData.email}</p>
            <div className="flex justify-center gap-3 mb-6">
              {otpValues.map((data, index) => (
                <input key={index} maxLength="1" className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:border-green-500 outline-none" value={data} onChange={(e) => handleOtpChange(e.target, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
              ))}
            </div>
            <button onClick={handleVerifyOtp} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mb-4 shadow-lg hover:bg-green-700">Verify Now</button>
            <div className="text-center">
              {canResend ? <button onClick={handleResendClick} className="text-green-600 font-bold">Resend Code</button> : <span className="text-gray-400">Resend in {timer}s</span>}
            </div>
            <button onClick={() => setShowOtpModal(false)} className="w-full mt-4 text-gray-400 font-bold hover:text-gray-600">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerRegistration;