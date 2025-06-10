# Expense Tracker App

A full-stack smart expense tracking application with a **React Native (Expo)** frontend and an **Express.js** backend. It allows users to create, manage, and analyze personal expenses with support for authentication, rate-limiting, and scheduled jobs.

## Features

### 📱 Mobile (Frontend - React Native)
- Authentication via [Clerk](https://clerk.dev)
- Secure sign-in, sign-up, and forgot-password flows
- Create & delete expense or income transactions
- Category selection with icons
- Realtime transaction summary and balance
- Expo router with stack navigation
- Responsive and styled UI components

### 🌐 Backend (Express.js)
- RESTful API for managing transactions
- Neon/PostgreSQL integration for data persistence
- Upstash Redis for rate limiting
- Scheduled jobs using `cron`
- Secure environment variable handling via `dotenv`
- CORS enabled

## Technologies Used

### Frontend
- React Native (Expo SDK 53)
- Expo Router v5
- Clerk for user authentication
- React Navigation
- `react-native-keyboard-aware-scroll-view`

### Backend
- Express.js
- Neon (PostgreSQL serverless DB)
- Upstash Redis + Rate Limiter
- Cron Jobs
- Nodemon (dev)

## Getting Started

### 📦 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in environment variables
npm run dev
```

### 📱 Mobile App Setup

```bash
cd mobile
npm install
npx expo start
```

Ensure you set the correct `API_URL` in `constants/api.js` to match your backend server.


## Scripts

### Backend
- `npm run dev`: Start server with hot-reloading
- `npm start`: Start production server

### Mobile
- `npm run android`, `ios`, `web`: Launch app on target
- `npm run reset-project`: Reset Expo project config

## License

[ISC](https://opensource.org/licenses/ISC)

---

Built with ❤️ using Expo and Express.
