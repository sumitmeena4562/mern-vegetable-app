import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after click
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f8fbf9]/95 backdrop-blur-md border-b border-[#e8f3ec] dark:bg-[#112117]/95 dark:border-[#1f3b29]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">eco</span>
            <span className="text-2xl font-black tracking-tight text-[#0e1b13] dark:text-white">
              <Link to="/">AgriConnect</Link>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-sm font-semibold text-[#0e1b13] hover:text-primary dark:text-gray-300 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-semibold text-[#0e1b13] hover:text-primary dark:text-gray-300 transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('market-rates')}
              className="text-sm font-semibold text-[#0e1b13] hover:text-primary dark:text-gray-300 transition-colors"
            >
              Market Rates
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-semibold text-[#0e1b13] hover:text-primary dark:text-gray-300 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8f3ec] text-[#0e1b13] text-sm font-bold hover:bg-[#d1e7d9] transition-colors dark:bg-[#1f3b29] dark:text-white"
              >
                <span className="material-symbols-outlined text-lg">language</span>
                <span>{selectedLanguage.name}</span>
                <span className="material-symbols-outlined text-sm">
                  {isLanguageOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Language Dropdown Menu */}
              {isLanguageOpen && (
                <div className="absolute top-full mt-2 w-48 bg-white dark:bg-[#1f3b29] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#f0fdf4] dark:hover:bg-[#14532d] transition-colors ${selectedLanguage.code === lang.code
                          ? 'bg-primary/10 text-primary'
                          : 'text-[#0e1b13] dark:text-gray-300'
                        }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login/Signup Button */}

            <Link
              to="/login"
            >
              <button className="px-6 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-green-700 transition-colors">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-[#0e1b13] dark:text-white"
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-[#112117] border-b border-gray-100 dark:border-gray-800 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-4 py-3 text-base font-semibold text-[#0e1b13] hover:text-primary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a2e22] rounded-lg transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-4 py-3 text-base font-semibold text-[#0e1b13] hover:text-primary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a2e22] rounded-lg transition-colors"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection('market-rates')}
                className="block w-full text-left px-4 py-3 text-base font-semibold text-[#0e1b13] hover:text-primary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a2e22] rounded-lg transition-colors"
              >
                Market Rates
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-4 py-3 text-base font-semibold text-[#0e1b13] hover:text-primary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a2e22] rounded-lg transition-colors"
              >
                Contact
              </button>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                {/* Language Dropdown for Mobile */}
                <div className="mb-4">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center justify-between w-full px-4 py-3 bg-[#e8f3ec] dark:bg-[#1f3b29] text-[#0e1b13] dark:text-white rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined">language</span>
                      <span>{selectedLanguage.name}</span>
                    </div>
                    <span className="material-symbols-outlined">
                      {isLanguageOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {isLanguageOpen && (
                    <div className="mt-2 bg-white dark:bg-[#1a2e22] rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang);
                            setIsLanguageOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-[#f0fdf4] dark:hover:bg-[#14532d] transition-colors ${selectedLanguage.code === lang.code
                              ? 'bg-primary/10 text-primary'
                              : 'text-[#0e1b13] dark:text-gray-300'
                            }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Login Button */}
                <Link
                  to="/login"
                  className="block w-full text-center px-6 py-3 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-green-700 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;