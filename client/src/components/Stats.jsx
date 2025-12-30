import React from 'react'

const Stats = () => {
  const stats = [
    { value: '5000+', label: 'Farmers Onboarded' },
    { value: '10,000+', label: 'Tons Delivered' },
    { value: '500+', label: 'Pincodes Covered' }
  ]

  return (
    <section className="py-12 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/20">
          {stats.map((stat, index) => (
            <div key={index} className="flex-1 px-4 pt-8 md:pt-0 first:pt-0">
              <p className="text-4xl md:text-5xl font-black mb-1">{stat.value}</p>
              <p className="text-green-100 font-medium text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats;