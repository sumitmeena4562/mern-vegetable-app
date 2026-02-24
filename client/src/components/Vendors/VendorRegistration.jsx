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
    <div className="min-h-screen font-display antialiased text-slate-900 bg-slate-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Elite UI Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-teal-400/5 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          style={{ width: `${formProgress}%` }}
        ></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-4 rounded-[2rem] bg-white shadow-xl shadow-indigo-100/50 mb-6 group border border-slate-100 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
            <span className="material-symbols-outlined text-4xl text-white">storefront</span>
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-3">Agri<span className="text-indigo-600">Connect</span></h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <p className="text-sm font-bold text-indigo-700 uppercase tracking-widest">Vendor Portal 🛒</p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[1024px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <div className="bg-white/80 backdrop-blur-2xl shadow-2xl shadow-slate-200/50 rounded-[2.5rem] px-6 py-8 sm:px-12 sm:py-12 relative border border-white shadow-inner">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">

              {/* --- Left Column: Personal --- */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-black text-xl text-slate-800 flex items-center gap-3 tracking-tight">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[22px]">person</span>
                    </div>
                    Personal Details
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100/50">Required</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name <span className="text-rose-500">*</span></label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} onBlur={handleBlur}
                      className={`w-full rounded-2xl py-4 px-5 bg-slate-50 border outline-none font-bold text-slate-800 shadow-sm transition-all duration-300 ${errors.fullName ? 'border-rose-300 bg-rose-50/50 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200/80 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'}`}
                      placeholder="Enter your full name" maxLength={50} />
                    {errors.fullName && <p className="text-rose-500 text-xs mt-2 font-bold flex items-center gap-1.5 px-1 animate-in slide-in-from-top-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Mobile Number <span className="text-rose-500">*</span></label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className={`text-sm font-black ${isVerified ? 'text-emerald-600' : 'text-slate-400 group-focus-within:text-indigo-500'} transition-colors`}>+91</span>
                        </div>
                        <input name="mobile" value={formData.mobile} onChange={handleInputChange} onBlur={handleBlur}
                          className={`w-full rounded-2xl py-4 pl-12 pr-4 border outline-none font-bold shadow-sm transition-all duration-300 ${errors.mobile ? 'bg-rose-50/50 border-rose-300 focus:ring-4 focus:ring-rose-500/10 text-rose-800' : isVerified ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200/80 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'}`}
                          placeholder="9876543210" maxLength={10} inputMode="numeric" />
                        {errors.mobile && <p className="text-rose-500 text-xs mt-2 font-bold flex items-center gap-1.5 px-1 animate-in slide-in-from-top-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.mobile}</p>}
                      </div>
                      {!isVerified ? (
                        <button type="button" onClick={handleSendOtp} disabled={otpLoading || !!errors.mobile || !formData.mobile}
                          className="bg-slate-900 text-white px-6 rounded-2xl font-black text-sm hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:shadow-none min-w-[110px] shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center">
                          {otpLoading ? <Spinner /> : 'Verify'}
                        </button>
                      ) : (
                        <div className="flex items-center justify-center min-w-[110px] bg-emerald-50 text-emerald-600 rounded-2xl font-black border border-emerald-200/80 px-4 shadow-sm">
                          <span className="material-symbols-outlined text-[18px] mr-1.5 animate-pulse">check_circle</span> Verified
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address <span className="text-rose-500">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur}
                      className={`w-full rounded-2xl py-4 px-5 bg-slate-50 border outline-none font-bold text-slate-800 shadow-sm transition-all duration-300 ${errors.email ? 'border-rose-300 bg-rose-50/50 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200/80 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'}`}
                      placeholder="vendor@company.com" />
                    {errors.email && <p className="text-rose-500 text-xs mt-2 font-bold flex items-center gap-1.5 px-1 animate-in slide-in-from-top-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                      <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} onBlur={handleBlur}
                        className={`w-full rounded-2xl py-4 pl-5 pr-12 bg-slate-50 border outline-none font-bold text-slate-800 shadow-sm transition-all duration-300 ${errors.password ? 'border-rose-300 bg-rose-50/50 focus:ring-4 focus:ring-rose-500/10' : 'border-slate-200/80 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'}`}
                        placeholder="Create a strong password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1 bg-white rounded-lg shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-4 px-1 space-y-2.5 animate-in fade-in">
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${getStrengthTextColor()}`}>Strength: {getStrengthLabel()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full ${getStrengthColor()} transition-all duration-700 ease-out`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                        </div>
                      </div>
                    )}
                    {errors.password && <p className="text-rose-500 text-xs mt-2 font-bold flex items-center gap-1.5 px-1 animate-in slide-in-from-top-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm Password <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                      <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} onBlur={handleBlur}
                        className={`w-full rounded-2xl py-4 pl-5 pr-12 border outline-none font-bold shadow-sm transition-all duration-300 ${errors.confirmPassword ? 'bg-rose-50/50 border-rose-300 focus:ring-4 focus:ring-rose-500/10 text-rose-800' : formData.confirmPassword && formData.confirmPassword === formData.password ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200/80 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'}`}
                        placeholder="Re-enter your password" />
                      {formData.confirmPassword && formData.confirmPassword === formData.password && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-emerald-500">check_circle</span>
                      )}
                    </div>
                    {errors.confirmPassword && <p className="text-rose-500 text-xs mt-2 font-bold flex items-center gap-1.5 px-1 animate-in slide-in-from-top-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* --- Right Column: Shop & Location --- */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-black text-xl text-slate-800 flex items-center gap-3 tracking-tight">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[22px]">store</span>
                    </div>
                    Shop Location
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50">Required</span>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-white shadow-md shadow-indigo-100/40   flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-[13px] font-black text-indigo-900 tracking-wide mb-1">Auto-detect Location</h4>
                      <p className="text-[11px] font-bold text-indigo-500/80 uppercase tracking-widest">For exact market reach</p>
                    </div>
                    <button type="button" onClick={handleGetLocation} disabled={gpsLoading}
                      className="relative z-10 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-indigo-700/40 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-75 disabled:active:scale-100">
                      {gpsLoading ? (
                        <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Detecting...</>
                      ) : (
                        <><span className="material-symbols-outlined text-[16px]">my_location</span> Use GPS</>
                      )}
                    </button>
                  </div>
                  {formData.location?.coordinates?.[0] !== 0 && (
                    <p className="text-xs text-emerald-600 font-bold ml-1 flex items-center gap-1 animate-in fade-in"><span className="material-symbols-outlined text-[14px]">my_location</span> Location coordinates captured accurately.</p>
                  )}

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Shop/Business Name <span className="text-rose-500">*</span></label>
                    <input name="shopName" value={formData.shopName} onChange={handleInputChange} onBlur={handleBlur}
                      className="w-full rounded-2xl py-4 px-5 bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-slate-300"
                      placeholder="E.g. Fresh Mart, The Grand Hotel" />
                    {errors.shopName && <p className="text-rose-500 text-xs mt-2 font-bold px-1 animate-in slide-in-from-top-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">error</span> {errors.shopName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">State <span className="text-rose-500">*</span></label>
                      <div className="relative group">
                        <select name="state" value={formData.state} onChange={handleInputChange} className="w-full rounded-2xl py-4 pl-5 pr-12 bg-slate-50 border border-slate-200/80 outline-none appearance-none font-bold text-slate-800 shadow-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 hover:border-slate-300 cursor-pointer">
                          <option value="" className="text-slate-400 font-medium">Select State</option>
                          {states.map(stateName => <option key={stateName} value={stateName} className="font-bold">{stateName}</option>)}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors">expand_content</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">City/District <span className="text-rose-500">*</span></label>
                      <div className="relative group">
                        <select name="city" value={formData.city} onChange={handleInputChange} disabled={!formData.state || isFetchingLocations} onBlur={handleBlur}
                          className={`w-full rounded-2xl py-4 pl-5 pr-12 border outline-none appearance-none font-bold shadow-sm transition-all duration-300 cursor-pointer ${!formData.state ? 'bg-slate-100 border-slate-200/50 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200/80 text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300'}`}>
                          <option value="" className="font-medium">Select District</option>
                          {districts.map((d, i) => <option key={i} value={d} className="font-bold">{d}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          {isFetchingLocations ? <span className="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin block"></span> : <span className={`material-symbols-outlined ${formData.state ? 'group-hover:text-emerald-500' : ''} transition-colors`}>expand_content</span>}
                        </div>
                      </div>
                      {errors.city && <p className="text-rose-500 text-xs mt-2 font-bold px-1">{errors.city}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Detailed Address <span className="text-rose-500">*</span></label>
                    <input name="address" value={formData.address} onChange={handleInputChange} onBlur={handleBlur}
                      className="w-full rounded-2xl py-4 px-5 bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-slate-300"
                      placeholder="Street, Landmark, Area" />
                    {errors.address && <p className="text-rose-500 text-xs mt-2 font-bold px-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">error</span> {errors.address}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Business Category Section --- */}
            <div className="pt-10 border-t border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h3 className="font-black text-2xl text-slate-800 flex items-center gap-3 tracking-tight">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[26px]">business_center</span>
                  </div>
                  <div className="flex flex-col">
                    <span>Business Model <span className="text-rose-500 text-lg">*</span></span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Select how you operate</span>
                  </div>
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
                {businessTypes.map((type) => (
                  <label key={type.id} className="cursor-pointer group relative">
                    <input type="radio" name="businessType" value={type.id} className="peer sr-only"
                      checked={formData.businessType === type.id}
                      onChange={handleInputChange} />
                    <div className={`rounded-3xl p-6 flex flex-col items-center justify-center text-center border-2 transition-all duration-300 ${formData.businessType === type.id ? 'bg-purple-50/80 border-purple-500 shadow-lg shadow-purple-200/50 scale-[1.02]' : 'bg-slate-50 border-slate-200/80 hover:border-purple-300 hover:bg-white hover:shadow-md'}`}>
                      <span className={`text-4xl mb-3 transition-transform duration-300 ${formData.businessType === type.id ? 'scale-110' : 'group-hover:scale-110'}`}>{type.emoji}</span>
                      <span className={`text-sm font-black tracking-wide ${formData.businessType === type.id ? 'text-purple-800' : 'text-slate-600 group-hover:text-purple-600'}`}>{type.label}</span>
                      {formData.businessType === type.id && (
                        <div className="absolute -top-3 -right-3 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/30 animate-in zoom-in">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Daily Cap (kg) <span className="text-rose-500">*</span></label>
                  <input name="dailyCapacity" type="number" min="1" value={formData.dailyCapacity} onChange={handleInputChange} onBlur={handleBlur}
                    className="w-full rounded-2xl py-4 px-5 bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-slate-300"
                    placeholder="E.g. 50" />
                  {errors.dailyCapacity && <p className="text-rose-500 text-xs mt-2 font-bold px-1">{errors.dailyCapacity}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">FSSAI License Number <span className="font-semibold text-slate-400 ml-1 lowercase">(Optional)</span></label>
                  <input name="fssaiNumber" value={formData.fssaiNumber} onChange={handleInputChange}
                    className="w-full rounded-2xl py-4 px-5 bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-slate-300"
                    placeholder="E.g. 10012022000..." />
                </div>
              </div>
            </div>

            {/* --- Submit Section --- */}
            <div className="pt-10">
              <button type="submit" disabled={loading || Object.values(errors).some(x => x) || !isVerified || formProgress < 100}
                className={`w-full py-5 rounded-2xl text-white font-black text-lg tracking-wide shadow-2xl flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden relative group
                                ${loading || Object.values(errors).some(x => x) || !isVerified || formProgress < 100
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none border border-slate-200'
                    : 'bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-500/40 active:scale-[0.98]'}`}>
                {loading && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                )}
                <div className="relative z-10 flex items-center gap-3">
                  {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</> : <><span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">bolt</span> Complete Vendor Setup</>}
                </div>
              </button>

              <div className="mt-8 text-center bg-slate-50/50 py-4 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-slate-600">Already a registered vendor? <a href="/login" className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 decoration-2 underline-offset-4 transition-colors">Sign in here</a></p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* --- OTP Modal --- */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={e => e.target === e.currentTarget && setShowOtpModal(false)}>
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 w-full max-w-md shadow-2xl border border-white animate-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-50 border border-indigo-100 shadow-sm mb-6 text-indigo-600 transform hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-4xl">mark_email_read</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Verify Contact</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Enter the 4-digit OTP sent to</p>
              <div className="inline-flex items-center justify-center gap-2 mt-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-[16px] text-indigo-500">smartphone</span>
                <p className="font-black text-slate-800">+91 {formData.mobile}</p>
              </div>
            </div>

            <div className="flex justify-center gap-4 sm:gap-6 mb-8">
              {otpValues.map((data, index) => (
                <input key={index} ref={el => otpRefs.current[index] = el} maxLength="1"
                  className={`w-14 h-16 sm:w-16 sm:h-20 border-2 rounded-2xl text-center text-3xl font-black outline-none shadow-sm transition-all duration-300 ${otpError ? 'border-rose-400 bg-rose-50 text-rose-700 focus:ring-4 focus:ring-rose-500/20' : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10'}`}
                  value={data} onChange={(e) => handleOtpChange(e.target, index)} onKeyDown={e => handleOtpKeyDown(e, index)} onPaste={handlePasteOtp} inputMode="numeric" />
              ))}
            </div>
            {otpError && <p className="text-center text-rose-500 text-sm font-bold mb-6 flex justify-center items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">error</span> {otpError}</p>}

            <button onClick={handleVerifyOtp} disabled={otpLoading || otpInput.length !== 4}
              className={`w-full py-5 rounded-2xl font-black flex justify-center items-center gap-2 mb-6 transition-all duration-300 ${otpInput.length === 4 ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 active:scale-[0.98]' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}>
              {otpLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <><span className="material-symbols-outlined text-[2xl]">shield_check</span> Verify Securely</>}
            </button>

            <div className="text-center">
              {canResend ? (
                <button onClick={() => { handleSendOtp(); setTimer(60); setCanResend(false); }} className="text-indigo-600 font-bold hover:text-indigo-800 hover:bg-indigo-50 px-6 py-2 rounded-xl transition-colors">Resend Verification Code</button>
              ) : (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">Resend code in <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md text-sm">{timer}s</span></p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRegistration;