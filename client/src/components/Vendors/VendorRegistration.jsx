import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const VendorRegistration = () => {
  const navigate = useNavigate();

  // --- States ---
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    address: '',
    city: '',
    state: '',
    businessType: '', // Added below via cards
    shopType: 'kirana', // default fallback
    dailyCapacity: '',
    fssaiNumber: '',
    location: { type: 'Point', coordinates: [0, 0] }
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
  const [gpsLoading, setGpsLoading] = useState(false);

  // Dynamic location 
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);

  // OTP Refs
  const otpRefs = useRef([]);

  // --- Helper: Loading Spinner Component ---
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // GPS Logic
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude]
          }
        }));
        toast.success("Shop location captured successfully!");
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        let errorMsg = "Unable to retrieve your location";
        switch (error.code) {
          case 1: errorMsg = "⚠️ Permission Denied! Please allow location access."; break;
          case 2: errorMsg = "📡 GPS Unavailable! Please ensure your device location is ON."; break;
          case 3: errorMsg = "⏳ Request Timed Out! Please try again in an open area."; break;
          default: errorMsg = `❌ Location Error: ${error.message}`;
        }
        toast.error(errorMsg, { duration: 5000 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // --- Progress & Initial Data Load ---
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get('/locations/states');
        if (res.data.success) {
          setStates(res.data.states);
        }
      } catch (error) {
        console.error("Failed to load states", error);
        toast.error("Failed to load location data");
      }
    };

    const calculateProgress = () => {
      let progress = 0;
      const requiredFields = ['fullName', 'mobile', 'email', 'password', 'confirmPassword', 'address', 'city', 'state', 'shopName', 'dailyCapacity', 'businessType'];

      let filledFields = 0;
      requiredFields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== null && formData[field].toString().trim().length > 0) {
          filledFields++;
        }
      });

      if (isVerified) filledFields++; // OTP is one step

      progress = Math.floor((filledFields / (requiredFields.length + 1)) * 100);
      setFormProgress(Math.min(progress, 100));
    };

    calculateProgress();

    if (states.length === 0) {
      fetchStates();
    }
  }, [formData, isVerified, states.length]);

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
      case "shopName":
        if (value.trim().length < 3) errorMsg = "Shop name is too short.";
        break;
      case "address":
        if (value.trim().length < 5) errorMsg = "Please provide a detailed address.";
        break;
      case "city":
        if (!value) errorMsg = "Please select a district.";
        break;
      case "dailyCapacity":
        if (!value || isNaN(value) || Number(value) <= 0) errorMsg = "Valid capacity required (in kg).";
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
    return "bg-blue-500";
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
    return "text-blue-600";
  };

  // --- Input Handlers ---
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (['fullName', 'shopName'].includes(name)) {
      processedValue = value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    if (name === 'mobile') {
      if (/\D/.test(value)) return;
      if (value.length > 10) return;
      if (isVerified) setIsVerified(false);
      processedValue = value;
    }

    if (name === 'email') {
      processedValue = value.toLowerCase();
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));

    if (isTouched[name] || ['password', 'confirmPassword'].includes(name)) {
      validateField(name, processedValue);
    }

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(processedValue));
    }

    if (name === 'state') {
      setDistricts([]);
      setFormData(prev => ({ ...prev, city: '', [name]: value }));
      if (value) {
        setIsFetchingLocations(true);
        try {
          const res = await api.get(`/locations/districts/${value}`);
          if (res.data.success) {
            setDistricts(res.data.districts);
          }
        } catch (error) {
          toast.error("Could not fetch districts");
        } finally {
          setIsFetchingLocations(false);
        }
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // --- OTP Functions ---
  const handleSendOtp = async () => {
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
      const res = await api.post('/auth/send-otp', {
        mobile: formData.mobile,
        email: formData.email
      });

      if (res.data.success) {
        toast.success("OTP sent to your mobile and email!");
        setShowOtpModal(true);
        setTimer(60);
        setCanResend(false);
        setOtpError("");
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send OTP";
      toast.error(errorMsg);
      if (error.response?.status === 400 && errorMsg.includes("already registered")) {
        setErrors(prev => ({ ...prev, mobile: "Mobile number already registered" }));
      }
    } finally {
      setOtpLoading(false);
    }
  };

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
      const res = await api.post('/auth/verify-otp', {
        mobile: formData.mobile,
        otp: otpInput
      });

      if (res.data.success) {
        setIsVerified(true);
        setShowOtpModal(false);
        setOtpValues(["", "", "", ""]);
        setOtpInput("");
        toast.success("✅ Contact details verified successfully!");
        setTimeout(() => document.getElementsByName("password")[0]?.focus(), 300);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid OTP";
      setOtpError(errorMsg);
      toast.error("❌ " + errorMsg);
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

    if (element.value && index < 3 && element.nextSibling) {
      element.nextSibling.focus();
    }
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

    const fieldsToValidate = ['fullName', 'mobile', 'email', 'password', 'confirmPassword', 'address', 'city', 'state', 'shopName', 'dailyCapacity'];
    fieldsToValidate.forEach(field => validateField(field, formData[field]));

    const hasErrors = Object.values(errors).some(err => err !== "");
    if (hasErrors) {
      toast.error("Please fix the errors highlighted in red");
      return;
    }

    if (!formData.businessType) {
      toast.error("Please select a Business Type");
      return;
    }

    if (!isVerified) {
      toast.error("🛑 Please verify your mobile number via OTP");
      document.getElementsByName("mobile")[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        role: 'vendor',
        shopName: formData.shopName,
        shopType: formData.shopType,
        businessType: formData.businessType,
        dailyCapacity: Number(formData.dailyCapacity),
        fssaiNumber: formData.fssaiNumber || undefined,
        address: {
          shopAddress: formData.address,
          city: formData.city,
          state: formData.state,
          fullAddress: `${formData.address}, ${formData.city}, ${formData.state}`
        },
        location: formData.location
      };

      const response = await api.post('/vendors/register', payload);

      if (response.data.success) {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 border-blue-500`}>
            <div className="flex-1 w-0 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center animate-bounce">
                    <span className="material-symbols-outlined text-2xl text-blue-600">storefront</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-lg font-bold text-gray-900">Registration Successful! 🎉</p>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">Welcome to <span className="font-bold text-blue-600">AgriConnect</span>! We are setting up your workspace.</p>
                  <p className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span> Redirecting...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ), { duration: 4000, position: 'top-center' });

        setTimeout(() => navigate('/login'), 3500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed!";
      toast.error(`❌ ${errorMsg}`);

      if (errorMsg.includes("already registered") || errorMsg.includes("exists")) {
        if (errorMsg.includes("mobile") || errorMsg.includes("Mobile")) setErrors(prev => ({ ...prev, mobile: "Mobile number already registered" }));
        if (errorMsg.includes("email") || errorMsg.includes("Email")) setErrors(prev => ({ ...prev, email: "Email already registered" }));
      }
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    { id: 'retailer', label: 'Retailer', emoji: '🏪' },
    { id: 'wholesaler', label: 'Wholesaler', emoji: '🏢' },
    { id: 'restaurant', label: 'Restaurant', emoji: '🥢' },
    { id: 'hotel', label: 'Hotel', emoji: '🏨' },
  ];

  const passwordRequirements = [
    { text: "At least 6 characters", met: formData.password.length >= 6 },
    { text: "At least one uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "At least one number", met: /[0-9]/.test(formData.password) },
    { text: "Strong password", met: passwordStrength >= 3 }
  ];

  return (
    <div className="min-h-screen font-display antialiased text-slate-900 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-300/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-indigo-300/20 rounded-full blur-[80px]"></div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-slate-200 z-40">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${formProgress}%` }}
        ></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 transform hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-5xl">storefront</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">AgriConnect</h2>
        <p className="mt-2 text-sm font-medium text-blue-700">Vendor Registration Portal 🛒</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[1024px] relative z-10">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl px-4 py-6 sm:px-10 sm:py-10 relative overflow-hidden border border-white/60">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">

              {/* --- Left Column: Personal --- */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-700 bg-blue-100 p-2 rounded-full">person</span>
                    Personal Details
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Required</span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} onBlur={handleBlur}
                    className={`w-full rounded-xl py-3 px-4 bg-white border outline-none transition-all ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                    placeholder="Enter your full name" maxLength={50} />
                  {errors.fullName && <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">+91</span>
                      <input name="mobile" value={formData.mobile} onChange={handleInputChange} onBlur={handleBlur}
                        className={`w-full rounded-xl py-3 pl-12 pr-4 bg-white border outline-none ${errors.mobile ? 'border-red-500' : isVerified ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                        placeholder="9876543210" maxLength={10} inputMode="numeric" />
                      {errors.mobile && <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.mobile}</p>}
                    </div>
                    {!isVerified ? (
                      <button type="button" onClick={handleSendOtp} disabled={otpLoading || !!errors.mobile || !formData.mobile}
                        className="bg-slate-900 text-white px-6 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50 min-w-[100px] shadow-lg shadow-slate-900/20">
                        {otpLoading ? <Spinner /> : 'Verify'}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center min-w-[100px] h-[52px] bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl font-bold border border-emerald-200 px-4">
                        <span className="material-symbols-outlined mr-2">check_circle</span> Verified
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur}
                    className={`w-full rounded-xl py-3 px-4 bg-white border outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                    placeholder="vendor@company.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} onBlur={handleBlur}
                      className={`w-full rounded-xl py-3 px-4 bg-white border outline-none pr-12 ${errors.password ? 'border-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                      placeholder="Create a strong password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">
                      <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${getStrengthTextColor()}`}>Strength: {getStrengthLabel()}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${getStrengthColor()} transition-all duration-500`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} onBlur={handleBlur}
                      className={`w-full rounded-xl py-3 px-4 bg-white border outline-none pr-12 ${errors.confirmPassword ? 'border-red-500' : formData.confirmPassword && formData.confirmPassword === formData.password ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                      placeholder="Re-enter your password" />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* --- Right Column: Shop & Location --- */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-700 bg-emerald-100 p-2 rounded-full">store</span>
                    Shop & Location
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">Required</span>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-blue-800">Auto-detect Location</h4>
                    <p className="text-xs text-blue-600">Capture accurate shop location</p>
                  </div>
                  <button type="button" onClick={handleGetLocation} disabled={gpsLoading}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1">
                    {gpsLoading ? "Detecting..." : <><span className="material-symbols-outlined text-sm">my_location</span> Use GPS</>}
                  </button>
                </div>
                {formData.location?.coordinates?.[0] !== 0 && (
                  <p className="text-xs text-blue-600 font-bold ml-1">✓ Coordinates Captured</p>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Shop/Business Name <span className="text-red-500">*</span></label>
                  <input name="shopName" value={formData.shopName} onChange={handleInputChange} onBlur={handleBlur}
                    className="w-full rounded-xl py-3 px-4 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="E.g. Fresh Mart, The Grand Hotel" />
                  {errors.shopName && <p className="text-red-500 text-xs mt-2"><span className="material-symbols-outlined text-sm align-middle">error</span> {errors.shopName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">State <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select name="state" value={formData.state} onChange={handleInputChange} className="w-full rounded-xl py-3 pl-4 pr-10 bg-white border border-slate-300 outline-none appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm">
                        <option value="">Select State</option>
                        {states.map(stateName => <option key={stateName} value={stateName}>{stateName}</option>)}
                      </select>
                      <span className="absolute right-3 top-3.5 material-symbols-outlined text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">City/District <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select name="city" value={formData.city} onChange={handleInputChange} disabled={!formData.state || isFetchingLocations} onBlur={handleBlur}
                        className={`w-full rounded-xl py-3 pl-4 pr-10 border outline-none appearance-none shadow-sm ${!formData.state ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}>
                        <option value="">Select District</option>
                        {districts.map((d, i) => <option key={i} value={d}>{d}</option>)}
                      </select>
                      <div className="absolute right-3 top-3.5 text-slate-400 pointer-events-none">
                        {isFetchingLocations ? <Spinner /> : <span className="material-symbols-outlined">expand_more</span>}
                      </div>
                    </div>
                    {errors.city && <p className="text-red-500 text-xs mt-2">{errors.city}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Address <span className="text-red-500">*</span></label>
                  <input name="address" value={formData.address} onChange={handleInputChange} onBlur={handleBlur}
                    className="w-full rounded-xl py-3 px-4 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Street, Landmark, Area" />
                  {errors.address && <p className="text-red-500 text-xs mt-2"><span className="material-symbols-outlined text-sm align-middle">error</span> {errors.address}</p>}
                </div>
              </div>
            </div>

            {/* --- Business Category Section --- */}
            <div className="pt-8 border-t border-slate-200">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-indigo-700 bg-indigo-100 p-2 rounded-full">business</span>
                What describes your business? <span className="text-red-500">*</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {businessTypes.map((type) => (
                  <label key={type.id} className="cursor-pointer group relative">
                    <input type="radio" name="businessType" value={type.id} className="peer sr-only"
                      checked={formData.businessType === type.id}
                      onChange={handleInputChange} />
                    <div className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center border-2 transition-all duration-300 ${formData.businessType === type.id ? 'bg-indigo-50 border-indigo-500 shadow-md shadow-indigo-100' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                      <span className="text-3xl mb-2">{type.emoji}</span>
                      <span className="text-sm font-bold text-slate-700">{type.label}</span>
                      {formData.businessType === type.id && (
                        <span className="absolute -top-2 -right-2 bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm">✓</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Daily Buying Capacity (kg) <span className="text-red-500">*</span></label>
                  <input name="dailyCapacity" type="number" min="1" value={formData.dailyCapacity} onChange={handleInputChange} onBlur={handleBlur}
                    className="w-full rounded-xl py-3 px-4 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="e.g. 50" />
                  {errors.dailyCapacity && <p className="text-red-500 text-xs mt-2">{errors.dailyCapacity}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">FSSAI License Number <span className="text-slate-400 font-normal text-xs">(Optional)</span></label>
                  <input name="fssaiNumber" value={formData.fssaiNumber} onChange={handleInputChange}
                    className="w-full rounded-xl py-3 px-4 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="e.g. 10012022000... " />
                </div>
              </div>
            </div>

            {/* --- Submit Section --- */}
            <div className="pt-6">
              <button type="submit" disabled={loading || Object.values(errors).some(x => x) || !isVerified || formProgress < 100}
                className={`w-full py-4 rounded-xl text-white font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all ${loading || Object.values(errors).some(x => x) || !isVerified || formProgress < 100 ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 hover:shadow-2xl hover:shadow-blue-500/30'}`}>
                {loading ? <><Spinner /> Registering...</> : <><span className="material-symbols-outlined">how_to_reg</span> Register as Vendor</>}
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-slate-600">Already have an account? <a href="/login" className="font-bold text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2">Login here</a></p>
                <p className="text-xs text-slate-500 mt-2">By registering, you agree to our Terms of Service</p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* --- OTP Modal --- */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setShowOtpModal(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-300 border border-white/20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 text-blue-600"><span className="material-symbols-outlined text-3xl">lock_clock</span></div>
              <h3 className="text-2xl font-black text-slate-900">Contact Verification</h3>
              <p className="text-slate-600 mt-2 text-sm">Enter the 4-digit OTP sent to</p>
              <p className="font-bold text-slate-800 mt-1 flex items-center justify-center gap-2"><span className="material-symbols-outlined text-sm text-blue-600">smartphone</span>+91 {formData.mobile}</p>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              {otpValues.map((data, index) => (
                <input key={index} ref={el => otpRefs.current[index] = el} maxLength="1"
                  className={`w-14 h-14 border-2 rounded-xl text-center text-2xl font-bold outline-none ${otpError ? 'border-red-500 focus:border-red-500 ring-4 ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'}`}
                  value={data} onChange={(e) => handleOtpChange(e.target, index)} onKeyDown={e => handleOtpKeyDown(e, index)} onPaste={handlePasteOtp} inputMode="numeric" />
              ))}
            </div>
            {otpError && <p className="text-center text-red-600 text-sm font-semibold mb-6 flex justify-center items-center gap-1"><span className="material-symbols-outlined text-sm">error</span> {otpError}</p>}

            <button onClick={handleVerifyOtp} disabled={otpLoading || otpInput.length !== 4}
              className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 mb-4 ${otpInput.length === 4 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg active:scale-95 transition-all' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>
              {otpLoading ? <Spinner /> : <><span className="material-symbols-outlined">check_circle</span> Verify OTP</>}
            </button>

            <div className="text-center">
              {canResend ? (
                <button onClick={() => { handleSendOtp(); setTimer(60); setCanResend(false); }} className="text-blue-600 font-bold hover:text-blue-800 w-full py-2 hover:bg-blue-50 rounded-lg">Resend Verification Code</button>
              ) : (
                <p className="text-slate-500 text-sm">Resend code in <span className="font-bold text-blue-600">{timer}s</span></p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRegistration;