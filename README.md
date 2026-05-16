# 🟢 Goal Portal - Full Stack Goal Setting & Performance Tracking System

A full-stack web application built using React, Node.js, Express, and MongoDB that helps organizations manage employee goals and track performance in real time.

---

# 🚀 FEATURES

👨‍💼 Employee Features
- Create goals (Thrust Area, Title, Description)
- Set target and weightage
- Track progress in real time
- Update achievement status

🧑‍💼 Manager Features
- View all employee goals
- Approve / Reject goals
- Monitor performance dashboard

⚙️ System Features
- JWT Authentication
- Role-based login (Employee / Manager)
- MongoDB database integration
- REST API backend
- Real-time progress calculation

---

# 🛠️ TECH STACK

Frontend:
React.js
Axios
CSS

Backend:
Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs

---

# 📁 PROJECT STRUCTURE

goal-portal/
├── backend/
├── frontend/
├── models/
├── routes/
├── controllers/

---

# 🔐 AUTHENTICATION FLOW

1. User logs in
2. JWT token generated
3. Token stored in localStorage
4. Token sent in API requests
5. Backend validates token

---

# 📊 PROGRESS LOGIC

Numeric / Percentage:
(progress = (achievement / target) * 100)

Zero Based:
(if achievement == 0 → 100%)

Timeline:
(if Completed → 100%)

---

# 🔗 API ROUTES

POST /api/auth/register
POST /api/auth/login

POST /api/goals/create
GET /api/goals/:employeeId

PUT /api/goals/update-progress/:goalId

GET /api/goals/manager/all
PUT /api/goals/approve/:goalId

---

# ⚙️ HOW TO RUN

Backend:
cd backend
npm install
npm start

Frontend:
cd frontend
npm install
npm start

---

# 🌐 DEPLOYMENT

Backend → Render
Frontend → Vercel
Database → MongoDB Atlas

---

# 👨‍💻 AUTHOR

Atla 
Saru Varma

---

# ⭐ STATUS

✔ Full Stack Completed
✔ Backend Ready
✔ Frontend Ready
✔ Deployment Ready
