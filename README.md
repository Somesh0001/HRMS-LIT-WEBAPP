# HRMS-Lite Web Application

## Project Overview

HRMS-Lite is a lightweight Human Resource Management System designed to handle basic HR operations in a simple and efficient way. The application focuses on essential features such as employee management, attendance tracking, and a centralized dashboard view. It is suitable for small organizations, startups, and academic or learning purposes.

The project is developed as a full-stack web application using modern frontend and backend technologies. It follows a modular structure with RESTful APIs, making it easy to maintain and extend in the future.

---

## Tech Stack Used

### Frontend
- React (TypeScript)
- Vite
- Tailwind CSS
- PostCSS
- Axios / Fetch API

### Backend
- Node.js
- TypeScript
- Express.js
- Vite (for backend tooling)

### Database
- MongoDB
- Mongoose (ODM)

### Shared / Utilities
- Shared routes and schemas between frontend and backend
- Environment variables for configuration

---

## Steps to Run the Project Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Sumukhi90/HRMS-LIT-WEBAPP.git
cd HRMS-Lite-WebApp
2. Install Dependencies
Install backend dependencies:

cd backend
npm install
Install frontend dependencies:

cd frontend
npm install
3. Configure Environment Variables
Create a .env file inside the backend folder and add the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
Replace your_mongodb_connection_string with your actual MongoDB Atlas connection string.

4. Run the Backend Server
cd backend
npm run dev
The backend server will start on:

http://localhost:5000
5. Run the Frontend Application
cd frontend
npm run dev
The frontend application will start on:

http://localhost:5173
6. Access the Application
Open your browser and go to:

http://localhost:5173
Assumptions and Limitations

### Assumptions
- The application is intended for small-scale or learning-based usage.
- Users have basic technical knowledge to configure environment variables.
- MongoDB is available either locally or via MongoDB Atlas.
- Authentication and authorization requirements are minimal, assuming a single admin user.


### Limitations
- Authentication and role-based access control are not implemented (single admin usage assumed).
- The application is designed for small-scale use and is not optimized for high-traffic or enterprise environments.
- Automated testing and advanced error handling are not included.
