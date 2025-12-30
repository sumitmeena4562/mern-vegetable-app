# AgriConnect Backend

A modern farmer-to-vendor platform backend built with Node.js, Express 5, and MongoDB.

## 🚀 Features

- User authentication (Farmer, Vendor, Customer)
- JWT-based authentication
- Real-time updates with Socket.IO
- File upload with Cloudinary
- Email and SMS notifications
- Rate limiting and security
- ES6 Modules support

## 📦 Technologies

- **Runtime:** Node.js
- **Framework:** Express 5.2.1
- **Database:** MongoDB with Mongoose 9.0.2
- **Authentication:** JWT, bcryptjs
- **Real-time:** Socket.IO 4.8.3
- **File Upload:** Multer, Cloudinary
- **Validation:** express-validator, Joi
- **Security:** Helmet, CORS, express-rate-limit

## 🏗️ Installation

1. Clone the repository
```bash
git clone <repository-url>
cd agr-backend



# 🥬 Digital Sabji Supply Chain System  
### Farmer – Vendor – Customer (MERN Stack Project)

---

## 📌 Project Introduction

Digital Sabji Supply Chain System ek **role-based web application** hai jo traditional sabji market me aane wali real-life problems ko solve karta hai.  
Ye system **Farmer, Vendor aur Customer** ke beech ek **transparent, digital aur efficient connection** banata hai.

---

## 🎯 Objective of the Project

- Farmer ko fair price dilana  
- Vendor ka business organized banana  
- Customer ko fresh aur affordable sabji dena  
- Pure supply chain ko digital banana  

---

## 🌍 Existing System (Real-Life Scenario)

| Problem (Real Life)              | Solution (Proposed System) |
|----------------------------------|----------------------------|
| Sabji selling process manual hai | Digital web platform       |
| Koi centralized system nahi      | Single integrated system   |
| Data paper-based hota hai        | MongoDB database           |
| Transparency nahi hoti           | Real-time dashboards       |

---

## 🚜 Farmer Related Problems & Solutions

### Problem 1: Farmer ko sahi daam nahi milta  
**Reason:** Market price ka knowledge nahi hota  

✅ **Solution:**  
System farmer ko sabji list karne aur current market price dekhne ka option deta hai, jisse farmer fair price decide kar sakta hai.

---

### Problem 2: Middlemen zyada profit le jaate hain  
**Reason:** Farmer direct buyer tak nahi pahunch pata  

✅ **Solution:**  
Platform farmer ko **direct vendor aur customer** se connect karta hai, jisse dependency kam hoti hai.

---

### Problem 3: Payment delay aur confusion  
**Reason:** Manual payment aur koi record nahi  

✅ **Solution:**  
System me **digital payment tracking** hota hai jisme farmer apni sales aur payment status dekh sakta hai.

---

### Problem 4: Demand ka idea nahi hota  
**Reason:** Koi data analysis nahi  

✅ **Solution:**  
Farmer dashboard me sales history aur demand trends show hote hain.

---

## 🏪 Vendor (Valtor) Related Problems & Solutions

### Problem 1: Farmer se manual dealing  
**Reason:** Phone calls aur mandi visits  

✅ **Solution:**  
Vendor directly platform se farmer ki sabji purchase kar sakta hai.

---

### Problem 2: Inventory ka record nahi hota  
**Reason:** Manual stock handling  

✅ **Solution:**  
Inventory Management System jisme stock auto-update hota hai.

---

### Problem 3: Sabji waste hone se loss  
**Reason:** Demand ka data available nahi  

✅ **Solution:**  
Vendor ko previous order history aur demand analysis milta hai.

---

### Problem 4: Profit/Loss calculation mushkil  
**Reason:** Accounting system nahi  

✅ **Solution:**  
System automatic **profit/loss calculation** provide karta hai.

---

## 🧑 Customer Related Problems & Solutions

### Problem 1: Sabji mehngi milti hai  
**Reason:** Price transparency nahi  

✅ **Solution:**  
Customer multiple vendors ke prices compare kar sakta hai.

---

### Problem 2: Quality aur freshness ka trust nahi  
**Reason:** No feedback system  

✅ **Solution:**  
Rating aur review system jisse quality check hoti hai.

---

### Problem 3: Limited choice  
**Reason:** Sirf nearby vendor  

✅ **Solution:**  
Customer platform par available sabhi vendors dekh sakta hai.

---

## ⚠️ System-Level Problems & Solutions

| System Problem        | Solution           |
|---------------------- |--------------------|
| Data loss             | MongoDB Database   |
| Unauthorized access   | JWT Authentication |
| Role confusion        | Role-Based A ccess |
| Scalability issue     | MERN Architecture  |

---

## 💡 Proposed System Overview

Digital Sabji Supply Chain System ek **secure, scalable aur user-friendly** MERN stack application hai jo:

- Farmer ko empowerment deta hai  
- Vendor ka business automate karta hai  
- Customer experience improve karta hai  

---

## 🔐 Role-Based Modules

### 👨‍🌾 Farmer
- Add / update sabji
- Manage quantity & price
- View sales & payment history

### 🏪 Vendor
- Purchase sabji from farmers
- Manage inventory
- Set selling price
- Track profit/loss

### 🧑 Customer
- Browse sabji
- Add to cart
- Place order
- Rate & review

---

## 🛠️ Technology Stack

- **Frontend:** React.js + Tailwind CSS  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **API Type:** REST API  

---

## 🎯 Expected Outcomes

- Farmer income increase 📈  
- Vendor losses decrease 📉  
- Customer satisfaction 😊  
- Transparent supply chain 🌱  

---

## 🚀 Future Enhancements

- Online payment gateway  
- Delivery tracking  
- AI-based price prediction  
- Mobile application  

---

## 🏆 Conclusion

Ye project ek **real-world agriculture problem** ko solve karta hai aur MERN stack ka **complete practical implementation** dikhata hai.  
Multi-role system, security, scalability aur transparency ki wajah se ye project **interview aur industry ready** hai.

---




📍 Location Flow Chart:
text
1. Database check (saved location) → If found → Use it
2. If not found → Check geolocation permission
3. If permission granted → Get current location → Convert to address
4. If permission denied → Show "Add Location" button
5. If geolocation fails → Default to "Pune, Maharashtra"
## 👨‍💻 Developed By

**Sumit Meena**  
MERN Stack Developer  
