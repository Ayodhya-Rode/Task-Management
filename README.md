
# Task Management API

A secure RESTful Task Management API built using Node.js, Express.js, MongoDB, and JWT Authentication. This project provides user authentication with cookie-based JWT and serves as the backend for a task management application.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Cookie Parser
- Morgan

## Features

### Authentication

- User Registration
- User Login
- User Logout
- Password Hashing using bcrypt
- JWT Authentication
- HTTP Only Cookie Authentication
- Protected Routes using JWT Middleware

### Security

- Password Encryption
- JWT Token Verification
- Input Validation
- Email Normalization
- HTTP Only Cookies
- Proper HTTP Status Codes
- Error Handling using Try-Catch

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Protected |

## Project Structure

```
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── app.js
│
├── server.js
├── package.json
└── README.md
```

## Installation

```bash
git clone <repository-url>
```

```bash
cd backend
```

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Run the Project

```bash
npm start
```

The server will start at:

```
http://localhost:3000
```

## Upcoming Features

- Dashboard API
- Task CRUD Operations
- User-specific Tasks
- Task Priority
- Task Status
- Due Date Management
- Search & Filter Tasks
