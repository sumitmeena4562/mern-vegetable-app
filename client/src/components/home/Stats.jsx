import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const numericEnd = parseInt(end.replace(/[^0-9]/g, ''));
          const duration = 1500;
          const steps = 40;
          const increment = numericEnd / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numericEnd) {
              setCount(numericEnd);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  const prefix = end.startsWith('₹') ? '₹' : '';
  const displaySuffix = end.includes('+') ? '+' : '';
  const crSuffix = end.includes('Cr') ? ' Cr' : '';

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('en-IN')}{crSuffix}{displaySuffix}{suffix}
    </span>
  );
};

const Stats = () => {
  const stats = [
    { value: '15000+', label: 'Registered Farmers', emoji: '👨‍🌾' },
    { value: '₹50 Cr+', label: 'Trade Volume', emoji: '💰' },
    { value: '25+', label: 'Districts Covered', emoji: '📍' },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{stat.emoji}</div>
              <p className="text-2xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                <AnimatedCounter end={stat.value} />
              </p>
              <p className="text-slate-400 font-medium text-[10px] sm:text-xs uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;