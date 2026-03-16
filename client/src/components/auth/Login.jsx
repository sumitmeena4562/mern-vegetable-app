import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';

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
    <div className="h-screen flex bg-slate-50 font-sans overflow-hidden">
      {/* 🚀 LEFT SIDE: PREMIUM BANNER (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden bg-slate-900 border-r border-slate-100/10">
        <img
          src="/brain/619ad8c0-e861-4076-8641-c0083538fb5e/agriconnect_login_banner_1773675710213.png"
          alt="AgriConnect Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-green-600 text-3xl">eco</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">AgriConnect</span>
          </Link>

          <div>
            <h1 className="text-4xl xl:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              Connect Directly <br />
              <span className="text-green-400">Grow Digitally.</span>
            </h1>
            <p className="text-base xl:text-lg text-slate-300 font-medium max-w-md leading-relaxed">
              Join India's most trusted agricultural network. Empowering farmers and vendors with real-time mandate market insights.
            </p>
          </div>

          <div className="flex gap-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <span>© 2024 AgriConnect</span>
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* 🚀 RIGHT SIDE: LOGIN FORM */}
      <div className="flex-1 flex flex-col justify-center relative bg-white lg:bg-slate-50 overflow-y-auto hide-scrollbar">
        <div className="mx-auto w-full max-w-[420px] py-8 px-6 sm:px-8 lg:px-4">
          {/* Logo (Mobile Only) */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl mx-auto border border-slate-100">
                <span className="material-symbols-outlined text-green-600 text-2xl font-bold">eco</span>
              </div>
            </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
              Welcome Back
            </h2>
            <p className="text-slate-500 font-bold text-[13px]">
              Enter your credentials to manage your business
            </p>
          </div>

          {/* Login Card - Compact Version */}
          <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200/60 border border-slate-100 relative group transition-all duration-500">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Login Toggle */}
              <div className="bg-slate-100/80 p-1 rounded-2xl flex relative">
                <div
                  className={`absolute inset-y-1 w-1/2 bg-white rounded-xl shadow-sm transition-all duration-300 ease-in-out ${loginMethod === 'otp' ? 'translate-x-[calc(100%-4px)]' : 'left-1'}`}
                />
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`relative z-10 flex-1 py-2 text-[10px] font-black uppercase tracking-wider text-center transition-colors duration-300 ${loginMethod === 'password' ? 'text-slate-900' : 'text-slate-400'}`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`relative z-10 flex-1 py-2 text-[10px] font-black uppercase tracking-wider text-center transition-colors duration-300 ${loginMethod === 'otp' ? 'text-slate-900' : 'text-slate-400'}`}
                >
                  OTP Sign-in
                </button>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <Input
                  label="Account Identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  icon="person"
                  placeholder="Mobile or Email"
                  className="rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white py-2.5"
                />

                {loginMethod === 'password' ? (
                  <div className="space-y-1">
                    <Input
                      label="Security Key"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      icon="lock"
                      placeholder="••••••••"
                      className="rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white py-2.5"
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-green-600 transition-colors p-1"
                        >
                          <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      }
                    />
                    <div className="flex justify-end pr-1">
                      <Link to="/forgot-password" title="Recover account" className="text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">Forgot Password?</Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      label="6-Digit OTP"
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      maxLength={6}
                      placeholder="••••••"
                      className="text-xl font-black text-center tracking-[0.4em] rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white py-2.5"
                      rightElement={
                        <Button
                          type="button"
                          onClick={sendOTP}
                          disabled={loading || otpTimer > 0}
                          variant="ghost"
                          size="sm"
                          className="mr-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50"
                        >
                          {otpTimer > 0 ? `Resend ${otpTimer}s` : 'Get Code'}
                        </Button>
                      }
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || isBlocked}
                isLoading={loading}
                fullWidth
                size="lg"
                className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 hover:shadow-green-200/50 shadow-xl transition-all font-black uppercase tracking-widest text-[10px] py-4"
              >
                Launch Dashboard
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Access Global Network</p>
              <div className="grid grid-cols-3 gap-2">
                <Link to="/farmer-registration" className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 border border-transparent hover:border-green-500/20 hover:bg-green-50 group transition-all">
                  <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-green-600 mb-1">agriculture</span>
                  <span className="text-[8px] font-black uppercase text-slate-500 group-hover:text-slate-900">Farmer</span>
                </Link>
                <Link to="/vendor-registration" className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-500/20 hover:bg-blue-50 group transition-all">
                  <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-blue-600 mb-1">storefront</span>
                  <span className="text-[8px] font-black uppercase text-slate-500 group-hover:text-slate-900">Vendor</span>
                </Link>
                <Link to="/customer-registration" className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 border border-transparent hover:border-orange-500/20 hover:bg-orange-50 group transition-all">
                  <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-orange-500 mb-1">shopping_basket</span>
                  <span className="text-[8px] font-black uppercase text-slate-500 group-hover:text-slate-900">Customer</span>
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] text-slate-400 font-bold">
            Trouble signing in? <Link to="#" className="text-emerald-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;