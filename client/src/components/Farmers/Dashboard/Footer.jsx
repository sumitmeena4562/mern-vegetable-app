// components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">© 2024 Farm2Vendor. All rights reserved.</p>
        <div className="flex gap-6 text-sm text-gray-500">
          <a className="hover:text-green-600" href="#">Help Center</a>
          <a className="hover:text-green-600" href="#">Privacy</a>
          <a className="hover:text-green-600" href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;