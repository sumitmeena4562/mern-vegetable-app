import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import CustomSelect from '../common/CustomSelect';
import PersonalInfoSection from './Registration/PersonalInfoSection';
import LocationSection from './Registration/LocationSection';
import FarmDetailsSection from './Registration/FarmDetailsSection';
import CropsSection from './Registration/CropsSection';
import Button from '../ui/Button';
import Loader from '../ui/Loader';


const FarmerRegistration = () => {
  // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth"; // REMOVED
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
    state: '', // ✅ Fix: Default value empty rakhi taaki user khud select kare
    farmSize: '', // ✅ Added farmSize
    pickup: 'Morning (6 AM - 10 AM)',
    otherCropName: '',
    crops: { tomato: false, potato: false, onion: false, carrot: false, leafyVeg: false, others: false },
    location: { type: 'Point', coordinates: [0, 0] } // Default location
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
  // ✅ Fix: Variable ka naam 'states' kiya (plural) taaki niche map function kaam kare
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);

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
        toast.success("Location captured successfully!");
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        let errorMsg = "Unable to retrieve your location";
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMsg = "⚠️ Permission Denied! Please allow location access in your browser settings.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMsg = "📡 GPS Unavailable! Please ensure your device location is turned ON.";
            break;
          case 3: // TIMEOUT
            errorMsg = "⏳ Request Timed Out! Please try again in an open area.";
            break;
          default:
            errorMsg = `❌ Location Error: ${error.message}`;
        }
        toast.error(errorMsg, { duration: 5000 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };



  // Ref for OTP inputs
  const otpRefs = useRef([]);

  // --- Progress & Initial Data Load ---
  useEffect(() => {
    // 1. States Fetch Karna
    const fetchStates = async () => {
      try {
        const res = await api.get('/locations/states');

        if (res.data.success) {
          // ✅ Fix: res.data.state ki jagah res.data.states (Backend se match kiya)
          setStates(res.data.states);
        }
      } catch (error) {
        console.error("Failed to load states", error);
        toast.error("Failed to load location data");
      }
    };

    // 2. Progress Bar Calculation
    const calculateProgress = () => {
      let progress = 0;
      const requiredFields = ['fullName', 'mobile', 'email', 'password', 'confirmPassword', 'village', 'city', 'state', 'farmSize']; // Added farmSize

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

    // Sirf tab call karein agar list khali ho (Optimization)
    if (states.length === 0) {
      fetchStates();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, isVerified]); // states dependency hatayi taaki infinite loop na ho

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
      case "village":
        if (value.trim().length < 2) errorMsg = "Village name is too short.";
        break;
      case "city":
        if (!value) errorMsg = "Please select a district."; // Changed validation for select
        break;
      case "otherCropName":
        if (formData.crops.others && !value.trim()) errorMsg = "Please specify the crop name.";
        break;
      case "farmSize":
        if (!value || isNaN(value) || Number(value) <= 0) errorMsg = "Please enter a valid farm size (in acres).";
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

    // Auto-capitalize names
    if (['fullName', 'village'].includes(name)) {
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

    // 👇 Logic: Agar 'state' change hua toh Districts mangwao
    if (name === 'state') {
      setDistricts([]);
      setFormData(prev => ({ ...prev, city: '', [name]: value })); // Update state value immediately

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

  const handleCropToggle = (crop) => {
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
      const res = await api.post('/auth/verify-otp', {
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
    const fieldsToValidate = ['fullName', 'mobile', 'email', 'password', 'confirmPassword', 'village', 'city', 'state'];
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
    const requiredFields = ['fullName', 'mobile', 'email', 'password', 'confirmPassword', 'village', 'city', 'state', 'farmSize'];
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
      // Map pickup time to backend enum
      const pickupMapping = {
        'Morning (6 AM - 10 AM)': 'morning',
        'Afternoon (12 PM - 4 PM)': 'afternoon',
        'Evening (4 PM - 8 PM)': 'evening',
        'Flexible': 'any'
      };

      const payload = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        role: 'farmer',
        farmName: formData.fullName + "'s Farm",
        farmSize: formData.farmSize, // ✅ Added Farm Size
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
        preferredPickupTime: pickupMapping[formData.pickup] || 'morning', // ✅ Fix: Map to lowercase enum
        location: formData.location // Backend expects { type: 'Point', coordinates: [lng, lat] }
      };

      const response = await api.post('/farmers/register', payload);

      if (response.data.success) {
        // Premium Custom Toast
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 border-green-500`}
          >
            <div className="flex-1 w-0 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                    <span className="material-symbols-outlined text-2xl text-green-600">celebration</span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-lg font-bold text-gray-900">
                    Welcome to the Family! 🌾
                  </p>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                    Your account has been successfully created. Get ready to grow with <span className="font-bold text-green-600">AgriConnect</span>.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-green-600 flex items-center gap-1">
                    <Loader variant="inline" color="green" />
                    Redirecting to login...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ), {
          duration: 4000,
          position: 'top-center',
        });

        setTimeout(() => {
          navigate('/login');
        }, 3500);
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


  // Password requirements checklist


  return (
    <div className="min-h-screen font-display antialiased text-slate-900 bg-[#E8F8EC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">

      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Updated SVG URL with single quotes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-green-300/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-yellow-300/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10 flex flex-col items-center">
        <div className="h-16 w-16 mb-4 rounded-[20px] bg-[#2AC47E] flex items-center justify-center text-white shadow-[0_8px_16px_rgba(42,196,126,0.3)]">
          <span className="material-symbols-outlined text-[32px]">eco</span>
        </div>
        <h2 className="text-[28px] font-black text-slate-900 tracking-tight">AgriConnect</h2>
        <div className="mt-1 text-sm font-bold text-emerald-500 flex items-center justify-center gap-1">
          Farmer Registration Portal <span className="text-[14px]">🌾</span>
        </div>
        <div className="mt-3 text-[12px] font-medium text-slate-500">
          Progress: {formProgress}% • {formProgress >= 100 ? "Ready to submit!" : "Complete all fields"}
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[1024px] relative z-10">
        <div className="bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)] rounded-[36px] px-6 py-8 sm:px-12 sm:py-12 relative overflow-hidden">

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">

              {/* Column 1: Personal Details & Location */}
              <div className="space-y-8">
                <PersonalInfoSection
                  formData={formData}
                  errors={errors}
                  isTouched={isTouched}
                  handleChange={handleInputChange}
                  handleBlur={handleBlur}
                  isVerified={isVerified}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  passwordStrength={passwordStrength}
                  setShowOtpModal={setShowOtpModal}
                  handleSendOtp={handleSendOtp}
                  loading={otpLoading}
                />

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
              </div>

              {/* Column 2: Farm Details & Crops */}
              <div className="space-y-8">
                <FarmDetailsSection
                  formData={formData}
                  errors={errors}
                  isTouched={isTouched}
                  handleChange={handleInputChange}
                  handleBlur={handleBlur}
                />

                <CropsSection
                  formData={formData}
                  errors={errors}
                  isTouched={isTouched}
                  handleCropToggle={handleCropToggle}
                  handleChange={handleInputChange}
                  handleBlur={handleBlur}
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100 mt-8">
              <Button
                type="submit"
                disabled={loading || Object.values(errors).some(x => x !== "") || !isVerified || formProgress < 100}
                isLoading={loading}
                fullWidth
                icon={!loading && <span className="material-symbols-outlined text-[20px]">person_add</span>}
                className="rounded-full py-4 text-[17px]"
              >
                {loading ? 'Registering...' : 'Register as Farmer'}
              </Button>

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

      {/* OTP Modal with Matching Green Theme */}
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-emerald-50 mb-4 shadow-inner">
                <span className="material-symbols-outlined text-3xl text-green-600">lock_clock</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900">Mobile Verification</h3>
              <p className="text-gray-600 mt-2">
                Enter the 4-digit OTP sent to
              </p>
              <p className="font-bold text-gray-900 mt-1 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm text-green-600">smartphone</span>
                +91 {formData.mobile}
                <span className="text-gray-300">|</span>
                <span className="material-symbols-outlined text-sm text-green-600">mail</span>
                {formData.email}
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
                    className={`w-16 h-16 border-2 rounded-xl text-center text-3xl font-bold outline-none transition-all duration-200 ${otpError
                      ? 'border-red-500 focus:border-red-500 ring-4 ring-red-100'
                      : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100'
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
                <p className="text-center text-red-600 text-sm font-semibold flex items-center justify-center gap-2 animate-pulse">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {otpError}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleVerifyOtp}
                disabled={otpLoading || otpInput.length !== 4}
                isLoading={otpLoading}
                fullWidth
                size="lg"
                icon={!otpLoading && <span className="material-symbols-outlined">check_circle</span>}
                className="rounded-xl"
              >
                {otpLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              {/* Resend Section */}
              <div className="text-center space-y-3">
                {canResend ? (
                  <button
                    onClick={() => {
                      handleSendOtp();
                      setTimer(60);
                      setCanResend(false);
                    }}
                    className="text-green-600 font-bold hover:text-green-800 transition-colors flex items-center justify-center gap-2 w-full py-2 hover:bg-green-50 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Resend Verification Code
                  </button>
                ) : (
                  <div className="space-y-2">
                    <span className="text-gray-500 text-sm">
                      Resend code in <span className="font-bold text-green-600">{timer}s</span>
                    </span>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${(timer / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button
                    onClick={() => setShowOtpModal(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors flex items-center justify-center gap-1 w-full"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
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