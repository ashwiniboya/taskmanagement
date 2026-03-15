# TaskFlow – Full-Stack Setup Guide

Step-by-step guide to run the Task Management app, connect MongoDB, and test APIs with Postman.

---

## I already have MongoDB installed (local)

If MongoDB is already installed on your machine:

1. **Start MongoDB** (if it’s not running):
   - **Windows:** Open **Services** → find **MongoDB Server** → Start. Or open a terminal and run `mongod`.
   - **Mac:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
2. Use this connection string in `server/.env` (a `.env` file is already set up for local use):
   ```env
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   ```
3. From the project root, run the backend and frontend (see **Quick Start** in README or sections 2 and 4 below).

---

## Prerequisites

- **Node.js** (v18 or newer) – [Download](https://nodejs.org/)
- **MongoDB** – either:
  - **MongoDB Community** installed locally, or
  - **MongoDB Atlas** (free cloud) – [Sign up](https://www.mongodb.com/cloud/atlas)
- **Postman** (optional, for API testing) – [Download](https://www.postman.com/downloads/)

---

## 1. MongoDB Setup

### Option A: MongoDB Atlas (recommended for beginners)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **Cluster** (e.g. free M0).
3. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your database user credentials.
   - Create a DB user under **Database Access** if you haven’t.
   - Add your IP (or `0.0.0.0/0` for testing) under **Network Access**.
5. Add your database name to the URL. After `.mongodb.net/` put `taskmanagement`:
   ```
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
   ```
6. Save this as your `MONGODB_URI` (see Step 3 below).

### Option B: Local MongoDB

1. Install MongoDB Community from [MongoDB Download Center](https://www.mongodb.com/try/download/community).
2. Start the MongoDB service:
   - **Windows:** Services → start “MongoDB Server”, or run `mongod` from a terminal.
   - **Mac:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
3. Default connection string:
   ```
   mongodb://localhost:27017/taskmanagement
   ```
4. Use this as `MONGODB_URI` in Step 3.

---

## 2. Clone / Open Project and Install Dependencies

Open a terminal in the project root: `c:\Users\user\Documents\taskmanagement`

**Backend:**

```bash
cd server
npm install
```

**Frontend (new terminal or after backend):**

```bash
cd client
npm install
```

---

## 3. Environment Variables (Backend)

1. In the `server` folder, copy the example env file:
   - **Windows (PowerShell):** `Copy-Item .env.example .env`
   - **Mac/Linux:** `cp .env.example .env`

2. Edit `server/.env` and set:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
# Or for Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CLIENT_URL=http://localhost:5173
```

- **MONGODB_URI:** Your Atlas or local MongoDB URL (with database name `taskmanagement`).
- **JWT_SECRET:** Any long random string for production.

---

## 4. Run the Application

**Terminal 1 – Backend (from `server`):**

```bash
cd server
npm run dev
```

You should see: `MongoDB connected` and `Server running on http://localhost:5000`.

**Terminal 2 – Frontend (from `client`):**

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). You can register, log in, and create/update/delete tasks.

---

## 5. Connect and Test with Postman

### Base URL

- All API requests: `http://localhost:5000/api`

### 5.1 Health check (no auth)

- **Method:** GET  
- **URL:** `http://localhost:5000/api/health`  
- **Expected:** `{ "status": "ok", "message": "Task Management API" }`

### 5.2 Register a user

- **Method:** POST  
- **URL:** `http://localhost:5000/api/auth/register`  
- **Headers:** `Content-Type: application/json`  
- **Body (raw JSON):**

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "yourpassword"
}
```

- **Response:** You get a `token` and `user`. Copy the **token** for the next steps.

### 5.3 Login

- **Method:** POST  
- **URL:** `http://localhost:5000/api/auth/login`  
- **Headers:** `Content-Type: application/json`  
- **Body (raw JSON):**

```json
{
  "email": "you@example.com",
  "password": "yourpassword"
}
```

- Copy the **token** from the response.

### 5.4 Use the token in Postman

For all task and “me” endpoints:

1. Open the **Authorization** tab.
2. Type: **Bearer Token**.
3. Paste your token in the **Token** field.

Or add a header:

- **Key:** `Authorization`  
- **Value:** `Bearer YOUR_TOKEN_HERE`

### 5.5 Get current user

- **Method:** GET  
- **URL:** `http://localhost:5000/api/auth/me`  
- **Auth:** Bearer Token (as above)

### 5.6 Tasks CRUD

| Action   | Method | URL                                      | Body (for POST/PUT) |
|----------|--------|------------------------------------------|----------------------|
| List     | GET    | `http://localhost:5000/api/tasks`        | -                    |
| Get one  | GET    | `http://localhost:5000/api/tasks/:id`     | -                    |
| Create   | POST   | `http://localhost:5000/api/tasks`        | `{"title":"My task","description":"Optional","status":"todo"}` |
| Update   | PUT    | `http://localhost:5000/api/tasks/:id`    | `{"title":"Updated","status":"in-progress"}` |
| Delete   | DELETE | `http://localhost:5000/api/tasks/:id`    | -                    |

**Create task example (Body → raw → JSON):**

```json
{
  "title": "Finish report",
  "description": "Submit by Friday",
  "status": "todo",
  "dueDate": "2025-03-20"
}
```

**Update task example:** use the same fields you want to change; `status` can be `"todo"`, `"in-progress"`, or `"done"`.

---

## 6. Postman Collection (optional)

A Postman collection is provided so you can import all requests at once.

1. Open Postman → **Import** → **File**.
2. Select: `taskmanagement/postman/TaskFlow-API.postman_collection.json`.
3. (Optional) Import `TaskFlow-API.postman_environment.json` and set the `token` variable after login/register.
4. Use the requests from the collection; set the token in the collection or environment as needed.

---

## 7. Troubleshooting

| Issue | What to check |
|-------|----------------|
| “MongoDB connection error” | Correct `MONGODB_URI` in `server/.env`; MongoDB running (local) or Atlas IP/user/password. |
| “Authentication required” in Postman | Token set in Authorization → Bearer Token, or `Authorization: Bearer <token>` header. |
| CORS errors in browser | Backend running on port 5000; `CLIENT_URL` in `.env` matches frontend (e.g. `http://localhost:5173`). |
| Frontend can’t reach API | Run backend with `npm run dev` in `server`; frontend uses Vite proxy to `/api` (no need to change frontend URL). |

---

## 8. Project Structure

```
taskmanagement/
├── client/                 # React + TypeScript (Vite)
│   ├── src/
│   │   ├── api/            # Axios client, auth & tasks API
│   │   ├── components/     # Layout, TaskForm, TaskList
│   │   ├── context/        # AuthContext
│   │   ├── hooks/          # useSocket (real-time)
│   │   ├── pages/          # Login, Register, Dashboard
│   │   └── types/          # Task types
│   └── package.json
├── server/                 # Express + TypeScript
│   ├── src/
│   │   ├── config/         # db.ts, socket.ts
│   │   ├── middleware/     # auth.middleware.ts
│   │   ├── models/         # User, Task (Mongoose)
│   │   ├── routes/         # auth.routes, task.routes
│   │   └── index.ts
│   ├── .env                # You create from .env.example
│   └── package.json
├── postman/                # Postman collection & environment
└── SETUP_GUIDE.md          # This file
```

You now have a full-stack task app with MongoDB and step-by-step Postman testing. For production, use a strong `JWT_SECRET` and a proper MongoDB Atlas connection string with network and user permissions locked down.
