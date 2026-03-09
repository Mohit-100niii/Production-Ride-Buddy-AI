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



