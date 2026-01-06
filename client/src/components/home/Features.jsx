import React from 'react'

const Features = () => {
  const features = [
    {
      icon: 'mic',
      title: 'Voice Assistant',
      description: 'Don\'t want to type? Just speak to list your stock in your local language.',
      color: 'text-primary'
    },
    {
      icon: 'location_on',
      title: 'Smart Maps',
      description: 'Find farmers or vendors within a 10km radius with precision.',
      color: 'text-blue-500'
    },
    {
      icon: 'qr_code_scanner',
      title: 'QR Traceability',
      description: 'Scan to know who grew your food and when it was harvested.',
      color: 'text-purple-500'
    },
    {
      icon: 'verified_user',
      title: 'Escrow Safety',
      description: 'Your money is safe until you inspect and verify the goods.',
      color: 'text-secondary'
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-[#112117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-50 dark:bg-[#1a2e22] rounded-2xl hover:bg-[#f0fdf4] dark:hover:bg-[#14532d]/40 transition-colors group">
              <span className={`material-symbols-outlined text-4xl ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>{feature.icon}</span>
              <h3 className="font-bold text-lg text-[#0e1b13] dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features;