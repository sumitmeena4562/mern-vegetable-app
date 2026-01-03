import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const FarmerRegistration = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

  // --- States ---
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
    otherCropName: '',
    crops: { tomato: true, potato: false, onion: false, carrot: false, leafyVeg: false, others: false }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // OTP States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Password UI
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // --- Helper: Loading Spinner Component ---
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // --- Logic ---
  const validateField = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "fullName":
        if (value.trim().length < 3 && value.length > 0) errorMsg = "Name must be at least 3 characters.";
        break;
      case "mobile":
        if (value.length > 0 && value.length !== 10) errorMsg = "Mobile number must be 10 digits.";
        else if (value.length > 0 && !/^[6-9]/.test(value)) errorMsg = "Must start with 6-9.";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length > 0 && !emailRegex.test(value)) errorMsg = "Invalid email format.";
        break;
      case "password":
        setPasswordStrength(checkPasswordStrength(value));
        if (value.length > 0 && value.length < 6) errorMsg = "Password must be at least 6 chars.";
        break;
      case "confirmPassword":
        if (value.length > 0 && value !== formData.password) errorMsg = "Passwords do not match.";
        break;
      case "otherCropName":
        if (formData.crops.others && !value.trim()) errorMsg = "Please specify the crop name.";
        break;
      default: break;
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength === 3) return "Medium";
    return "Strong";
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    // Improvement 3: Auto-Capitalize Names and Village
    if ((name === 'fullName' || name === 'village' || name === 'city') && value.length > 0) {
       value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (name === 'mobile') {
      if (/\D/.test(value)) return;
      if (value.length > 10) return;
      if (isVerified) setIsVerified(false);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleCropChange = (crop) => {
    setFormData(prev => ({
      ...prev,
      crops: { ...prev.crops, [crop]: !prev.crops[crop] }
    }));
  };

  const handleSendOtp = async () => {
    if (errors.mobile || errors.email || !formData.mobile || !formData.email) {
      toast.error("Please enter valid Mobile and Email.");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await axios.post(`${API_URL}/send-otp`, { mobile: formData.mobile, email: formData.email });
      if (res.data.success) {
        toast.success("OTP Sent!");
        setShowOtpModal(true);
        setTimer(60);
        setCanResend(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Timer Logic for Resend
  useEffect(() => {
    let interval;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

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
        toast.success("✅ Verified Successfully!");
      }
    } catch (error) {
      toast.error("❌ Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check errors
    const hasErrors = Object.values(errors).some(err => err !== "");
    const missingFields = !formData.fullName || !formData.mobile || !formData.email || !formData.password;

    // Improvement 2: Scroll to Error
    if (hasErrors || missingFields) {
      toast.error("Please fix the errors shown in red.");
      // Find the first field with an error and scroll to it
      const firstErrorKey = Object.keys(errors).find(key => errors[key]) || Object.keys(formData).find(key => !formData[key] && key !== 'otherCropName');
      if (firstErrorKey) {
        const element = document.getElementsByName(firstErrorKey)[0];
        if(element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!isVerified) {
      toast.error("🛑 Please verify your mobile number.");
      return;
    }
    if (passwordStrength < 2) {
      toast.error("⚠️ Password is too weak!");
      return;
    }

    setLoading(true);
    try {
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
          .map(key => {
            if (key === 'others') {
              return formData.otherCropName ? { name: formData.otherCropName } : null; 
            }
            return { name: key };
          })
          .filter(Boolean)
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

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    let newOtp = [...otpValues];
    newOtp[index] = element.value;
    setOtpValues(newOtp);
    setOtpInput(newOtp.join(""));
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };
  
  const handleKeyDown = (e, index) => {
     if (e.key === "Backspace" && !otpValues[index] && e.target.previousSibling) {
        e.target.previousSibling.focus();
     }
  };

  const states = ['Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'];
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
      <Toaster position="top-center" />
      
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
                  <input 
                    required name="fullName" value={formData.fullName} onChange={handleInputChange} 
                    className={`w-full rounded-lg py-2.5 px-3 bg-white/50 border outline-none transition ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-500 focus:ring-2'}`} 
                    placeholder="Ram Kumar" 
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="w-full">
                      <input 
                        required name="mobile" maxLength="10" value={formData.mobile} onChange={handleInputChange} 
                        className={`w-full rounded-lg py-2.5 px-3 bg-white/50 border outline-none ${errors.mobile ? 'border-red-500' : (isVerified ? 'border-green-500 bg-green-50' : 'border-gray-300')}`} 
                        placeholder="9876543210" 
                      />
                      {errors.mobile && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.mobile}</p>}
                    </div>
                    {!isVerified ? (
                      <button type="button" onClick={handleSendOtp} disabled={otpLoading || !!errors.mobile} className="bg-blue-600 text-white px-4 h-[46px] rounded-lg font-bold text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center min-w-[80px]">
                        {otpLoading ? <Spinner /> : 'Verify'}
                      </button>
                    ) : (
                      <span className="flex items-center justify-center w-[80px] h-[46px] bg-green-100 text-green-700 rounded-lg font-bold">✓</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input 
                    required type="email" name="email" value={formData.email} onChange={handleInputChange} 
                    className={`w-full rounded-lg py-2.5 px-3 bg-white/50 border outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                    placeholder="ram@example.com" 
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input 
                      required name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} 
                      className={`w-full rounded-lg py-2.5 px-3 bg-white/50 border outline-none pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} 
                      placeholder="••••••••" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                      <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility' : 'visibility_off'}</span>
                    </button>
                    
                    {formData.password && (
                        <div className="mt-2 transition-all duration-300">
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${getStrengthColor()} transition-all duration-500 ease-out`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-right mt-1 font-semibold text-gray-500">{getStrengthLabel()}</p>
                        </div>
                    )}
                     {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Confirm</label>
                    <input 
                      required name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} 
                      className={`w-full rounded-lg py-2.5 px-3 bg-white/50 border outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} 
                      placeholder="••••••••" 
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.confirmPassword}</p>}
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">City/District</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none" placeholder="District" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none bg-white">
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pickup Time</label>
                  <select name="pickup" value={formData.pickup} onChange={handleInputChange} className="w-full rounded-lg py-2.5 px-3 bg-white/50 border border-gray-300 outline-none bg-white">
                    {['Morning (6 AM - 10 AM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)'].map(t => <option key={t} value={t}>{t}</option>)}
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
                  <label key={crop.key} className="cursor-pointer group relative">
                    <input type="checkbox" className="peer sr-only" checked={formData.crops[crop.key]} onChange={() => handleCropChange(crop.key)} />
                    <div className="rounded-xl p-2 h-20 flex flex-col items-center justify-center text-center bg-white/50 border border-gray-200 peer-checked:bg-green-600 peer-checked:text-white transition-all shadow-sm hover:shadow-md">
                      <span className="text-xl mb-1">{crop.emoji === 'add' ? '➕' : crop.emoji}</span>
                      <span className="text-[10px] uppercase font-bold">{crop.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {formData.crops.others && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Specify Other Crop Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    name="otherCropName"
                    value={formData.otherCropName}
                    onChange={(e) => {
                        handleInputChange(e);
                        if(!e.target.value.trim()) setErrors(prev => ({...prev, otherCropName: "Required"}));
                        else setErrors(prev => ({...prev, otherCropName: ""}));
                    }}
                    className={`w-full rounded-lg py-2.5 px-3 bg-white/50 border outline-none 
                        ${errors.otherCropName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: Sugarcane, Cotton..."
                  />
                  {errors.otherCropName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.otherCropName}</p>}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || Object.values(errors).some(x => x !== "")} 
              className={`w-full py-4 rounded-xl text-white font-black shadow-lg transition-all flex items-center justify-center gap-2
                ${(loading || Object.values(errors).some(x => x !== "")) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'}`}
            >
              {loading ? <><Spinner /> Processing...</> : 'Register as Farmer'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Improvement 1: Fixed OTP Modal with Resend Button */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-center">Verification</h3>
            <p className="text-center text-gray-500 mb-6">OTP sent to <span className="font-bold text-gray-900">{formData.email}</span></p>
            <div className="flex justify-center gap-3 mb-6">
              {otpValues.map((data, index) => (
                <input key={index} maxLength="1" className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:border-green-500 outline-none" value={data} onChange={(e) => handleOtpChange(e.target, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
              ))}
            </div>
            <button onClick={handleVerifyOtp} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mb-4 shadow-lg hover:bg-green-700">Verify Now</button>
            
            {/* Resend Logic Added Here */}
            <div className="text-center">
              {canResend ? (
                <button 
                    onClick={() => { handleSendOtp(); setTimer(60); setCanResend(false); }} 
                    className="text-green-600 font-bold hover:underline transition"
                >
                    Resend Code
                </button> 
              ) : (
                <span className="text-gray-400 text-sm">Resend code in {timer}s</span>
              )}
              
              <div className="mt-3">
                <button onClick={() => setShowOtpModal(false)} className="text-gray-400 font-bold text-sm hover:text-gray-600 transition">
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerRegistration;