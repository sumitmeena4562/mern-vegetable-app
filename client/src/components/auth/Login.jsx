// components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import loginHeroImage from '../../assets/login_hero.png';

const Login = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  // Load remembered user on mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setFormData(prev => ({ ...prev, mobile: rememberedUser }));
      setRememberMe(true);
    }
  }, []);

  // OTP Timer effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.mobile) {
      errors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (loginMethod === 'password') {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    } else {
      if (!otp) {
        errors.otp = "OTP is required";
      } else if (!/^\d{6}$/.test(otp)) {
        errors.otp = "OTP must be 6 digits";
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'mobile' ? value.replace(/\D/g, '') : value
    }));
    setError('');
    setFieldErrors({});
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value.substring(0, 6));
    setFieldErrors(prev => ({ ...prev, otp: '' }));
  };

  const sendOTP = async () => {
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      setFieldErrors({ mobile: "Please enter a valid mobile number first" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/send-otp`,
        { mobile: formData.mobile }
      );

      if (response.data.success) {
        setOtpSent(true);
        setOtpTimer(300); // 5 minutes
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      setError("Too many attempts. Please try again after 5 minutes.");
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError(Object.values(validationErrors)[0]);
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      let response;

      if (loginMethod === 'password') {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/login`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 10000,
            withCredentials: true
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/login-with-otp`,
          {
            mobile: formData.mobile,
            otp
          }
        );
      }

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user));

        // Remember me functionality
        if (rememberMe) {
          localStorage.setItem('rememberedUser', formData.mobile);
        } else {
          localStorage.removeItem('rememberedUser');
        }

        // Use auth context
        login(token, user);

        // Reset attempts on successful login
        setAttempts(0);

        // Redirect based on role
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

      // Handle failed attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsBlocked(true);
        setTimeout(() => {
          setIsBlocked(false);
          setAttempts(0);
        }, 5 * 60 * 1000);
      }

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Social login with ${provider}`);
    // window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: 'gray' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const colors = ['red', 'orange', 'yellow', 'green'];
    return { strength, color: colors[strength - 1] || 'gray' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
      <span>Processing...</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-main font-sans">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-card overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-secondary/50">

        {/* Left Side - Hero Image & Branding */}
        <div className="hidden md:flex w-1/2 relative bg-primary-dark flex-col justify-between p-12 overflow-hidden group">
          {/* Background Image with Zoom Effect */}
          <div className="absolute inset-0 z-0">
            <img
              src={loginHeroImage}
              alt="Farmer in field"
              className="w-full h-full object-cover opacity-90 transition-transform duration-[20s] ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-primary-dark/30 to-black/10 mix-blend-multiply" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white shadow-sm">
              <span className="material-symbols-outlined text-sm">eco</span>
              <span className="text-xs font-bold tracking-wide uppercase">Farm to Fork Revolution</span>
            </div>
          </div>

          <div className="relative z-10 text-white space-y-6">
            <h2 className="text-5xl font-display font-bold leading-tight drop-shadow-lg">
              Empowering <br /> <span className="text-primary">Agriculture</span>
            </h2>
            <p className="text-lg text-gray-200 font-medium max-w-md leading-relaxed drop-shadow-md">
              Join India's fastest growing network of farmers and vendors. Get fair prices and transparent market access.
            </p>

            <div className="flex gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-dark bg-gray-200" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`, backgroundSize: 'cover' }}></div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-white">10k+ Active Users</span>
                <div className="flex text-yellow-400 text-xs">
                  {'★'.repeat(5)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-center relative bg-white">

          {/* Top Actions */}
          <div className="absolute top-8 right-8 flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-full text-xs font-bold text-primary-dark transition-all">
              <span className="material-symbols-outlined text-sm">translate</span>
              <span>English</span>
            </button>
          </div>

          {/* Header */}
          <div className="mb-8 mt-2">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-secondary text-primary-dark mb-6 shadow-sm">
              <span className="material-symbols-outlined text-3xl">shopping_basket</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-text-main">Welcome Back</h1>
            <p className="mt-2 text-gray-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Notifications */}
            {error && (
              <div className="p-4 rounded-DEFAULT bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3">
                <span className="material-symbols-outlined text-xl shrink-0">error</span>
                <span className="font-medium mt-0.5">{error}</span>
              </div>
            )}

            {isBlocked && (
              <div className="p-4 rounded-DEFAULT bg-yellow-50 border border-yellow-100 text-yellow-700 text-sm flex items-start gap-3">
                <span className="material-symbols-outlined text-xl shrink-0">lock_clock</span>
                <span className="font-medium mt-0.5">Account locked. Try again later.</span>
              </div>
            )}

            <div className="space-y-5">

              {/* Mobile Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Mobile Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">smartphone</span>
                  </div>
                  <input
                    name="mobile"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-200 bg-gray-50/50 pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium sm:text-sm shadow-sm"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                {fieldErrors.mobile && <p className="text-xs text-red-500 font-medium ml-1">{fieldErrors.mobile}</p>}
              </div>

              {/* Method Switcher */}
              <div className="flex bg-gray-50 p-1.5 rounded-DEFAULT border border-gray-100">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${loginMethod === 'password' ? 'bg-white shadow-md text-primary-dark ring-1 ring-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${loginMethod === 'otp' ? 'bg-white shadow-md text-primary-dark ring-1 ring-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  OTP
                </button>
              </div>

              {/* Conditional Inputs */}
              {loginMethod === 'password' ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-gray-700">Password</label>
                    <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-dark hover:underline transition-colors">Forgot?</Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
                    </div>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required={loginMethod === 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-200 bg-gray-50/50 pl-12 pr-12 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium sm:text-sm shadow-sm"
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-xs text-red-500 font-medium ml-1">{fieldErrors.password}</p>}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Verify with OTP</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="XXXXXX"
                      className="flex-1 rounded-lg border-gray-200 bg-gray-50/50 px-4 py-3.5 text-center text-lg font-bold tracking-[0.3em] text-gray-900 placeholder:text-gray-300 placeholder:tracking-normal focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={loading || otpTimer > 0}
                      className="min-w-[110px] px-4 py-3.5 bg-secondary text-primary-dark font-bold rounded-DEFAULT hover:bg-green-100 border border-green-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm hover:shadow-md"
                    >
                      {otpTimer > 0 ? `${otpTimer}s` : 'Get OTP'}
                    </button>
                  </div>
                  {otpSent && <p className="text-xs text-primary font-bold flex items-center ml-1"><span className="material-symbols-outlined text-[16px] mr-1">check_circle</span> OTP sent!</p>}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || isBlocked}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-primary-green-start to-primary-green-end hover:from-green-600 hover:to-green-500 text-white font-bold rounded-DEFAULT shadow-lg shadow-green-500/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-lg flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>Sign In <span className="material-symbols-outlined">arrow_forward</span></>
              )}
            </button>
          </form>

          {/* Registration Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-500 text-sm font-medium mb-4">Don't have an account?</p>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/farmer-registration"
                className="flex items-center justify-center gap-3 p-3.5 bg-white border border-gray-100 rounded-DEFAULT hover:border-primary hover:bg-secondary/30 transition-all group shadow-sm hover:shadow-md"
              >
                <span className="material-symbols-outlined text-primary-dark group-hover:scale-110 transition-transform">agriculture</span>
                <span className="text-sm font-bold text-gray-700 group-hover:text-primary-dark">Farmer</span>
              </Link>
              <Link
                to="/vendor-registration"
                className="flex items-center justify-center gap-3 p-3.5 bg-white border border-gray-100 rounded-DEFAULT hover:border-blue-500 hover:bg-blue-50/30 transition-all group shadow-sm hover:shadow-md"
              >
                <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">storefront</span>
                <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">Vendor</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;