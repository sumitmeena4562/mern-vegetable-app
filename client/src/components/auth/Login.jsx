import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

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
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateForm = () => {
    if (!formData.identifier) return "Mobile number or Email is required";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
    const isMobile = /^[6-9]\d{9}$/.test(formData.identifier);

    if (loginMethod === 'otp' && !isMobile && !isEmail) {
      return "For OTP Login, please enter a valid mobile number or email";
    }
    if (!isEmail && !isMobile) {
      return "Please enter a valid mobile number or email address";
    }
    if (loginMethod === 'password') {
      if (!formData.password) return "Password is required";
      if (formData.password.length < 6) return "Password must be at least 6 characters";
    } else {
      if (!otp) return "OTP is required";
      if (!/^\d{4,6}$/.test(otp)) return "OTP must be valid";
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value.substring(0, 6));
  };

  const sendOTP = async () => {
    const isMobile = /^[6-9]\d{9}$/.test(formData.identifier);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);

    if (!isMobile && !isEmail) {
      toast.error("Please enter a valid mobile number or email for OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/send-otp', { mobile: formData.identifier, type: 'login' });
      if (response.data.success) {
        setOtpSent(true);
        setOtpTimer(300);
        toast.success("OTP sent successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked) return toast.error("Too many attempts. Try again later.");

    const errorMsg = validateForm();
    if (errorMsg) return toast.error(errorMsg);

    setLoading(true);
    try {
      let response;
      if (loginMethod === 'password') {
        response = await api.post('/auth/login', {
          identifier: formData.identifier,
          password: formData.password
        }, { withCredentials: true });
      } else {
        response = await api.post('/auth/login-with-otp', { mobile: formData.identifier, otp });
      }

      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user));

        if (rememberMe) localStorage.setItem('rememberedUser', formData.identifier);
        else localStorage.removeItem('rememberedUser');

        login(token, user);
        setAttempts(0);
        toast.success("Welcome back!");

        const redirectPaths = {
          'farmer': '/farmer-dashboard/',
          'vendor': '/vendor-dashboard/',
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
      // toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-slate-50 to-emerald-50 pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-green-200/20 to-emerald-200/20 blur-[100px] animate-pulse" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-200/20 to-teal-200/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block relative group">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl shadow-green-500/20 transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <span className="material-symbols-outlined text-5xl text-white">eco</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-black text-slate-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-slate-500 font-medium">
            Sign in to manage your farm & orders
          </p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 p-8 sm:p-10 border border-white/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Login Toggle */}
            <div className="bg-slate-100/80 p-1.5 rounded-2xl flex relative">
              <div
                className={`absolute inset-y-1.5 w-1/2 bg-white rounded-xl shadow-sm transition-all duration-300 ease-spring ${loginMethod === 'otp' ? 'translate-x-[calc(100%-4px)]' : 'left-1.5'}`}
              />
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`relative z-10 flex-1 py-2.5 text-sm font-bold text-center transition-colors duration-300 ${loginMethod === 'password' ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`relative z-10 flex-1 py-2.5 text-sm font-bold text-center transition-colors duration-300 ${loginMethod === 'otp' ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                OTP Verification
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-5">
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email or Mobile</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-green-500 transition-colors">person</span>
                  <input
                    name="identifier"
                    type="text"
                    value={formData.identifier}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all shadow-inner"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              {loginMethod === 'password' ? (
                <div className="group">
                  <div className="flex justify-between mb-2 ml-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <Link to="/forgot-password" className="text-xs font-bold text-green-600 hover:text-green-700">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-green-500 transition-colors">lock</span>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-12 font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all shadow-inner"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-xl leading-none">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2 ml-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">One Time Password</label>
                    {otpSent && <span className="text-xs font-medium text-green-600 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Sent</span>}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={otp}
                      onChange={handleOtpChange}
                      maxLength={6}
                      className="flex-1 bg-slate-50 border-none rounded-2xl py-3.5 px-4 font-mono text-xl font-bold text-center tracking-[0.5em] text-slate-800 placeholder-slate-300 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all shadow-inner"
                      placeholder="••••••"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={loading || otpTimer > 0}
                    className={`w-full py-3 rounded-xl text-sm font-bold border-2 border-dashed transition-all ${otpTimer > 0
                      ? 'border-slate-200 text-slate-400 bg-slate-50'
                      : 'border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300'}`}
                  >
                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Request OTP'}
                  </button>
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center ml-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || isBlocked}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-500/20 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Or create new account</p>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/farmer-registration" className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 text-slate-600 text-sm font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-100 transition-all">
                <span className="material-symbols-outlined text-lg">agriculture</span>
                Farmer
              </Link>
              <Link to="/vendor-registration" className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 text-slate-600 text-sm font-bold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 transition-all">
                <span className="material-symbols-outlined text-lg">storefront</span>
                Vendor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;