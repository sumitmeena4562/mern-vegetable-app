# 🥬 AgriConnect - Farm to Fork Marketplace

AgriConnect is a comprehensive digital supply chain platform designed to bridge the gap between Farmers, Vendors, and Customers. By eliminating middlemen and digitizing the marketplace, it ensures fair pricing for farmers, fresh produce for customers, and organized business processes for vendors.

---

## 🚀 Features

- **Role-Based Access Control**: Distinct portals for Farmers, Vendors, and Customers.
- **Real-Time Data**: Live dashboards for sales, inventory, and market prices.
- **Secure Authentication**: JWT-based auth with OTP verification.
- **Inventory Management**: Automated stock tracking for vendors.
- **Responsive Design**: Mobile-first approach using React and Tailwind CSS.
- **Geo-Location**: Location-based services for finding nearby vendors/farmers.

---

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Google Material Symbols, Phosphor/Lucide (if applicable)

### Server (Backend)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, bcryptjs
- **Real-time**: Socket.IO
- **File Storage**: Cloudinary (via Multer)

---

## �️ Database & Configuration

### 1. Environment Setup (.env)
Create a `.env` file in the `server/` directory and add the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
MONGODB_URI=mongodb://127.0.0.1:27017/agriconnect
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/agriconnect

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=30d
```

### 2. Database Connection Logic
The database connection is managed in `server/src/config/database.js`. It handles connection retries and error logging automatically.

**`server/src/config/database.js`**:
```javascript
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agriconnect';
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

let connected = false;

const connectDB = async (retries = 0) => {
  if (connected) return;
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });

    connected = true;
    const { host, port, name } = mongoose.connection;
    console.log(`✅ MongoDB connected: ${host}:${port}/${name}`);
    
    mongoose.connection.on('disconnected', () => {
      connected = false;
      console.warn('⚠️ MongoDB disconnected');
    });
  } catch (err) {
    const attempt = retries + 1;
    console.error(`❌ MongoDB connection error (attempt ${attempt}): ${err?.message}`);

    if (retries < MAX_RETRIES) {
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(retries + 1);
    }
    throw err;
  }
};

export default connectDB;
```

### 3. Running MongoDB
- **Local:** Ensure **MongoDB Community Server** is running (`mongod`).
- **Cloud (Atlas):** Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), whitelist your IP, and paste the Connection String into `MONGODB_URI`.

---

## 📂 Project Structure Explained

To help you understand and contribute, here is a detailed breakdown of every file and folder.

### 🖥️ Client (Frontend) - `client/src`
Where the React application lives.

```text
client/src/
├── api/                        # 📡 Backend Communication
│   ├── axios.js                # Sets up the connection to the server. Automatically attaches your "Token" to every request so the server knows who you are.
│   └── farmerApi.js            # Contains specific functions like `registerFarmer()` or `getFarmerStats()`. Keeps your UI code clean.
│
├── components/                 # 🧩 Reusable Building Blocks
│   ├── Common/                 # Buttons, Inputs, Modals that are used everywhere.
│   ├── Farmers/                # Components just for Farmers (e.g., "AddProductForm").
│   └── ...
│
├── contexts/                   # 🧠 Global State (The App's Memory)
│   ├── AuthContext.jsx         # Remembers "Is the user logged in?" and "Who is the user?". usable via `useAuth()`.
│   └── NotificationContext.jsx # Manages pop-up alerts (success/error messages) across the app.
│
├── pages/                      # 📄 Full Website Pages
│   ├── auth/                   # Login and Registration pages.
│   ├── Farmer/                 # Farmer Dashboard pages.
│   └── Landing.jsx             # The first page visitors see.
│
├── App.jsx                     # 🚦 Router. Decides which page to show based on the URL (e.g., if URL is /login, show LoginPage).
├── main.jsx                    # 🏁 Entry Point. This is where React actually starts and attaches to the index.html file.
└── index.css                   # 🎨 Global Styles. Tailwind CSS is set up here.
```

---

### ⚙️ Server (Backend) - `server/src`
Where the Logic and Database connections live.

```text
server/src/
├── config/                     # ⚙️ Configuration
│   └── database.js             # Connects to MongoDB. Fails safely and retries if the connection drops.
│
├── models/                     # 🗄️ Database Schemas (Data Blueprints)
│   │   # These files tell MongoDB exactly what fields to save for each type of data.
│   ├── User.js                 # Base user info (email, password, role: farmer/vendor/customer).
│   ├── Farmer.js               # Extra farmer details (farm address, crops).
│   ├── Product.js              # Details about a vegetable (price, quantity, name).
│   ├── Order.js                # Tracks who bought what, how much, and payment status.
│   ├── Notification.js         # Stores alerts for users.
│   └── ...
│
├── controllers/                # 🧠 The Brains (Route Logic)
│   │   # These functions run when a user visits a URL. They do the actual work.
│   ├── authController.js       # Handles Registration, Login, and creating Tokens.
│   ├── productController.js    # Logic for Adding, Deleting, and Updating products.
│   ├── userController.js       # Logic for getting profile info.
│   └── farmerController.js     # Specific logic for farmer dashboards.
│
├── middleware/                 # 🛡️ Gatekeepers
│   ├── auth.js                 # Checks the "Token" before letting a user access a private route. If no token, it blocks them.
│   └── error.js                # Catches bugs/crashes and sends a clean error message back to the frontend.
│
├── routes/                     # 📍 URL Definitions
│   │   # Maps URLs to Controllers.
│   ├── authRoutes.js           # Defines: POST /api/auth/login, POST /api/auth/register
│   ├── product.js              # Defines: GET /api/products, POST /api/products
│   └── FarmersRoutes.js        # Defines farmer specific URLs.
│
└── utils/                      # 🛠️ Helpers
    └── ...                     # Small utility functions (like "sendEmail" or "calculateTotal").
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: Environment to run JavaScript outside the browser.
- **MongoDB**: The database engine.
- **Git**: Version control.

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone <repository_url>
    cd AgriConnect-App
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install                 # Installs dependencies listed in package.json
    # Create the .env file as explained above!
    npm run dev                 # Starts the server in "watch" mode (auto-restarts on save)
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install                 # Installs React, Tailwind, etc.
    npm run dev                 # Starts the local React development server
    ```

### Running the Project

You need **two** terminal windows running at the same time:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
(Expected output: `✅ MongoDB connected... Server running on port 5000`)

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
(Expected output: `Local: http://localhost:5173/`)

---

## 👨‍💻 Author

**Sumit Meena**  
MERN Stack Developer
