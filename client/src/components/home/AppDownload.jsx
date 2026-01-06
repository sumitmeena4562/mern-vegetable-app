import React from 'react'

const AppDownload = () => {
  return (
    <section className="py-20 bg-background-light dark:bg-[#112117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1a2e22] rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex-1 relative z-10 text-center md:text-left">
            <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-primary text-sm font-bold mb-4 backdrop-blur-sm">Mobile First</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Farming made easier with the AgriConnect App.</h2>
            <p className="text-gray-300 text-lg mb-8">Available in Hindi, Marathi, & 8 regional languages. Download now to start trading directly.</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button className="flex items-center gap-3 bg-white text-[#0e1b13] px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-3xl">android</span>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-gray-500 leading-none">Get it on</p>
                  <p className="text-base font-bold leading-none">Google Play</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-3xl">phone_iphone</span>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-gray-300 leading-none">Download on the</p>
                  <p className="text-base font-bold leading-none">App Store</p>
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative z-10 flex justify-center">
            <div className="relative w-64 h-[500px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsQDKplGSzaZyx8tzg7cfyQqXUCwajLLADI1NW7O8oztTAPzDeV0e5IZbjCu95iHjCC7LD6GlcFnhmAAHY5_G4kNd_iRft4OmuT6rUnjup5Wi_VVfqSjX1pyK84YuRAOkZbtx67Y_7RNkRXGAM0SFYlz0-vizaaBdH2ki863r0yCHewF_WXQ58P4C-qwxrGIwBhR8vqUA0YMQ7DmpeEbDUwwQdPMjuc7ecygk1hHmfaPKLZnp2zgpWNqG-bEvw-9oQF2GBCiEPK7M')` }}
              >
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6">
                  <div className="w-full bg-white p-4 rounded-xl shadow-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500">Market Rate</span>
                      <span className="text-xs font-bold text-green-600">Live</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-xl">🍅</div>
                      <div>
                        <p className="font-bold text-[#0e1b13]">Tomato</p>
                        <p className="text-xs text-gray-500">₹20/kg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500">My Stock</span>
                    </div>
                    <button className="w-full bg-primary text-white text-sm font-bold py-2 rounded-lg">Add New Harvest</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppDownload;