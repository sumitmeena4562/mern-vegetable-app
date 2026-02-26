import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Vendors/Dashboard/Sidebar";
import Header from "../../components/Vendors/Dashboard/Header";
import Overview from "../../components/Vendors/Dashboard/Overview";
import Market from "../../components/Vendors/Dashboard/Market/Market";
import Settings from "../../components/Vendors/Dashboard/Settings/Settings";
import Wallet from "../../components/Vendors/Dashboard/Wallet/Wallet";
import Orders from "../../components/Vendors/Dashboard/Orders/VendorOrders";
import VendorOnboarding from "../../components/Vendors/Dashboard/VendorOnboarding";
import api from "../../api/axios";

export default function VendorDashboard() {
    const { user, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [onboardingComplete, setOnboardingComplete] = useState(true); // Default to true so it doesn't block UX

    // Auto-close sidebar on mobile when route changes
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Handle Unauthorized Access (if not a vendor)
    if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]"><div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div></div>;

    if (!user || user.role !== 'vendor') {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] font-display p-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-slate-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-red-500 text-3xl">lock</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-6 text-sm">You must be logged in as a Vendor to view this dashboard.</p>
                    <button onClick={() => navigate('/login')} className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">Go to Login</button>
                </div>
            </div>
        );
    }

    // Header Details based on Route
    const getHeaderData = () => {
        const path = location.pathname;
        if (path.includes('market')) return { title: 'Mandi Market', subtitle: 'Buy fresh produce locally' };
        if (path.includes('wallet')) return { title: 'Vendor Finance', subtitle: 'Manage payments and credit' };
        if (path.includes('orders')) return { title: 'My Purchases', subtitle: 'Track your incoming stock' };
        if (path.includes('settings')) return { title: 'Shop Profile', subtitle: 'Manage business details' };
        return { title: 'Vendor Dashboard', subtitle: 'Welcome to your business hub' };
    };

    const headerData = getHeaderData();

    if (!onboardingComplete) {
        return (
            <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} userName={user?.fullName} onLogout={() => { logout(); navigate('/login'); }} />
                <main className="flex-1 flex flex-col relative overflow-hidden">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Welcome Setup" subtitle="Let's get your business ready" userName={user?.fullName} />
                    <div className="flex-1 overflow-y-auto scroll-smooth relative z-10">
                        <VendorOnboarding
                            userName={user?.fullName}
                            stats={{ bankComplete: false, firstOrderPlaced: false, isVerified: false }}
                            onComplete={() => setOnboardingComplete(true)}
                        />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans relative">
            {/* Global Dashboard Background */}
            <div className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[1000px] h-[1000px] bg-indigo-100/30 rounded-full blur-[120px] opacity-70 animate-pulse duration-[10s]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-100/20 rounded-full blur-[100px] opacity-50"></div>
                <div className="absolute -bottom-24 -left-24 w-[800px] h-[800px] bg-cyan-100/20 rounded-full blur-[120px] opacity-70 animate-pulse duration-[8s] delay-1000"></div>
            </div>

            {/* SIDEBAR */}
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                userName={user.fullName}
                onLogout={() => { logout(); navigate('/login'); }}
            />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                <Header
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    title={headerData.title}
                    subtitle={headerData.subtitle}
                    userName={user.fullName}
                    onLogout={() => { logout(); navigate('/login'); }}
                />

                {/* Scrollable Content (Added pb-24 on mobile to prevent bottom nav bar overlap) */}
                <div className="flex-1 overflow-y-auto scroll-smooth pb-24 xl:pb-0">
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-full">
                        <Routes>
                            <Route path="/" element={<Overview />} />
                            <Route path="market" element={<Market />} />
                            <Route path="wallet" element={<Wallet />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="*" element={<Overview />} />
                        </Routes>
                    </div>
                </div>
            </main>
        </div>
    );
}
