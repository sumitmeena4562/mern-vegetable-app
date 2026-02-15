import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const companyLinks = [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Impact', href: '#' },
    ];

    const resourceLinks = [
        { label: 'Market Rates', href: '#market-rates' },
        { label: 'Farming Tips', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Privacy Policy', href: '#' },
    ];

    return (
        <footer id="contact" className="bg-slate-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 sm:mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-lg">eco</span>
                            </div>
                            <span className="text-lg font-black">AgriConnect</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                            Empowering Indian agriculture through technology. Direct farm-to-table connection.
                        </p>
                        {/* Social */}
                        <div className="flex gap-3">
                            {['facebook', 'twitter', 'instagram'].map(social => (
                                <a key={social} href="#"
                                    className="w-9 h-9 bg-slate-800 hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
                                    <span className="text-slate-400 hover:text-white text-xs font-bold uppercase">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2.5">
                            {companyLinks.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-sm text-slate-400 hover:text-green-400 transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Resources</h3>
                        <ul className="space-y-2.5">
                            {resourceLinks.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-sm text-slate-400 hover:text-green-400 transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Contact</h3>
                        <ul className="space-y-2.5">
                            <li className="flex items-center gap-2 text-sm text-slate-400">
                                <span className="material-symbols-outlined text-base text-green-400">call</span>
                                +91 6261 652446
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-400">
                                <span className="material-symbols-outlined text-base text-green-400">mail</span>
                                agriconnect.tech@gmail.com
                            </li>
                            <li className="mt-3">
                                <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600/20 text-green-400 text-sm font-bold hover:bg-green-600/30 transition-colors justify-center border border-green-600/30">
                                    <span className="material-symbols-outlined text-lg">chat</span>
                                    WhatsApp Support
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-slate-500">© 2025 AgriConnect Technologies Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-4 sm:gap-6 text-xs text-slate-500">
                        {['Terms', 'Privacy', 'Cookies'].map(link => (
                            <a key={link} href="#" className="hover:text-slate-300 transition-colors">{link}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;