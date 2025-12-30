import React from 'react'

const WhyChooseAgriConnect = () => {
  const oldSystemItems = [
    {
      icon: 'remove_circle',
      title: 'Middlemen Commissions',
      description: 'Farmers lose up to 40% of value.',
      color: 'text-red-500'
    },
    {
      icon: 'schedule',
      title: 'Delayed Payments',
      description: 'Waiting weeks for settlement.',
      color: 'text-red-500'
    },
    {
      icon: 'compost',
      title: 'Stale Vegetables',
      description: 'Produce travels for days before sale.',
      color: 'text-red-500'
    }
  ]

  const newSystemItems = [
    {
      icon: 'add_circle',
      title: 'Direct Profits (0% Commission)',
      description: 'Farmers keep 100% of the sale price.',
      color: 'text-primary'
    },
    {
      icon: 'payments',
      title: 'Instant Escrow Payments',
      description: 'Money in your account instantly upon delivery.',
      color: 'text-primary'
    },
    {
      icon: 'timer',
      title: 'Harvested 6 Hours Ago',
      description: 'Farm fresh delivery guaranteed.',
      color: 'text-primary'
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-[#112117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#0e1b13] dark:text-white">Why Choose AgriConnect?</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">We are revolutionizing how India trades vegetables.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Old Mandi System */}
          <div className="bg-gray-50 dark:bg-[#1a202c] p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <span className="material-symbols-outlined">history</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Old Mandi System</h3>
            </div>
            <ul className="space-y-6">
              {oldSystemItems.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className={`material-symbols-outlined ${item.color} mt-1`}>{item.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-200">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* AgriConnect Way */}
          <div className="bg-[#f0fdf4] dark:bg-[#14532d]/20 p-8 rounded-3xl border border-green-100 dark:border-green-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl text-primary">eco</span>
            </div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                <span className="material-symbols-outlined">check</span>
              </div>
              <h3 className="text-xl font-bold text-[#0e1b13] dark:text-white">The AgriConnect Way</h3>
            </div>
            <ul className="space-y-6 relative z-10">
              {newSystemItems.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className={`material-symbols-outlined ${item.color} mt-1`}>{item.icon}</span>
                  <div>
                    <p className="font-bold text-[#0e1b13] dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseAgriConnect;