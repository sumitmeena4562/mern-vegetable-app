import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Market Rates', id: 'market-rates' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.04] border-b border-slate-100'
        : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/50 group-hover:shadow-green-300/60 transition-shadow">
                <span className="material-symbols-outlined text-white text-xl">eco</span>
              </div>
              <span className="text-xl font-black tracking-tight text-slate-800 leading-none mt-0.5">
                Agri<span className="text-green-600">Connect</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              <Link to="/login"
                className="px-5 py-2.5 text-[13px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                Log in
              </Link>
              <Link to="/farmer-registration"
                className="px-5 py-2.5 text-[13px] font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-200/50 hover:shadow-green-300/60 transition-all active:scale-[0.97]">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-700">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-xl"
            style={{ animation: 'slideDown 0.25s ease-out' }}>
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left px-4 py-3.5 text-[15px] font-semibold text-slate-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-3 border-t border-slate-100 mt-2 flex gap-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center px-4 py-3 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl">
                  Log in
                </Link>
                <Link to="/farmer-registration" onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-200/40">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16 sm:h-18" />

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Header;