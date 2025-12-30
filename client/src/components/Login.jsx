// components/Login.jsx
import React, { useState } from 'react';
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

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      console.log(`User Mobile number :${formData.mobile} `);

      if (!formData.mobile || !formData.password) {
        setError('Please fill all fields');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`, // Ensure .env variable is correct, or use 'http://localhost:5000/api' directly
        formData
      );

      if (response.data.success) {
        // Save token and user data
        const { token, user } = response.data.data;

        // ✅ FIX ADDED HERE: Token ko LocalStorage me save karna zaruri hai
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user)); // Role bhi save kar lo future ke liye

        // Use auth context to login
        login(token, user);

        console.log('Login successful:', {
          token: token.substring(0, 10) + '...',
          role: user.role,
          user: user
        });

        // Redirect based on role
        switch (user.role) {
          case 'farmer':
            navigate('/farmer-dashboard/');
            break;
          case 'vendor':
            navigate('/vendor/dashboard');
            break;
          case 'customer':
            navigate('/customer/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

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
                      placeholder="+91 98765 43210"
                      className="glass-input block w-full rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-base font-medium"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-gray-700 mb-2 ml-1"
                  >
                    Password
                  </label>
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-600/30 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all transform active:scale-[0.98] hover:shadow-green-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        refresh
                      </span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </form>

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
        </div>
      </div>
    </div>
  );
};

export default Login;