import React, { useState } from 'react';

const CustomerRegistration = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Customer registration submitted:', formData);
    // Handle form submission logic here
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
            {/* Glass Card Effect */}
            <style jsx>{`
              .glass-card {
                background: rgba(255, 255, 255, 0.75);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.8);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
              }
              .glass-input {
                background: rgba(255, 255, 255, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.6);
                transition: all 0.3s ease;
              }
              .glass-input:focus {
                background: rgba(255, 255, 255, 0.95);
                border-color: #16a34a;
                box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15);
                transform: translateY(-1px);
              }
              .glass-input:hover {
                background: rgba(255, 255, 255, 0.8);
              }
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

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
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="fullName">
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">person</span>
                        </div>
                        <input
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Ex: Anjali Sharma"
                          type="text"
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="mobile">
                        Mobile Number
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">smartphone</span>
                        </div>
                        <input
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          type="tel"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="password">
                        Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">lock</span>
                        </div>
                        <input
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a strong password"
                          type="password"
                          required
                        />
                      </div>
                    </div>
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
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="address">
                        Full Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute top-4 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">location_on</span>
                        </div>
                        <textarea
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium resize-none"
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
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="city">
                          City
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="material-symbols-outlined text-gray-400">location_city</span>
                          </div>
                          <input
                            className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            type="text"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="pincode">
                          PIN Code
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="material-symbols-outlined text-gray-400">pin_drop</span>
                          </div>
                          <input
                            className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="000000"
                            type="text"
                            pattern="[0-9]{6}"
                            maxLength="6"
                            required
                          />
                        </div>
                      </div>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="preferences">
                    Preferred Vegetables
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-gray-400">nutrition</span>
                    </div>
                    <input
                      className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                      id="preferences"
                      name="preferences"
                      value={formData.preferences}
                      onChange={handleInputChange}
                      placeholder="Ex: Spinach, Carrots, Tomatoes (Separated by comma)"
                      type="text"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 ml-1">
                    We'll notify you when your favorites are fresh in stock!
                  </p>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full flex justify-center py-5 px-4 border border-transparent rounded-[24px] shadow-lg shadow-green-600/30 text-xl font-bold text-white bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary-dark focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all transform active:scale-[0.98] hover:shadow-green-600/40"
                >
                  Create Account
                </button>
                
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
            <a className="font-bold text-green-700 hover:text-green-800 ml-1 underline decoration-2 decoration-green-300 underline-offset-2 transition-colors" href="#">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;