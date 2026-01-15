import api from '../../api/axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const VendorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    shopAddress: '',
    city: '',
    state: 'Maharashtra',
    capacity: '',
    pickup: 'Early Morning (4 AM - 7 AM)'
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
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        password: formData.password,
        email: `${formData.mobile}@agriconnect.com`, // Default email if not provided
        shopName: formData.shopName,
        dailyCapacity: Number(formData.capacity),
        location: { type: 'Point', coordinates: [0, 0] }, // Default location, logic can be added later
        address: { // Added to match schema if needed, but schema uses fields directly on Vendor
          shopAddress: formData.shopAddress,
          city: formData.city,
          state: formData.state
        },
        // Flat fields for Vendor model
        shopAddress: formData.shopAddress,
        city: formData.city,
        state: formData.state,
        preferredPickupTime: formData.pickup
      };

      const response = await api.post('/vendors/register', payload);

      if (response.data.success) {
        toast.success("Vendor Registered Successfully!");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error("Registration Error", error);
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  const states = [
    'Maharashtra',
    'Punjab',
    'Haryana',
    'Uttar Pradesh',
    'Madhya Pradesh'
  ];

  const pickupTimes = [
    'Early Morning (4 AM - 7 AM)',
    'Morning (7 AM - 10 AM)',
    'Afternoon (12 PM - 4 PM)',
    'Evening (4 PM - 8 PM)'
  ];

  return (
    <div className="min-h-full font-display antialiased text-gray-900 bg-[#f3fbf6]">
      {/* Background Effects */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ecfccb] via-[#f0fdf4] to-[#e0e7ff] opacity-80"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-yellow-100/30 rounded-full blur-[80px]"></div>
      </div>

      <Toaster position="top-center" />
      <div className="min-h-full flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-[24px] bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl shadow-green-600/20 mb-4">
            <span className="material-symbols-outlined text-5xl">storefront</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">AgriConnect</h2>
          <p className="mt-2 text-sm font-medium text-gray-600">Premium B2B Fresh Produce Network</p>
        </div>

        {/* Registration Form Card */}
        <div className="sm:mx-auto sm:w-full sm:max-w-[1024px]">
          <div className="glass-card shadow-2xl rounded-card px-6 py-10 sm:px-10 lg:px-14 relative overflow-hidden">
            {/* Glass Card Effect */}
            <style jsx>{`
              .glass-card {
                background: rgba(255, 255, 255, 0.65);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.5);
              }
              .glass-input {
                background: rgba(255, 255, 255, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.8);
                transition: all 0.2s ease;
              }
              .glass-input:focus {
                background: rgba(255, 255, 255, 0.95);
                border-color: #16a34a;
                box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
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
            <div className="relative z-10 mb-10 pb-6 border-b border-gray-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vendor Registration</h1>
                <p className="mt-2 text-lg text-gray-600">Buy fresh vegetables directly from farmers.</p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-full border border-blue-100 text-blue-800 text-sm font-semibold">
                <span className="material-symbols-outlined text-lg">verified</span>
                <span>Verified Business</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                {/* Personal Details Column */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      <span className="material-symbols-outlined">person</span>
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
                          <span className="material-symbols-outlined text-gray-400">badge</span>
                        </div>
                        <input
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Ex: Rajesh Gupta"
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
                          placeholder="+91 98765 00000"
                          type="tel"
                          required
                        />
                      </div>
                      <p className="mt-1 ml-1 text-xs text-green-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        OTP verification required later
                      </p>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                            placeholder="••••••••"
                            type="password"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="material-symbols-outlined text-gray-400">lock_reset</span>
                          </div>
                          <input
                            className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            type="password"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Details Column */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <span className="material-symbols-outlined">store</span>
                    </div>
                    Shop Details
                  </h3>

                  <div className="space-y-5">
                    {/* Shop Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="shopName">
                        Shop Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">storefront</span>
                        </div>
                        <input
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="shopName"
                          name="shopName"
                          value={formData.shopName}
                          onChange={handleInputChange}
                          placeholder="Ex: Gupta Fresh Vegetables"
                          type="text"
                          required
                        />
                      </div>
                    </div>

                    {/* Shop Address */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="shopAddress">
                        Shop Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-gray-400">location_on</span>
                        </div>
                        <input
                          className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="shopAddress"
                          name="shopAddress"
                          value={formData.shopAddress}
                          onChange={handleInputChange}
                          placeholder="Ex: Shop No. 14, Main Market, Sector 2"
                          type="text"
                          required
                        />
                      </div>
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="city">
                          City
                        </label>
                        <input
                          className="glass-input block w-full rounded-input py-4 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Ex: Pune"
                          type="text"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="state">
                          State
                        </label>
                        <div className="relative">
                          <select
                            className="glass-input block w-full rounded-input py-4 px-4 text-gray-900 focus:ring-2 focus:ring-primary sm:text-base font-medium appearance-none"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          >
                            {states.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <span className="material-symbols-outlined text-gray-400">expand_more</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Requirements Section */}
              <div className="pt-6 border-t border-gray-200/50">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                    <span className="material-symbols-outlined">inventory_2</span>
                  </div>
                  Business Requirements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Daily Buying Capacity */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="capacity">
                      Daily Buying Capacity (kg/day)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="material-symbols-outlined text-gray-400">scale</span>
                      </div>
                      <input
                        className="glass-input block w-full rounded-input py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-base font-medium"
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        placeholder="Ex: 150"
                        type="number"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Preferred Pickup Time */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1" htmlFor="pickup">
                      Preferred Pickup Time
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="material-symbols-outlined text-gray-400">schedule</span>
                      </div>
                      <select
                        className="glass-input block w-full rounded-input py-4 pl-12 pr-10 text-gray-900 focus:ring-2 focus:ring-primary sm:text-base font-medium appearance-none"
                        id="pickup"
                        name="pickup"
                        value={formData.pickup}
                        onChange={handleInputChange}
                        required
                      >
                        {pickupTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="material-symbols-outlined text-gray-400">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full flex justify-center py-5 px-4 border border-transparent rounded-[20px] shadow-lg shadow-green-600/30 text-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all transform active:scale-[0.98]"
                >
                  Register as Vendor
                </button>

                <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/80 border border-blue-200/60 rounded-xl">
                  <span className="material-symbols-outlined text-blue-600 shrink-0">info</span>
                  <p className="text-sm text-blue-800 font-medium">
                    Account will be active after admin verification. We verify shop licenses and details within 24 hours.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account?
            <a className="font-bold text-green-700 hover:text-green-800 ml-1 underline decoration-2 decoration-green-300 underline-offset-2" href="#">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration;