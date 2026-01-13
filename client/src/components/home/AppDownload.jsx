import React from 'react';

const AppDownload = () => {
  return (
    <section className="py-24 bg-green-700 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Grow on the go.
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Manage your farm and business from anywhere. Real-time rates and instant payments on any device.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <button className="bg-white text-green-900 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined">android</span>
                Play Store
              </button>
              <button className="bg-transparent border-2 border-green-400 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined">phone_iphone</span>
                App Store
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            {/* Mockup Placeholder - Kept simple */}
            <div className="w-64 h-[500px] bg-white rounded-[2.5rem] p-4 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-gray-100 rounded-2xl overflow-hidden relative">
                <div className="absolute top-0 w-full h-16 bg-green-600"></div>
                <div className="p-4 mt-16 space-y-3">
                  <div className="h-20 bg-white rounded-lg shadow-sm"></div>
                  <div className="h-20 bg-white rounded-lg shadow-sm"></div>
                  <div className="h-20 bg-white rounded-lg shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppDownload;