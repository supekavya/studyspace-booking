<div align="center">

# 🏛 StudySpace
### Smart Study Room Booking System

[![Java](https://img.shields.io/badge/Java-23-orange?style=for-the-badge&logo=openjdk&logoColor=white)](https://adoptium.net)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io)

**A full-stack web platform that lets students reserve study rooms in real-time, eliminating double bookings and manual scheduling chaos on campus.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Docs](#-api-endpoints) • [Screenshots](#-screenshots)

---

</div>

## 🎯 Problem Statement

In colleges, universities, and libraries, students face daily frustration due to:

- ❌ No real-time visibility into room availability
- ❌ Manual or paper-based booking systems
- ❌ Double bookings and scheduling conflicts
- ❌ Wasted time walking around looking for empty rooms
- ❌ No admin control over space utilization

**StudySpace solves all of this** with a digital, real-time booking platform that works for both students and administrators.

---

## ✨ Features

### 👨‍🎓 Student Features
| Feature | Description |
|---|---|
| 🗓 **Real-time Slot Grid** | See all rooms × all time slots at a glance |
| ✅ **Instant Booking** | Click a free slot and reserve in seconds |
| 🚫 **Conflict Prevention** | Server-side validation blocks double bookings |
| 📋 **My Bookings** | View, track and cancel your reservations |
| 🔍 **Smart Filters** | Filter by floor, capacity, date |
| 🔐 **Secure Login** | JWT-based authentication |

### ⚙️ Admin Features
| Feature | Description |
|---|---|
| 📊 **Dashboard Stats** | Live counts of rooms, bookings, utilization |
| 🏠 **Room Management** | Create, update, deactivate rooms |
| 📋 **All Bookings** | View and cancel any booking across the system |
| 📈 **Utilization Charts** | Per-room usage bars to optimize space |

---

## 🧱 Tech Stack

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│   React 18 + Vite + React Router + Axios            │
├─────────────────────────────────────────────────────┤
│                    BACKEND                           │
│   Java 23 + Spring Boot 3 + Spring Security + JWT   │
│   Spring Data JPA + REST APIs + Swagger/OpenAPI      │
├─────────────────────────────────────────────────────┤
│                    DATABASE                          │
│   MySQL 8 — rooms, users, bookings tables            │
├─────────────────────────────────────────────────────┤
│                    DEVOPS                            │
│   Docker + Docker Compose + Nginx                    │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+ → [Download](https://adoptium.net)
- Maven 3.9+ → [Download](https://maven.apache.org)
- Node.js 18+ → [Download](https://nodejs.org)
- MySQL 8 → [Download](https://dev.mysql.com/downloads/installer/)

### Option A — Docker (One Command)

```bash
docker-compose up --build
```

| Service  | URL |
|----------|-----|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend | http://localhost:8080 |
| 📄 Swagger | http://localhost:8080/swagger-ui.html |

### Option B — Manual Setup

**1. Create MySQL database**
```sql
CREATE DATABASE studyspace_db;
```

**2. Configure database credentials**

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_PASSWORD
```

**3. Run the backend**
```bash
cd backend
mvn spring-boot:run
```

**4. Run the frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

**5. Open** → http://localhost:5173

---

## 🔐 Default Login

| Role | Username | Password |
|------|----------|----------|
| 🛡️ Admin | `admin` | `admin123` |
| 👨‍🎓 Student | Register at `/register` | — |

---

## 📁 Project Structure

```
studyspace/
│
├── 📂 backend/                          # Spring Boot API
│   └── src/main/java/com/studyspace/
│       ├── 🟢 StudySpaceApplication.java   # Entry point
│       ├── 📂 model/                       # JPA Entities
│       │   ├── User.java                   # Student/Admin
│       │   ├── Room.java                   # Study room
│       │   └── Booking.java                # Reservation
│       ├── 📂 repository/                  # Database queries
│       ├── 📂 controller/                  # REST endpoints
│       │   ├── AuthController.java         # Login/Register
│       │   ├── RoomController.java         # Room CRUD
│       │   └── BookingController.java      # Bookings
│       ├── 📂 security/                    # JWT Auth
│       └── 📂 config/                      # Security + Seeder
│
├── 📂 frontend/                         # React App
│   └── src/
│       ├── 📂 pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx            # Stats + room overview
│       │   ├── BookRoom.jsx             # Time slot grid
│       │   ├── MyBookings.jsx           # Personal bookings
│       │   └── AdminPanel.jsx           # Admin controls
│       ├── 📂 services/
│       │   └── api.js                   # Axios API layer
│       └── 📂 hooks/
│           └── useAuth.jsx              # Auth context + JWT
│
└── 🐳 docker-compose.yml               # Full stack orchestration
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register        Register new student
POST   /api/auth/login           Login → returns JWT token
```

### Rooms
```
GET    /api/rooms                All active rooms (filter by capacity/floor)
GET    /api/rooms/{id}           Single room details
GET    /api/rooms/available      Rooms free in a time window
GET    /api/rooms/{id}/slots     Hourly slot availability for a room + date
POST   /api/rooms          🔒    [Admin] Create room
PUT    /api/rooms/{id}     🔒    [Admin] Update room
DELETE /api/rooms/{id}     🔒    [Admin] Deactivate room
```

### Bookings
```
POST   /api/bookings             Create new booking (conflict-checked)
GET    /api/bookings/my          Current user's bookings
GET    /api/bookings/today       All bookings for today
GET    /api/bookings/stats       Dashboard statistics
GET    /api/bookings/all   🔒    [Admin] All bookings
DELETE /api/bookings/{id}        Cancel booking
```

> 🔒 = Admin role required | All endpoints except `/api/auth/**` require Bearer JWT token

---

## 🛡️ Security Architecture

```
Request → JWT Filter → Validate Token → Load User → Spring Security Context
                ↓
         Unauthorized (401) if token missing/invalid
                ↓
         Role check (STUDENT / ADMIN) for protected routes
```

- Passwords hashed with **BCrypt**
- Stateless sessions via **JWT** (24hr expiry)
- **CORS** configured for frontend origin only
- Role-based method security with `@PreAuthorize`

---

## 🗄️ Database Schema

```sql
users        → id, username, email, password, full_name, role, created_at
rooms        → id, name, capacity, floor, description, color, active
room_amenities → room_id, amenity
bookings     → id, user_id, room_id, date, start_time, end_time, purpose, status, created_at
```

---

## 🔮 Future Enhancements

- [ ] 📧 Email confirmation on booking
- [ ] 📱 Mobile app (React Native)
- [ ] 📲 QR code check-in at room door
- [ ] 🔁 Recurring weekly bookings
- [ ] 📊 Analytics dashboard with charts
- [ ] 🔔 Push notifications for upcoming sessions
- [ ] 💺 Seat-level booking within rooms
- [ ] 🗺️ Interactive campus map

---

## 👥 Team

Built with ❤️ for the Hackathon

---

<div align="center">

**⭐ Star this repo if you found it useful!**

Made with Java • Spring Boot • React • MySQL

</div>
