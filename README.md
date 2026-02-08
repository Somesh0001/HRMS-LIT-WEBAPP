# HRMS Lite – Full Stack Application

## 📌 Project Overview
HRMS Lite is a lightweight Human Resource Management System designed to handle basic HR operations for a small organization.  
The application allows an admin to manage employee records and track daily attendance through a clean, professional, and responsive web interface.

This project was developed as a **full-stack coding assignment** with a focus on:
- Clean UI/UX
- Robust backend APIs
- Proper data persistence
- Error handling and validations
- Deployment readiness

---

## 🚀 Live Demo
- **Frontend URL:** https://<your-frontend-url>
- **Backend API URL:** https://<your-backend-url>

---

## 🛠 Tech Stack

### Frontend
- React (TypeScript)
- Vite
- Tailwind CSS
- ShadCN UI
- React Query
- Responsive design (Desktop + Mobile with Hamburger Menu)

### Backend
- Node.js
- Express
- RESTful APIs
- Server-side validation & error handling

### Database
- PostgreSQL (via Drizzle ORM)

### Deployment
- Frontend: Netlify
- Backend: Render
- Database: Hosted PostgreSQL

---

## ✨ Features

### 👨‍💼 Employee Management
- Add new employees
  - Employee ID (unique)
  - Full Name
  - Email Address (validated)
  - Department
- View list of all employees
- Delete employee records
- Prevent duplicate employee IDs

### 📅 Attendance Management
- Mark daily attendance (Present / Absent)
- View attendance records per employee
- Persist attendance data in database

### 📱 Responsive Design
- Fully functional on desktop and mobile
- Sidebar for desktop view
- Hamburger menu for mobile view
- Desktop UI remains unaffected by mobile changes

### 🧪 UI States
- Loading indicators
- Empty states
- Error handling with meaningful messages

---

## 🔐 Assumptions & Limitations
- Single admin user (no authentication)
- Payroll, leave management, and advanced HR features are out of scope
- Designed for internal use with basic HR needs

---

## ⚙️ How to Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Sumukhi90/HRMS-LIT-WEBAPP.git
cd HRMS-LIT-WEBAPP
