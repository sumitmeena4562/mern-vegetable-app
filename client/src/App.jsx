import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Landingpage from "@/pages/Landing.jsx"
import FarmerRegistrationPage from "./pages/auth/FarmerRegistrationPage";
import VendorRegistration from "./components/Vendors/VendorRegistration";
import CustomerRegistrationPage from "./pages/auth/CustomerRegistrationPage";
import LoginPage from "./pages/auth/Loginpage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import FarmerDashboard from "./pages/Farmer/FarmerDashboard";
import VendorDashboard from "./pages/Vendor/VendorDashboard";
import { NotificationProvider } from "./contexts/NotificationContext";
export default function App() {
    return (
        <NotificationProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <div>
                <Routes>
                    <Route path="/" element={<Landingpage />} />
                    <Route path="/farmer-registration" element={<FarmerRegistrationPage />} />
                    <Route path="/vendor-registration" element={<VendorRegistration />} />
                    <Route path="/customer-registration" element={<CustomerRegistrationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/farmer-dashboard/*" element={<FarmerDashboard />} />
                    <Route path="/vendor-dashboard/*" element={<VendorDashboard />} />
                </Routes>
            </div>
        </NotificationProvider>
    )
}