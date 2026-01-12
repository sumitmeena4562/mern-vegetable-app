# AgriConnect - Project Documentation

**AgriConnect** is a comprehensive B2B/B2C digital marketplace that bridges the gap between Farmers, Vendors, and Customers. This documentation covers the complete feature list, technology stack, system architecture, and setup instructions.

---

## 🚀 1. Features List

### 🔐 Authentication & Security
*   **Role-Based Access Control (RBAC)**: Distinct portals and permissions for:
    *   **Farmers**: Sell produce, manage farm details.
    *   **Vendors**: Bulk buy from farmers, manage shops.
    *   **Customers**: Buy fresh produce for home delivery.
    *   **Admin**: Platform oversight.
*   **Secure Login**:
    *   **Password Login**: Traditional email/mobile + password.
    *   **OTP Login**: Login using Mobile Number + OTP (No password required).
    *   **Password Strength Indicator**: Real-time feedback during registration.
*   **Forgot Password**: Secure OTP-based password reset flow (Email/Mobile).
*   **JWT Sessions**: Secure, stateless authentication using JSON Web Tokens.
*   **Mobile Access**: Fully configured for access via mobile devices over local network/Ngrok.

### 🌾 Farmer Modules
*   **Registration**: Detailed profile creation including:
    *   Personal Details & Farm Name.
    *   **Location Integration**: Auto-fetching States and Districts.
    *   **Crop Selection**: Multi-select interface for crops grown.
*   **Dashboard**: Real-time overview of sales and active listings.

### 🏪 Vendor Modules
*   **Business Profile**: Shop name, address, and daily buying capacity management.
*   **Marketplace**: Browse listed crops from farmers.

### 🛒 Customer Modules
*   **Shopping**: Browse available fresh produce.
*   **Preferences**: Set dietary preferences (e.g., specific vegetables).

### ⚙️ Technical Features
*   **Dynamic Routing**: Backend automatically loads routes, making scalability easy.
*   **API Proxying**: Frontend configured to proxy API requests, resolving CORS and network issues seamlessly.
*   **Real-time Notifications**: (Foundation laid with Socket.IO).

---

## 🛠️ 2. Technology Stack

### Frontend (Client)
*   **Core**: React 19, Vite (Fast build tool).
*   **Styling**: Tailwind CSS (Utility-first styling), Glassmorphism UI effects.
*   **State Management**: Context API (`AuthContext`).
*   **Networking**: Axios (with Interceptors for token handling).
*   **Routing**: React Router DOM v6+.
*   **UI Components**: Lucide React Icons, React Hot Toast (Notifications).

### Backend (Server)
*   **Runtime**: Node.js.
*   **Framework**: Express.js.
*   **Database**: MongoDB (Mongoose ODM).
    *   **Discriminators**: Efficiently storing different user types (Farmer/Vendor) in a single `Users` collection while maintaining specific schemas.
*   **Authentication**: `jsonwebtoken` (JWT), `bcryptjs` (Hashing).
*   **Email/Communication**: Nodemailer (Email OTPs).

### DevOps & Tools
*   **Mobile Testing**: Configured for `ngrok` and Local IP access (`--host`).
*   **Version Control**: Git.

---

## 🏗️ 3. Project Architecture

### Directory Structure
```text
AgriConnect-App/
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── api/            # API Service Layer (Centralized Axios)
│   │   ├── components/     # Reusable UI Blocks (Auth, Farmers, Common)
│   │   ├── contexts/       # Global State (Auth, Notifications)
│   │   ├── pages/          # Route Views
│   │   └── ...
│   └── vite.config.js      # Proxy & Host Configuration
│
└── server/                 # Backend API
    ├── src/
    │   ├── config/         # DB Connection
    │   ├── controllers/    # Business Logic (userController.js)
    │   ├── models/         # Mongoose Schemas (User, Farmer, Otp)
    │   ├── routes/         # API Endpoints (UserRoutes.js)
    │   └── utils/          # Helpers (sendMail.js)
    └── server.js           # Entry Point (App Setup, CORS, Dynamic Routes)
```

### Key Architectural Decisions
1.  **Unified User Controller**: Instead of fragmenting logic, `userController.js` handles core auth to ensure consistency across roles.
2.  **Proxy Server**: The Vite frontend proxies `/api` to the backend. This eliminates CORS headaches during local development and mobile testing.
3.  **Discriminator Pattern**: Using Mongoose Discriminators allows `Farmer`, `Vendor`, and `Customer` to inherit from `User`, keeping the database normalized.

---

## 📝 4. Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URL)

### Step 1: Backend Setup
```bash
cd server
npm install
# Create .env file with:
# PORT=5000
# MONGODB_URI=...
# JWT_SECRET=...
# EMAIL_USER=... (for OTPs)
npm run dev
```

### Step 2: Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Step 3: Mobile Testing (Optional)
To test on your phone connected to the same WiFi:
1.  Find your PC's IP (e.g., `192.168.1.5`).
2.  Run Frontend: `npm run dev -- --host`
3.  Open `http://192.168.1.5:5173` on your mobile.

---

## 🔮 5. Future Roadmap
*   **Rate Limiting**: Protect against brute-force attacks.
*   **Payment Gateway**: Integrate Razorpay/Stripe.
*   **Transactions**: Ensure data integrity during complex registration flows.
*   **Voice Assistance**: For accessibility to farmers.

---
*Generated by AgriConnect Dev Team*
