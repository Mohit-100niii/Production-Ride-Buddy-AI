# 🚖 RideBuddy AI

RideBuddy AI is an **AI-powered voice-based ride booking platform** that allows users to book rides using natural speech.  
It provides **real-time fare estimation, secure payments, and a seamless booking flow** with a modern tech stack.

---

Demo Link - https://production-ride-buddy-ai.vercel.app/

## ✨ Features

- 🎙️ **Voice-based Ride Booking** – Book rides by speaking naturally.
- 📍 **Real-time Fare Calculation** – Distance-based pricing with MongoDB-stored rates.
- 💳 **Stripe Payment Integration** – Secure card payments with email receipts.
- 🔒 **JWT Authentication** – Login and signup with HttpOnly cookies.
- 📊 **Admin-Friendly Backend** – FastAPI backend with async MongoDB driver (Motor).
- ⚡ **Modern Frontend** – Built using Next.js with responsive UI.
- ☁️ **Deployment Ready** – Can be deployed on Netlify (frontend) and Render (backend).

---

## 🏗️ Project Structure

Ride_Buddy_AI_/
│── Voice_Ride_Buddy-Frontend/ # Next.js frontend
│── Voice-Ride-Buddy-AI_Backend/ # FastAPI backend
│── README.md



---

## 🛠️ Tech Stack

### Frontend
- **Next.js** (React framework)
- TailwindCSS (UI styling)
- Voice recognition APIs

### Backend
- **FastAPI** (Python async framework)
- **MongoDB** with Motor (async driver)
- JWT Authentication with cookies

### Payments
- **Stripe API** for ride fare payment & receipt emails

### Booking Demo 
<img width="1911" height="851" alt="Screenshot 2026-10-25 201302" src="https://github.com/user-attachments/assets/8e75a2ac-2bb8-4092-bbbf-b5f51048a151" />
<img width="1902" height="843" alt="Screenshot 2026-10-25 201410" src="https://github.com/user-attachments/assets/86c3973c-85b5-4f9a-ad47-958a5794f5c7" />
<img width="1892" height="835" alt="Screenshot 2026-10-25 201419" src="https://github.com/user-attachments/assets/ec37b205-1690-4303-819d-f583880a6058" />
<img width="1901" height="835" alt="Screenshot 2026-10-25 201511" src="https://github.com/user-attachments/assets/12535821-d447-493a-9cc8-03f6d827299d" />
<img width="1916" height="842" alt="Screenshot 2026-10-25 201900" src="https://github.com/user-attachments/assets/d293c1da-3bac-4516-bc66-ea785a4355e8" />
<img width="1787" height="780" alt="Screenshot 2026-10-25 201954" src="https://github.com/user-attachments/assets/7949d8c3-83b5-406c-8ef8-3880a0ce5d21" />
<img width="1877" height="837" alt="Screenshot 2026-10-25 202058" src="https://github.com/user-attachments/assets/cd773511-867a-4721-8e3d-868cda621927" />
<img width="1913" height="847" alt="Screenshot 2026-10-25 202109" src="https://github.com/user-attachments/assets/8594856b-8f1b-48e4-9bab-88cad2ccfeae" />
<img width="1885" height="782" alt="Screenshot 2026-10-25 202121" src="https://github.com/user-attachments/assets/446aea0e-b932-4e42-96aa-9489a20d787f" />
<img width="1912" height="846" alt="Screenshot 2026-10-25 202222" src="https://github.com/user-attachments/assets/a7c74451-c450-4461-9943-30daabb43766" />



---
## 🔑 Environment Variables
MONGODB_URI=mongodb+srv://your_cluster
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret

 -- Frontend (.env.local)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_KEY=your_stripe_publishable_key

## 🚀 Deployment

Frontend: Deploy on Netlify

Backend: Deploy on Render
 or Heroku

Database: Use MongoDB Atlas

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Mohit-100niii/Ride_Buddy_AI_.git
cd Ride_Buddy_AI_



