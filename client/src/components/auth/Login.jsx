import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setFormData(prev => ({ ...prev, identifier: rememberedUser }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateForm = () => {
    if (!formData.identifier) return "Mobile number or Email is required";

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
    const isMobile = /^[6-9]\d{9}$/.test(formData.identifier);

    if (loginMethod === 'otp' && !isMobile) {
      return "For OTP Login, please enter a valid 10-digit mobile number";
    }

    if (!isEmail && !isMobile) {
      return "Please enter a valid mobile number or email address";
    }

    if (loginMethod === 'password') {
      if (!formData.password) return "Password is required";
      if (formData.password.length < 6) return "Password must be at least 6 characters";
    } else {
      if (!otp) return "OTP is required";
      if (!/^\d{6}$/.test(otp)) return "OTP must be 6 digits";
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow everything for identifier, filter for password usually nothing
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(Math.min(score, 5));
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value.substring(0, 6));
  };

  const sendOTP = async () => {
    const isMobile = /^[6-9]\d{9}$/.test(formData.identifier);
    if (!isMobile) {
      toast.error("Please enter a valid mobile number for OTP verification");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        '/auth/send-otp',
        { mobile: formData.identifier }
      );

      if (response.data.success) {
        setOtpSent(true);
        setOtpTimer(300);
        toast.success("OTP sent to your mobile!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error("Too many attempts. Please try again after 5 minutes.");
      return;
    }

    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setLoading(true);

    try {
      let response;

      if (loginMethod === 'password') {
        const payload = {
          identifier: formData.identifier,
          password: formData.password
        };

        response = await api.post(
          '/auth/login',
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
      } else {
        response = await api.post(
          '/auth/login-with-otp',
          { mobile: formData.identifier, otp }
        );
      }

      if (response.data.success) {
        const { token, user } = response.data.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user));

        if (rememberMe) {
          localStorage.setItem('rememberedUser', formData.mobile);
        } else {
          localStorage.removeItem('rememberedUser');
        }

        login(token, user);
        setAttempts(0);
        toast.success("Login Successful!");

        const redirectPaths = {
          'farmer': '/farmer-dashboard/',
          'vendor': '/vendor/dashboard',
          'customer': '/customer/dashboard',
          'admin': '/admin/dashboard'
        };

        navigate(redirectPaths[user.role] || '/');
      }
    } catch (err) {
      console.error('Login error:', err);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsBlocked(true);
        setTimeout(() => { setIsBlocked(false); setAttempts(0); }, 5 * 60 * 1000);
      }

      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-display antialiased text-gray-900 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      <Toaster position="top-center" />

      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-green-300/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-yellow-300/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <Link to="/" className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-xl shadow-green-500/25 mb-4 transform hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-5xl">eco</span>
        </Link>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">AgriConnect</h2>
        <p className="mt-2 text-sm font-medium text-emerald-700">Welcome Back! Please Sign In 👋</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl px-4 py-8 sm:px-10 relative overflow-hidden border border-white/60">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Login Method Switcher */}
            <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${loginMethod === 'password' ? 'bg-white shadow-md text-green-700 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${loginMethod === 'otp' ? 'bg-white shadow-md text-green-700 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
              >
                OTP Login
              </button>
            </div>

            {/* Mobile/Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mobile Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400">person</span>
                </div>
                <input
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full rounded-xl py-3 pl-10 pr-4 bg-white border border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-medium"
                  placeholder="Enter mobile or email"
                  type="text"
                />
              </div>
            </div>

            {/* Password Login Fields */}
            {loginMethod === 'password' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-green-600 hover:underline">Forgot?</Link>
                </div>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl py-3 px-4 bg-white border border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                {/* Password Strength Indicator (Visual Only for Login, match Register style) */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1 mb-1">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div
                          key={item}
                          className={`flex-1 rounded-full transition-all duration-300 ${item <= passwordStrength ? getStrengthColor() : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* OTP Login Fields */}
            {loginMethod === 'otp' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">OTP Verification</label>
                <div className="flex gap-2">
                  <input
                    name="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    className="flex-1 rounded-xl py-3 px-4 bg-white border border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 text-center tracking-[0.5em] font-bold text-lg"
                    placeholder="XXXXXX"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={loading || otpTimer > 0}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm whitespace-nowrap"
                  >
                    {otpTimer > 0 ? `Resend ${otpTimer}s` : 'Get OTP'}
                  </button>
                </div>
                {otpSent && <p className="text-xs text-green-600 font-bold mt-2 flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">check_circle</span> OTP sent successfully</p>}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isBlocked}
              className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>Sign In <span className="material-symbols-outlined">login</span></>
              )}
            </button>
          </form>

          {/* Footer - Register Links */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-500 text-sm font-medium mb-4">Don't have an account?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/farmer-registration" className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-800 rounded-xl font-bold hover:bg-green-100 transition-colors">
                <span className="material-symbols-outlined text-sm">agriculture</span> Farmer
              </Link>
              <Link to="/vendor-registration" className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                <span className="material-symbols-outlined text-sm">storefront</span> Vendor
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;