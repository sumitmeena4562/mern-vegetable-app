import React from 'react'

const HowItWorks = () => {
  const steps = [
    {
      icon: 'mic',
      title: 'Record Voice Note',
      description: 'Just speak to list your stock. "I have 50kg Tomatoes". Our AI does the rest.',
      bgColor: 'bg-[#fefce8] dark:bg-[#422006]',
      textColor: 'text-secondary'
    },
    {
      icon: 'shopping_cart_checkout',
      title: 'Get Orders',
      description: 'Receive instant orders from verified vendors nearby at market rates.',
      bgColor: 'bg-[#ecfdf5] dark:bg-[#14532d]',
      textColor: 'text-primary'
    },
    {
      icon: 'local_shipping',
      title: 'Farm Pickup',
      description: 'Logistics team picks up from your farm. Payment is released instantly.',
      bgColor: 'bg-[#f0f9ff] dark:bg-[#1e3a8a]',
      textColor: 'text-blue-600'
    }
  ]

  return (
    <section className="py-20 bg-background-light dark:bg-[#1a2e22]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-[#0e1b13] dark:text-white">How It Works</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          <button className="px-6 py-3 rounded-full bg-secondary text-white font-bold shadow-lg shadow-secondary/30 scale-105 transition-transform">
            Farmer Flow
          </button>
          <button className="px-6 py-3 rounded-full bg-white dark:bg-[#112117] text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 transition-colors">
            Vendor Flow
          </button>
          <button className="px-6 py-3 rounded-full bg-white dark:bg-[#112117] text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 transition-colors">
            Customer Flow
          </button>
        </div>
        
        <div className="bg-white dark:bg-[#112117] rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-100 dark:bg-gray-800 -z-0"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                <div className={`h-24 w-24 rounded-full ${step.bgColor} border-4 border-white dark:border-[#112117] flex items-center justify-center ${step.textColor} mb-6 shadow-md`}>
                  <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                </div>
                <h4 className="text-xl font-bold text-[#0e1b13] dark:text-white mb-2">{step.title}</h4>
                <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks;