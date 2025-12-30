import React from 'react'

const Footer = () => {
    const companyLinks = [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Impact', href: '#' }
    ]

    const resourceLinks = [
        { label: 'Market Rates', href: '#' },
        { label: 'Farming Tips', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Privacy Policy', href: '#' }
    ]

    const bottomLinks = [
        { label: 'Terms', href: '#' },
        { label: 'Privacy', href: '#' },
        { label: 'Cookies', href: '#' }
    ]

    return (
        <footer id="contact" className="bg-white dark:bg-[#0e1b13] border-t border-gray-100 dark:border-gray-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary text-3xl">eco</span>
                            <span className="text-xl font-black text-[#0e1b13] dark:text-white">AgriConnect</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Empowering Indian agriculture through technology. Direct farm-to-table connection.
                        </p>
                        <div className="flex gap-4">
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                                </svg>
                            </a>
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-bold text-[#0e1b13] dark:text-white mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <a className="hover:text-primary" href={link.href}>{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resource Links */}
                    <div>
                        <h3 className="font-bold text-[#0e1b13] dark:text-white mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            {resourceLinks.map((link, index) => (
                                <li key={index}>
                                    <a className="hover:text-primary" href={link.href}>{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="font-bold text-[#0e1b13] dark:text-white mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">call</span>
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">mail</span>
                                <span>support@agriconnect.in</span>
                            </li>
                            <li>
                                <button className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-bold hover:bg-green-200 transition-colors w-full justify-center">
                                    <span className="material-symbols-outlined text-lg">chat</span>
                                    <span>WhatsApp Support</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400 text-center md:text-left">© 2024 AgriConnect Technologies Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        {bottomLinks.map((link, index) => (
                            <a key={index} className="hover:text-gray-600 dark:hover:text-gray-200" href={link.href}>
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer