# Social App Platform

This is a full-stack social application project currently in its foundational development stage. It consists of a high-performance **FastAPI** backend that interacts with a **PostgreSQL** database through **SQLAlchemy**, and a structural React frontend.

## 🚀 Current Architecture

- **Backend Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Configuration:** Pydantic Settings (Environment Variables)
- **Frontend:** React (Vite/Create React App)

## ✨ Implemented Features

- **Database Integration:** Fully connected to a local PostgreSQL instance.
- **Environment Management:** Secure credential management using `.env`.
- **User CRUD:** Ability to create and retrieve user data with password hashing (bcrypt).
- **Post CRUD:** RESTful API endpoints to Create, Read, Update, and Delete social posts.
- **CORS Configured:** Backend is ready to securely accept requests from the React frontend.
- **Modular Routing:** Clean codebase utilizing FastAPI's `APIRouter` for posts, users, and auth.

## 🛠️ Local Setup Instructions

### 1. Requirements

- Python 3.10+
- PostgreSQL
- Node.js (for frontend)

### 2. Backend Setup

Navigate to the root directory and activate your virtual environment:

```bash
# On Linux/macOS
source venv/bin/activate
```

Create a `.env` file in the root directory and add your local database credentials:

```env
DATABASE_HOSTNAME=localhost
DATABASE_PORT=5432
DATABASE_PASSWORD=your_local_password
DATABASE_NAME=fastapi-project
DATABASE_USERNAME=postgres
```

### 3. Run the Server

Start the FastAPI application using Uvicorn:

```bash
uvicorn app.main:app --reload
```

You can access the automated interactive API documentation by visiting `http://localhost:8000/docs` in your browser.

## 🔮 Roadmap

- [ ] Add JWT Authentication & Login endpoints.
- [ ] Add Database Foreign Key relationships (Users own Posts).
- [ ] Build out the UI in the `react-frontend` folder.
