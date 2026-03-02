import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import PersonalInfoSection from './Registration/PersonalInfoSection';
import BusinessDetailsSection from './Registration/BusinessDetailsSection';
import LocationSection from './Registration/LocationSection';

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
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errorMsg = "Invalid email format.";
        break;
      }
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
        } catch {
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

      <div className="sm:mx-auto sm:w-full sm:max-w-[700px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 mb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Info (Indigo Theme) */}
          <PersonalInfoSection
            formData={formData}
            errors={errors}
            isTouched={isTouched}
            handleChange={handleInputChange}
            handleBlur={handleBlur}
            isVerified={isVerified}
            passwordStrength={passwordStrength}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            handleSendOtp={handleSendOtp}
            loading={otpLoading}
          />

          {/* Section 2: Location (Cyan Theme) */}
          <LocationSection
            formData={formData}
            errors={errors}
            isTouched={isTouched}
            handleChange={handleInputChange}
            handleBlur={handleBlur}
            states={states}
            districts={districts}
            isFetchingLocations={isFetchingLocations}
            gpsLoading={gpsLoading}
            handleGetLocation={handleGetLocation}
          />

          {/* Section 3: Business Details (Violet Theme) */}
          <BusinessDetailsSection
            formData={formData}
            errors={errors}
            isTouched={isTouched}
            handleChange={handleInputChange}
            handleBlur={handleBlur}
            businessTypes={businessTypes}
          />

          {/* Submit Section */}
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <button
              type="submit"
              disabled={loading || Object.values(errors).some(x => x) || !isVerified || formProgress < 100}
              className={`w-full py-4 rounded-full text-white font-bold text-[16px] shadow-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98]
                ${loading || Object.values(errors).some(x => x) || !isVerified || formProgress < 100
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl shadow-slate-200'}
              `}
            >
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</>
              ) : (
                <><span className="material-symbols-outlined">how_to_reg</span> Complete Vendor Setup</>
              )}
            </button>

            <p className="mt-6 text-center text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">Sign in here</a>
            </p>
          </div>
        </form>
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