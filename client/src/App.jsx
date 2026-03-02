import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from "./contexts/NotificationContext";
import { CartProvider } from "./contexts/CartContext";

// ⚡ Lazy-loaded route components (each becomes a separate chunk)
const Landingpage = lazy(() => import("@/pages/Landing.jsx"));
const FarmerRegistrationPage = lazy(() => import("./pages/auth/FarmerRegistrationPage"));
const VendorRegistration = lazy(() => import("./components/Vendors/VendorRegistration"));
const CustomerRegistrationPage = lazy(() => import("./pages/auth/CustomerRegistrationPage"));
const LoginPage = lazy(() => import("./pages/auth/Loginpage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const FarmerDashboard = lazy(() => import("./pages/Farmer/FarmerDashboard"));
const VendorDashboard = lazy(() => import("./pages/Vendor/VendorDashboard"));

// 🎨 Premium loading fallback
const PageLoader = () => (
    <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
            <div className="w-14 h-14 bg-white/60 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl mb-4 mx-auto border border-white/60">
                <span className="material-symbols-outlined text-green-600 text-2xl animate-spin">progress_activity</span>
            </div>
            <p className="text-sm font-bold text-slate-400 tracking-wide animate-pulse">Loading...</p>
        </div>
    </div>
);

export default function App() {
    return (
        <NotificationProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <Suspense fallback={<PageLoader />}>
                <div>
                    <Routes>
                        <Route path="/" element={<Landingpage />} />
                        <Route path="/farmer-registration" element={<FarmerRegistrationPage />} />
                        <Route path="/vendor-registration" element={<VendorRegistration />} />
                        <Route path="/customer-registration" element={<CustomerRegistrationPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/farmer-dashboard/*" element={<FarmerDashboard />} />
                        <Route path="/vendor-dashboard/*" element={
                            <CartProvider>
                                <VendorDashboard />
                            </CartProvider>
                        } />
                    </Routes>
                </div>
            </Suspense>
        </NotificationProvider>
    )
}