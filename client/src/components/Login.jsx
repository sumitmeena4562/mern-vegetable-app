// components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 opacity-100" />
        <div className="absolute top-[-5%] left-[10%] w-[40%] h-[40%] bg-green-300/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-lime-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[25%] h-[25%] bg-yellow-100/40 rounded-full blur-[90px]" />
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/80 backdrop-blur-md rounded-full border border-white/60 shadow-sm transition-all text-sm font-semibold text-green-800 hover:shadow-md">
          <span className="material-symbols-outlined text-lg">translate</span>
          <span>English / हिंदी</span>
        </button>
      </div>

      <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-green-400 to-green-600 text-white shadow-xl shadow-green-500/25 mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="material-symbols-outlined text-5xl">shopping_basket</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            AgriConnect
          </h2>
          <p className="mt-2 text-base font-medium text-green-700">
            Fresh from Farm to Home
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          {/* Login Card */}
          <div className="glass-card shadow-xl rounded-3xl px-6 py-10 sm:px-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent" />

            <div className="relative z-10 mb-8 text-center">
              <h1 className="text-2xl font-extrabold text-gray-900">
                Login to AgriConnect
              </h1>
              <p className="mt-2 text-gray-600">
                Enter your details to access your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="relative z-10 mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-2 text-red-600">
                  <span className="material-symbols-outlined">error</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Blocked Message */}
            {isBlocked && (
              <div className="relative z-10 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <div className="flex items-center gap-2 text-yellow-700">
                  <span className="material-symbols-outlined">lock_clock</span>
                  <p className="text-sm font-medium">
                    Account temporarily locked. Please try again in 5 minutes.
                  </p>
                </div>
              </div>
            )}

            {/* Login Method Toggle */}
            <div className="relative z-10 mb-6">
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${loginMethod === 'password' ? 'bg-white shadow-sm text-green-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <span className="material-symbols-outlined align-middle mr-2 text-base">
                    lock
                  </span>
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${loginMethod === 'otp' ? 'bg-white shadow-sm text-green-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <span className="material-symbols-outlined align-middle mr-2 text-base">
                    sms
                  </span>
                  OTP
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="space-y-6">
                {/* Mobile Input */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-bold text-gray-700 mb-2 ml-1"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-gray-400">
                        smartphone
                      </span>
                    </div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="glass-input block w-full rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-base font-medium"
                      autoComplete="tel"
                      autoCapitalize="none"
                      autoCorrect="off"
                      inputMode="numeric"
                      aria-label="Mobile Number"
                      aria-describedby="mobile-error"
                      aria-invalid={!!fieldErrors.mobile}
                    />
                  </div>
                  {fieldErrors.mobile && (
                    <p id="mobile-error" className="mt-2 text-sm text-red-600 ml-1">
                      {fieldErrors.mobile}
                    </p>
                  )}
                </div>

                {/* Password or OTP Input */}
                {loginMethod === 'password' ? (
                  <>
                    {/* Password Input */}
                    <div>
                      <div className="flex justify-between items-center mb-2 ml-1">
                        <label
                          htmlFor="password"
                          className="block text-sm font-bold text-gray-700"
                        >
                          Password
                        </label>
                        {formData.password && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Strength:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map(i => (
                                <div
                                  key={i}
                                  className={`h-1 w-6 rounded-full ${i <= passwordStrength.strength ? `bg-${passwordStrength.color}-500` : 'bg-gray-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">
                            lock
                          </span>
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="glass-input block w-full rounded-2xl py-4 pl-12 pr-12 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-base"
                          aria-label="Password"
                          aria-describedby="password-error"
                          aria-invalid={!!fieldErrors.password}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          <span className="material-symbols-outlined">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p id="password-error" className="mt-2 text-sm text-red-600 ml-1">
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          Remember me
                        </span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </>
                ) : (
                  /* OTP Input */
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-bold text-gray-700 mb-2 ml-1"
                    >
                      OTP
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="material-symbols-outlined text-gray-400">
                              password
                            </span>
                          </div>
                          <input
                            id="otp"
                            name="otp"
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="Enter 6-digit OTP"
                            className="glass-input block w-full rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-base"
                            maxLength="6"
                            inputMode="numeric"
                            aria-label="OTP"
                            aria-describedby="otp-error"
                            aria-invalid={!!fieldErrors.otp}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={sendOTP}
                          disabled={loading || otpTimer > 0}
                          className="px-6 py-4 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Send OTP'}
                        </button>
                      </div>
                      {fieldErrors.otp && (
                        <p id="otp-error" className="mt-2 text-sm text-red-600 ml-1">
                          {fieldErrors.otp}
                        </p>
                      )}
                      {otpSent && !fieldErrors.otp && (
                        <p className="text-sm text-green-600 ml-1">
                          ✓ OTP sent to your mobile number
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || isBlocked}
                  className={`w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-gradient-to-r transition-all transform active:scale-[0.98] ${
                    loading || isBlocked
                      ? 'from-gray-400 to-gray-500 cursor-not-allowed'
                      : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-600/30 hover:shadow-green-600/40'
                  }`}
                >
                  {loading ? <LoadingSpinner /> : 'Login'}
                </button>
              </div>
            </form>

            {/* Social Login Divider */}
            <div className="relative z-10 mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-2xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('phone')}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-2xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined mr-2">phone_iphone</span>
                  Phone
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-8 pt-6 border-t border-green-100/60 text-center">
              <p className="text-sm text-gray-600 font-medium">
                New User?{' '}
                <Link
                  to="/register"
                  className="font-bold text-green-700 hover:text-green-800 ml-1 underline decoration-2 decoration-green-300 underline-offset-2 transition-colors"
                >
                  Register Here
                </Link>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 flex justify-center items-center gap-2 opacity-80">
            <span className="material-symbols-outlined text-green-700 text-lg">
              verified_user
            </span>
            <p className="text-sm text-gray-600 font-medium">
              Secure & Private Platform
            </p>
          </div>

          {/* Attempts Counter (for debugging) */}
          {process.env.NODE_ENV === 'development' && attempts > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Attempts: {attempts}/5
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;