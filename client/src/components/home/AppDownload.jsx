import React from 'react';

const AppDownload = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white overflow-hidden relative">
      {/* Background mesh */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10 sm:gap-16">
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-xs font-bold mb-5">
              <span className="material-symbols-outlined text-sm">smartphone</span>
              Mobile App
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 leading-tight">
              Grow on the go.
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Manage your farm and business from anywhere. Real-time rates and instant payments on any device.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
              <button className="group bg-white text-green-800 px-6 sm:px-8 py-3.5 rounded-2xl font-bold hover:bg-green-50 transition-all flex items-center gap-2.5 justify-center shadow-xl shadow-black/10 active:scale-[0.97]">
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">android</span>
                <div className="text-left">
                  <div className="text-[10px] text-green-600 font-medium -mb-0.5">GET IT ON</div>
                  <div className="text-sm font-black">Google Play</div>
                </div>
              </button>
              <button className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 sm:px-8 py-3.5 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center gap-2.5 justify-center active:scale-[0.97]">
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">phone_iphone</span>
                <div className="text-left">
                  <div className="text-[10px] text-white/60 font-medium -mb-0.5">DOWNLOAD ON</div>
                  <div className="text-sm font-black">App Store</div>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-56 sm:w-64 h-[420px] sm:h-[480px] bg-white rounded-[2.5rem] p-3 shadow-2xl shadow-black/20 hover:rotate-0 transition-transform duration-500"
                style={{ transform: 'rotate(3deg)' }}>
                <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden">
                  {/* Phone Status Bar */}
                  <div className="h-10 bg-green-600 flex items-center justify-between px-5">
                    <span className="text-white/80 text-[10px] font-semibold">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-2 bg-white/60 rounded-sm" />
                      <div className="w-3 h-2 bg-white/60 rounded-sm" />
                    </div>
                  </div>
                  {/* Phone Header */}
                  <div className="bg-green-600 px-4 pb-4 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">🌿</span>
                      <span className="text-white text-sm font-bold">AgriConnect</span>
                    </div>
                    <p className="text-green-100 text-[10px] mt-1">Welcome, Farmer!</p>
                  </div>
                  {/* Phone Content */}
                  <div className="p-3 space-y-2.5">
                    <div className="h-16 bg-white rounded-xl shadow-sm border border-slate-100 p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg" />
                        <div>
                          <div className="w-20 h-2 bg-slate-200 rounded" />
                          <div className="w-14 h-2 bg-slate-100 rounded mt-1" />
                        </div>
                      </div>
                    </div>
                    <div className="h-16 bg-white rounded-xl shadow-sm border border-slate-100 p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg" />
                        <div>
                          <div className="w-24 h-2 bg-slate-200 rounded" />
                          <div className="w-16 h-2 bg-slate-100 rounded mt-1" />
                        </div>
                      </div>
                    </div>
                    <div className="h-16 bg-white rounded-xl shadow-sm border border-slate-100 p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg" />
                        <div>
                          <div className="w-18 h-2 bg-slate-200 rounded" />
                          <div className="w-12 h-2 bg-slate-100 rounded mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div className="absolute -inset-8 bg-white/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;