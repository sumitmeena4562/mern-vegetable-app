import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FarmerRegistration = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";
  const navigate = useNavigate();

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
    crops: { tomato: false, potato: false, onion: false, carrot: false, leafyVeg: false, others: false }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  
  // OTP States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState("");
  
  // Password UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isTouched, setIsTouched] = useState({});

  // Ref for OTP inputs
  const otpRefs = useRef([]);

  // --- Helper: Loading Spinner Component ---
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // --- Progress Calculation ---
  useEffect(() => {
    const calculateProgress = () => {
      let progress = 0;
      const requiredFields = ['fullName', 'mobile', 'email', 'password', 'confirmPassword', 'village', 'city'];
      
      requiredFields.forEach(field => {
        if (formData[field] && formData[field].trim().length > 0) {
          progress += 10;
        }
      });
      
      // Check if at least one crop is selected
      const hasCropSelected = Object.values(formData.crops).some(val => val === true);
      if (hasCropSelected) progress += 10;
      
      // Check if other crop is specified when selected
      if (formData.crops.others && formData.otherCropName.trim()) progress += 10;
      
      // Mobile verification
      if (isVerified) progress += 20;
      
      setFormProgress(Math.min(progress, 100));
    };
    
    calculateProgress();
  }, [formData, isVerified]);

  // --- Validation Logic ---
  const validateField = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "fullName":
        if (value.trim().length < 3) errorMsg = "Name must be at least 3 characters.";
        else if (!/^[A-Za-z\s]+$/.test(value)) errorMsg = "Name can only contain letters and spaces.";
        break;
      case "mobile":
        if (value.length !== 10) errorMsg = "Mobile number must be 10 digits.";
        else if (!/^[6-9]\d{9}$/.test(value)) errorMsg = "Must be a valid Indian mobile number.";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errorMsg = "Invalid email format.";
        break;
      case "password":
        if (value.length < 6) errorMsg = "Password must be at least 6 characters.";
        else if (!/(?=.*[A-Z])/.test(value)) errorMsg = "Must contain at least one uppercase letter.";
        else if (!/(?=.*[0-9])/.test(value)) errorMsg = "Must contain at least one number.";
        break;
      case "confirmPassword":
        if (value !== formData.password) errorMsg = "Passwords do not match.";
        break;
      case "village":
        if (value.trim().length < 2) errorMsg = "Village name is too short.";
        break;
      case "city":
        if (value.trim().length < 2) errorMsg = "City name is too short.";
        break;
      case "otherCropName":
        if (formData.crops.others && !value.trim()) errorMsg = "Please specify the crop name.";
        break;
      default: break;
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    setIsTouched(prev => ({ ...prev, [name]: true }));
  };

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 5);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "Very Weak";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    if (passwordStrength === 4) return "Strong";
    return "Very Strong";
  };

  const getStrengthTextColor = () => {
    if (passwordStrength <= 2) return "text-red-600";
    if (passwordStrength === 3) return "text-yellow-600";
    return "text-green-600";
  };

  // --- Input Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Auto-capitalize names
    if (['fullName', 'village', 'city'].includes(name)) {
      processedValue = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    // Mobile number formatting
    if (name === 'mobile') {
      if (/\D/.test(value)) return;
      if (value.length > 10) return;
      if (isVerified) setIsVerified(false);
      processedValue = value;
    }
    
    // Email lowercase
    if (name === 'email') {
      processedValue = value.toLowerCase();
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Real-time validation
    if (isTouched[name] || ['password', 'confirmPassword'].includes(name)) {
      validateField(name, processedValue);
    }
    
    // Update password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(processedValue));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleCropChange = (crop) => {
    const newCrops = { ...formData.crops, [crop]: !formData.crops[crop] };
    setFormData(prev => ({ ...prev, crops: newCrops }));
    
    // Clear other crop name if "others" is unchecked
    if (crop === 'others' && !newCrops.others) {
      setFormData(prev => ({ ...prev, otherCropName: '' }));
      setErrors(prev => ({ ...prev, otherCropName: '' }));
    }
  };

  // --- OTP Functions ---
  const handleSendOtp = async () => {
    // Validate mobile and email first
    validateField('mobile', formData.mobile);
    validateField('email', formData.email);
    
    if (errors.mobile || errors.email || !formData.mobile || !formData.email) {
      toast.error("Please fix mobile/email errors before verification");
      return;
    }
    
    if (formData.mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setOtpLoading(true);
    try {
      const res = await axios.post(`${API_URL}/send-otp`, { 
        mobile: formData.mobile, 
        email: formData.email 
      });
      
      if (res.data.success) {
        toast.success("OTP sent to your mobile and email!");
        setShowOtpModal(true);
        setTimer(60);
        setCanResend(false);
        setOtpError("");
        // Focus first OTP input
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send OTP";
      toast.error(errorMsg);
      
      // Handle specific errors
      if (error.response?.status === 400) {
        if (errorMsg.includes("already registered")) {
          setErrors(prev => ({ ...prev, mobile: "Mobile number already registered" }));
        }
      }
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
    if (otpInput.length !== 4) {
      setOtpError("Please enter complete 4-digit OTP");
      return;
    }
    
    setOtpLoading(true);
    setOtpError("");
    
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, {
        mobile: formData.mobile,
        otp: otpInput
      });
      
      if (res.data.success) {
        setIsVerified(true);
        setShowOtpModal(false);
        setOtpValues(["", "", "", ""]);
        setOtpInput("");
        toast.success("✅ Mobile verified successfully!");
        
        // Auto-focus password field after verification
        setTimeout(() => {
          document.getElementsByName("password")[0]?.focus();
        }, 300);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid OTP";
      setOtpError(errorMsg);
      toast.error("❌ " + errorMsg);
      
      // Clear OTP on error
      setOtpValues(["", "", "", ""]);
      setOtpInput("");
      otpRefs.current[0]?.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    
    let newOtp = [...otpValues];
    newOtp[index] = element.value;
    setOtpValues(newOtp);
    
    const joinedOtp = newOtp.join("");
    setOtpInput(joinedOtp);
    setOtpError("");
    
    // Auto-focus next input
    if (element.value && index < 3 && element.nextSibling) {
      element.nextSibling.focus();
    }
    
    // Auto-verify when 4 digits entered
    if (joinedOtp.length === 4) {
      setTimeout(() => handleVerifyOtp(), 300);
    }
  };
  
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      e.preventDefault();
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      e.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpValues(digits);
      setOtpInput(pastedData);
      otpRefs.current[3]?.focus();
    }
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const fieldsToValidate = ['fullName', 'mobile', 'email', 'password', 'confirmPassword', 'village', 'city'];
    fieldsToValidate.forEach(field => {
      validateField(field, formData[field]);
    });
    
    if (formData.crops.others) {
      validateField('otherCropName', formData.otherCropName);
    }
    
    // Check for errors
    const hasErrors = Object.values(errors).some(err => err !== "");
    if (hasErrors) {
      toast.error("Please fix the errors highlighted in red");
      
      // Find and scroll to first error
      const firstErrorKey = Object.keys(errors).find(key => errors[key]);
      if (firstErrorKey) {
        const element = document.getElementsByName(firstErrorKey)[0];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }
    
    // Check required fields
    const requiredFields = ['fullName', 'mobile', 'email', 'password', 'confirmPassword', 'village', 'city'];
    const missingField = requiredFields.find(field => !formData[field].trim());
    if (missingField) {
      toast.error(`Please fill in ${missingField.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      const element = document.getElementsByName(missingField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    // Check crop selection
    const hasCropSelected = Object.values(formData.crops).some(val => val === true);
    if (!hasCropSelected) {
      toast.error("Please select at least one crop you grow");
      return;
    }
    
    if (!isVerified) {
      toast.error("🛑 Please verify your mobile number");
      document.getElementsByName("mobile")[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    if (passwordStrength < 2) {
      toast.error("⚠️ Password is too weak! Please use a stronger password");
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
              return { name: formData.otherCropName.trim() };
            }
            return { name: key.charAt(0).toUpperCase() + key.slice(1) };
          }),
        pickupTime: formData.pickup
      };

      const response = await axios.post(`${API_URL}/register/farmer`, payload);
      
      if (response.data.success) {
        toast.success("✅ Registration Successful! Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed!";
      toast.error(`❌ ${errorMsg}`);
      
      // Handle duplicate registration
      if (errorMsg.includes("already exists") || errorMsg.includes("already registered")) {
        if (errorMsg.includes("mobile")) {
          setErrors(prev => ({ ...prev, mobile: "Mobile number already registered" }));
        }
        if (errorMsg.includes("email")) {
          setErrors(prev => ({ ...prev, email: "Email already registered" }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Data ---
  const states = ['Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 
                  'Rajasthan', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Kerala', 
                  'West Bengal', 'Bihar', 'Odisha', 'Telangana', 'Andhra Pradesh'];
  
  const cropList = [
    { key: 'tomato', label: 'Tomato', emoji: '🍅' },
    { key: 'potato', label: 'Potato', emoji: '🥔' },
    { key: 'onion', label: 'Onion', emoji: '🧅' },
    { key: 'carrot', label: 'Carrot', emoji: '🥕' },
    { key: 'leafyVeg', label: 'Leafy Veg', emoji: '🥬' },
    { key: 'others', label: 'Others', emoji: '🌾' }
  ];

  // Password requirements checklist
  const passwordRequirements = [
    { text: "At least 6 characters", met: formData.password.length >= 6 },
    { text: "At least one uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "At least one number", met: /[0-9]/.test(formData.password) },
    { text: "Strong password (recommended)", met: passwordStrength >= 3 }
  ];

  return (
    <div className="min-h-screen font-display antialiased text-gray-900 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
          },
        }}
      />
      
      {/* Background Pattern - FIXED SVG URL */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-green-300/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-yellow-300/20 rounded-full blur-[80px]"></div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-40">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 ease-out"
          style={{ width: `${formProgress}%` }}
        ></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-xl shadow-green-500/25 mb-4 transform hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-5xl">eco</span>
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">AgriConnect</h2>
        <p className="mt-2 text-sm font-medium text-emerald-700">Farmer Registration Portal 🌾</p>
        <div className="mt-4 text-xs text-gray-500">
          Progress: {formProgress}% • {formProgress >= 100 ? "Ready to submit!" : "Complete all fields"}
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[1024px] relative z-10">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl px-4 py-6 sm:px-10 sm:py-10 relative overflow-hidden border border-white/60">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
              
              {/* Personal Details Column */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-700 bg-green-100 p-2 rounded-full">person</span>
                    Personal Details
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    Required
                  </span>
                </div>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl py-3 px-4 bg-white border outline-none transition-all duration-200 ${
                      errors.fullName 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    }`}
                    placeholder="Enter your full name"
                    maxLength={50}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Mobile Number with Verification */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400">+91</span>
                        </div>
                        <input 
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full rounded-xl py-3 pl-12 pr-4 bg-white border outline-none ${
                            errors.mobile 
                              ? 'border-red-500' 
                              : isVerified 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-300'
                          }`}
                          placeholder="9876543210"
                          maxLength={10}
                          inputMode="numeric"
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {errors.mobile}
                        </p>
                      )}
                    </div>
                    {!isVerified ? (
                      <button 
                        type="button" 
                        onClick={handleSendOtp}
                        disabled={otpLoading || !!errors.mobile || !formData.mobile}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 h-[52px] rounded-xl font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] shadow-lg shadow-blue-500/25"
                      >
                        {otpLoading ? <Spinner /> : 'Send OTP'}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center min-w-[100px] h-[52px] bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-bold border border-green-200 px-4">
                        <span className="material-symbols-outlined mr-2">verified</span>
                        Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl py-3 px-4 bg-white border outline-none transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    }`}
                    placeholder="name@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-xl py-3 px-4 bg-white border outline-none pr-12 ${
                        errors.password 
                          ? 'border-red-500' 
                          : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${getStrengthTextColor()}`}>
                          Strength: {getStrengthLabel()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {passwordStrength}/5
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor()} transition-all duration-500 ease-out`} 
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Password Requirements */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-sm ${
                              req.met ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {req.met ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span className={`text-xs ${req.met ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-xl py-3 px-4 bg-white border outline-none pr-12 ${
                        errors.confirmPassword 
                          ? 'border-red-500' 
                          : formData.confirmPassword && formData.confirmPassword === formData.password
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                      }`}
                      placeholder="Re-enter your password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Farm Details Column */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3">
                    <span className="material-symbols-outlined text-yellow-700 bg-yellow-100 p-2 rounded-full">location_on</span>
                    Farm Location
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    Required
                  </span>
                </div>
                
                   {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full rounded-xl py-3 px-4 bg-white border border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    >
                      {states.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      City/District <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-xl py-3 px-4 bg-white border outline-none ${
                        errors.city 
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                      }`}
                      placeholder="District name"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {errors.city}
                      </p>
                    )}
                  </div>
                
                </div>
                {/* Village */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Village/Town <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl py-3 px-4 bg-white border outline-none ${
                      errors.village 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    }`}
                    placeholder="Your village or town name"
                  />
                  {errors.village && (
                    <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.village}
                    </p>
                  )}
                </div>

             

                {/* Pickup Time */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Preferred Pickup Time <span className="text-gray-500 text-xs">(For collection agents)</span>
                  </label>
                  <select 
                    name="pickup"
                    value={formData.pickup}
                    onChange={handleInputChange}
                    className="w-full rounded-xl py-3 px-4 bg-white border border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    {['Morning (6 AM - 10 AM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)', 'Flexible'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Our collection agent will visit during this time slot
                  </p>
                </div>
              </div>
            </div>

            {/* Crops Selection */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-700 bg-green-100 p-2 rounded-full">potted_plant</span>
                  What do you grow? <span className="text-red-500">*</span>
                </h3>
                <span className="text-xs font-semibold px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Select at least one
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {cropList.map((crop, index) => (
                  <label 
                    key={crop.key} 
                    className={`cursor-pointer group relative transition-all duration-200 ${
                      formData.crops[crop.key] 
                        ? 'scale-105' 
                        : 'hover:scale-102'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={formData.crops[crop.key]} 
                      onChange={() => handleCropChange(crop.key)} 
                    />
                    <div className={`rounded-2xl p-4 h-24 flex flex-col items-center justify-center text-center border-2 transition-all duration-300 shadow-sm ${
                      formData.crops[crop.key]
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg shadow-green-200/50'
                        : 'bg-white/70 border-gray-200 group-hover:border-green-300 group-hover:bg-green-50/50'
                    }`}>
                      <span className="text-2xl mb-2">{crop.emoji}</span>
                      <span className="text-xs uppercase font-bold text-gray-700">{crop.label}</span>
                      {formData.crops[crop.key] && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Other Crop Input */}
              {formData.crops.others && (
                <div className="mt-8 animate-in fade-in slide-in-from-top-3 duration-300">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Specify Other Crop(s) <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-xs font-normal ml-2">(Separate multiple crops with commas)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      name="otherCropName"
                      value={formData.otherCropName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-xl py-3 px-4 bg-white border outline-none ${
                        errors.otherCropName 
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                      }`}
                      placeholder="Example: Sugarcane, Cotton, Turmeric, etc."
                    />
                    <div className="absolute right-3 top-3 text-gray-400">
                      <span className="material-symbols-outlined">agriculture</span>
                    </div>
                  </div>
                  {errors.otherCropName && (
                    <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.otherCropName}
                    </p>
                  )}
                  {formData.otherCropName && !errors.otherCropName && (
                    <p className="text-green-600 text-xs mt-2 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Great! We'll add these to your profile.
                    </p>
                  )}
                </div>
              )}

              {/* Selected Crops Summary */}
              {Object.values(formData.crops).some(val => val) && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-green-700">checklist</span>
                    <h4 className="font-bold text-green-800">Selected Crops</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.crops)
                      .filter(([key, value]) => value)
                      .map(([key, value]) => (
                        <span 
                          key={key} 
                          className="px-3 py-1.5 bg-white border border-green-300 rounded-lg text-sm font-medium text-green-800 flex items-center gap-1"
                        >
                          {key === 'others' ? (
                            <>
                              <span className="material-symbols-outlined text-sm">agriculture</span>
                              {formData.otherCropName || 'Other Crops'}
                            </>
                          ) : (
                            <>
                              {cropList.find(c => c.key === key)?.emoji}
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </>
                          )}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading || Object.values(errors).some(x => x !== "") || !isVerified || formProgress < 100}
                className={`w-full py-4 rounded-xl text-white font-black text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-3
                  ${(loading || Object.values(errors).some(x => x !== "") || !isVerified || formProgress < 100) 
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 active:scale-98 hover:shadow-2xl hover:shadow-emerald-500/30'
                  }`}
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">how_to_reg</span>
                    <span>Register as Farmer</span>
                  </>
                )}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a 
                    href="/login" 
                    className="font-bold text-green-700 hover:text-green-800 underline decoration-2 decoration-green-300 underline-offset-2 transition-colors"
                  >
                    Login here
                  </a>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* OTP Modal */}
      {showOtpModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setShowOtpModal(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-300 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 mb-4">
                <span className="material-symbols-outlined text-3xl text-blue-600">lock</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900">Mobile Verification</h3>
              <p className="text-gray-600 mt-2">
                Enter the 4-digit OTP sent to
              </p>
              <p className="font-bold text-gray-900 mt-1">
                +91 {formData.mobile} • {formData.email}
              </p>
            </div>
            
            {/* OTP Input */}
            <div className="mb-8">
              <div className="flex justify-center gap-4 mb-6">
                {otpValues.map((data, index) => (
                  <input 
                    key={index}
                    ref={el => otpRefs.current[index] = el}
                    maxLength="1"
                    className={`w-16 h-16 border-2 rounded-xl text-center text-3xl font-bold outline-none transition-all duration-200 ${
                      otpError 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
                    }`}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onPaste={handlePasteOtp}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              
              {otpError && (
                <p className="text-center text-red-600 text-sm font-semibold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {otpError}
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handleVerifyOtp}
                disabled={otpLoading || otpInput.length !== 4}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                  otpInput.length === 4
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {otpLoading ? (
                  <>
                    <Spinner />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
              
              {/* Resend Section */}
              <div className="text-center space-y-3">
                {canResend ? (
                  <button 
                    onClick={() => { 
                      handleSendOtp(); 
                      setTimer(60); 
                      setCanResend(false); 
                    }} 
                    className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Resend Code
                  </button>
                ) : (
                  <div className="space-y-2">
                    <span className="text-gray-500 text-sm">
                      Resend code in <span className="font-bold">{timer}s</span>
                    </span>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-1000"
                        style={{ width: `${(timer / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => setShowOtpModal(false)}
                    className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
                  >
                    Cancel Verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerRegistration;