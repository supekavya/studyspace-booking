# 🏛 StudySpace — Smart Study Room Booking System

A full-stack web application for students to reserve study rooms and library seats in real-time, with admin management controls.

---

## 🧱 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router, Axios, Vite |
| Backend    | Java 17, Spring Boot 3, Spring Security |
| Database   | MySQL 8                             |
| Auth       | JWT (JSON Web Tokens)               |
| API Docs   | Swagger / OpenAPI 3                 |
| DevOps     | Docker, Docker Compose, Nginx       |

---

## 🚀 Running the Project

### Option A — Docker (Easiest, recommended)

> Requires: Docker + Docker Compose installed

```bash
# Clone / unzip the project
cd studyspace

# Start everything (MySQL + Backend + Frontend)
docker-compose up --build
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:8080        |
| Swagger  | http://localhost:8080/swagger-ui.html |

---

### Option B — Manual (Development Mode)

#### 1. Start MySQL

Make sure MySQL is running locally on port 3306.

Create the database:
```sql
CREATE DATABASE studyspace_db;
```

#### 2. Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

#### 3. Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at `http://localhost:8080`  
Swagger UI at `http://localhost:8080/swagger-ui.html`

#### 4. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## 🔐 Default Credentials

| Role    | Username | Password  |
|---------|----------|-----------|
| Admin   | admin    | admin123  |

Students can register at `/register`.

---

## 📦 Project Structure

```
studyspace/
├── backend/
│   ├── src/main/java/com/studyspace/
│   │   ├── StudySpaceApplication.java   # Entry point
│   │   ├── model/                       # JPA Entities (User, Room, Booking)
│   │   ├── repository/                  # Spring Data JPA Repositories
│   │   ├── controller/                  # REST Controllers
│   │   ├── security/                    # JWT auth, filters
│   │   └── config/                      # Security, CORS, Data Seeder
│   └── src/main/resources/
│       └── application.properties       # DB config, JWT config
│
├── frontend/
│   └── src/
│       ├── App.jsx                      # Routes
│       ├── main.jsx                     # Entry point
│       ├── services/api.js              # Axios API layer
│       ├── hooks/useAuth.jsx            # Auth context
│       ├── styles.js                    # Global CSS + design tokens
│       ├── components/Layout.jsx        # Nav + shell
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── BookRoom.jsx             # Time slot grid
│           ├── MyBookings.jsx
│           └── AdminPanel.jsx
│
└── docker-compose.yml                   # Full stack orchestration
```

---

## 📡 REST API Endpoints

### Auth
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| POST   | /api/auth/register  | Register new user   |
| POST   | /api/auth/login     | Login, get JWT      |

### Rooms
| Method | Endpoint                       | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | /api/rooms                     | All active rooms               |
| GET    | /api/rooms/{id}                | Single room                    |
| GET    | /api/rooms/available           | Rooms free in a time window    |
| GET    | /api/rooms/{id}/slots?date=... | Hourly slot availability       |
| POST   | /api/rooms *(Admin)*           | Create room                    |
| PUT    | /api/rooms/{id} *(Admin)*      | Update room                    |
| DELETE | /api/rooms/{id} *(Admin)*      | Deactivate room                |

### Bookings
| Method | Endpoint                  | Description                |
|--------|---------------------------|----------------------------|
| POST   | /api/bookings             | Create booking             |
| GET    | /api/bookings/my          | Current user's bookings    |
| GET    | /api/bookings/today       | Today's bookings           |
| GET    | /api/bookings/all *(Admin)* | All bookings             |
| GET    | /api/bookings/stats       | Dashboard statistics       |
| DELETE | /api/bookings/{id}        | Cancel booking             |

---

## ✅ Features

- **Real-time room availability** via slot grid
- **Conflict prevention** — server-side validation blocks double bookings
- **JWT authentication** — secure, stateless sessions
- **Role-based access** — Students vs Admin
- **Swagger UI** — interactive API docs at `/swagger-ui.html`
- **Auto-seeded data** — rooms + admin user created on first startup
- **Docker** — one command to run everything

---

## 🔧 Environment Variables (Production)

```env
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/studyspace_db
SPRING_DATASOURCE_USERNAME=your_user
SPRING_DATASOURCE_PASSWORD=your_secure_password
APP_JWT_SECRET=your_256bit_secret_key_here
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```
