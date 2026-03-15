# TaskFlow – Task Management Application

Full-stack **Task Management** web app built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **React** (TypeScript), aligned with the Thiranex problem statement: user auth, CRUD for tasks, optional real-time updates, and responsive UI.

## Features

- **User authentication & authorization** – Register, login, JWT-protected routes
- **CRUD for tasks** – Create, read, update, delete tasks (title, description, status, due date)
- **Real-time updates** – Optional WebSockets (Socket.IO) for live task changes
- **Responsive design** – Works on web and mobile screens

## Tech Stack

| Layer    | Stack                          |
|----------|---------------------------------|
| Backend  | Node.js, Express, TypeScript   |
| Database | MongoDB (Mongoose)             |
| Auth     | JWT (jsonwebtoken), bcryptjs  |
| Real-time| Socket.IO                     |
| Frontend | React 18, TypeScript, Vite    |
| HTTP     | Axios, React Router            |

## Quick Start

1. **MongoDB** – Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free) or local MongoDB.
2. **Backend**
   ```bash
   cd server
   cp .env.example .env   # Edit .env: set MONGODB_URI and JWT_SECRET
   npm install
   npm run dev
   ```
3. **Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```
4. Open **http://localhost:5173** – Register, login, create tasks.

## Step-by-Step Setup: MongoDB & Postman

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for:

- MongoDB Atlas vs local MongoDB setup
- Environment variables (`server/.env`)
- How to connect and test with **Postman** (with example requests)
- Importing the Postman collection in `postman/`
- Troubleshooting

## Project Layout

```
taskmanagement/
├── client/          # React + TypeScript (Vite) – port 5173
├── server/          # Express + TypeScript API – port 5000
├── postman/         # Postman collection & environment
├── SETUP_GUIDE.md   # Detailed setup (MongoDB, Postman, run steps)
└── README.md
```

## API Overview

| Method | Endpoint              | Description        |
|--------|------------------------|--------------------|
| GET    | /api/health            | Health check       |
| POST   | /api/auth/register     | Register           |
| POST   | /api/auth/login        | Login              |
| GET    | /api/auth/me           | Current user (JWT) |
| GET    | /api/tasks             | List tasks (JWT)   |
| GET    | /api/tasks/:id         | Get task (JWT)     |
| POST   | /api/tasks             | Create task (JWT)  |
| PUT    | /api/tasks/:id         | Update task (JWT)  |
| DELETE | /api/tasks/:id         | Delete task (JWT)  |

## Reference

Structure and patterns were inspired by the reference app at `c:/Users/user/Documents/task_manager_app_new` (Next.js + TypeScript).

---

Built for full-stack learning: API design, MongoDB integration, and dynamic data handling.
