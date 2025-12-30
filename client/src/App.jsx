import { Route, Routes } from "react-router-dom";
import Landingpage from "@/pages/Landing.jsx"
import FarmerRegistrationPage from "./pages/FarmerRegistrationPage";
import VendorRegistration from "./components/Vendors/VendorRegistration";
import CustomerRegistrationPage from "./pages/CustomerRegistrationPage";
import LoginPage from "./pages/Loginpage";
import FarmerDashboard from "./pages/Farmer/FarmerDashboard";
export default function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Landingpage/>} />
                <Route path="/farmer-registration" element={<FarmerRegistrationPage/>}/>
                <Route path="/vendor-registration" element={<VendorRegistration/>}/>
                <Route path="/customer-registration" element={<CustomerRegistrationPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/farmer-dashboard/*" element={<FarmerDashboard/>}/>
            </Routes>
        </div>
    )
}