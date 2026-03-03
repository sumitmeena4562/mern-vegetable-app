import React, { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: '',
    address: '',
    city: '',
    pincode: '',
    preferences: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        password: formData.password,
        email: `${formData.mobile}@agriconnect.com`,
        deliveryAddresses: [{
          addressLine: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          default: true
        }],
        preferences: formData.preferences ? formData.preferences.split(',').map(p => p.trim()) : []
      };

      const response = await api.post('/customers/register', payload);

      if (response.data.success) {
        toast.success("Customer Account Created!");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error("Registration Error", error);
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-full font-display antialiased text-gray-900 bg-[#f0f9f4]">
      {/* Background Effects */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#dcfce7] via-[#f0fdf4] to-[#eff6ff] opacity-100"></div>
        <div className="absolute top-[-5%] left-[10%] w-[40%] h-[40%] bg-green-300/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-lime-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[50%] w-[25%] h-[25%] bg-yellow-100/40 rounded-full blur-[90px]"></div>
      </div>

      <div className="min-h-full flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-[28px] bg-gradient-to-br from-green-400 to-green-600 text-white shadow-xl shadow-green-500/25 mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="material-symbols-outlined text-5xl">shopping_basket</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">AgriConnect</h2>
          <p className="mt-2 text-base font-medium text-green-700">Fresh from Farm to Home</p>
        </div>

        {/* Registration Form Card */}
        <div className="sm:mx-auto sm:w-full sm:max-w-[1024px]">
          <div className="glass-card shadow-xl rounded-card px-6 py-10 sm:px-12 lg:px-16 relative overflow-hidden">
            {/* Form Header */}
            <div className="relative z-10 mb-10 pb-6 border-b border-green-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Create Customer Account</h1>
                <p className="mt-2 text-lg text-gray-600">Get fresh vegetables directly from farmers</p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50/80 rounded-full border border-green-100 text-green-800 text-sm font-semibold shadow-sm">
                <span className="material-symbols-outlined text-lg">eco</span>
                <span>100% Organic Sources</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
                {/* Personal Details Column */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                      <span className="material-symbols-outlined">face</span>
                    </div>
                    Personal Details
                  </h3>

                  <div className="space-y-5">
                    {/* Full Name */}
                    <Input
                      label="Full Name"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Ex: Anjali Sharma"
                      type="text"
                      icon="person"
                      required
                      className="rounded-2xl py-3.5"
                    />

                    <Input
                      label="Mobile Number"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      type="tel"
                      icon="smartphone"
                      required
                      className="rounded-2xl py-3.5"
                    />

                    <Input
                      label="Password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      type="password"
                      icon="lock"
                      required
                      className="rounded-2xl py-3.5"
                    />
                  </div>
                </div>

                {/* Delivery Address Column */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                      <span className="material-symbols-outlined">home</span>
                    </div>
                    Delivery Address
                  </h3>

                  <div className="space-y-5">
                    {/* Full Address */}
                    <div>
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5" htmlFor="address">
                        Full Address
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute top-4 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400 text-[20px]">location_on</span>
                        </div>
                        <textarea
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all pl-11 resize-none"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Flat / House No / Floor, Building Name"
                          rows="2"
                          required
                        />
                      </div>
                    </div>

                    {/* City and PIN Code */}
                    <div className="grid grid-cols-2 gap-5">
                      <Input
                        label="City"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        type="text"
                        icon="location_city"
                        required
                        className="rounded-2xl py-3.5"
                      />
                      <Input
                        label="PIN Code"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="000000"
                        type="text"
                        pattern="[0-9]{6}"
                        maxLength="6"
                        icon="pin_drop"
                        required
                        className="rounded-2xl py-3.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="pt-6 border-t border-green-100/50">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                    <span className="material-symbols-outlined">favorite</span>
                  </div>
                  Preferences <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                </h3>

                <div>
                  <Input
                    label="Preferred Vegetables"
                    id="preferences"
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleInputChange}
                    placeholder="Ex: Spinach, Carrots, Tomatoes (Separated by comma)"
                    type="text"
                    icon="nutrition"
                    className="rounded-2xl py-3.5"
                    helpText="We'll notify you when your favorites are fresh in stock!"
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-8">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  className="rounded-2xl py-4 shadow-lg shadow-green-600/30 text-base"
                >
                  Create Account
                </Button>

                <div className="mt-6 flex justify-center items-center gap-2 p-4">
                  <span className="material-symbols-outlined text-green-600">verified_user</span>
                  <p className="text-sm text-gray-600 font-medium">
                    Join 10,000+ happy families eating healthy today.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account?
            <Link className="font-bold text-green-700 hover:text-green-800 ml-1 underline decoration-2 decoration-green-300 underline-offset-2 transition-colors" to="/login">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;