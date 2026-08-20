# EventPulse API

EventPulse is a backend REST API for an event management platform inspired by platforms such as Eventbrite and Meetup.

The API allows users to register and log in securely using JWT authentication, while administrators can create, update, and delete events. Users can browse events using filtering, pagination, sorting, and text search. The platform also supports event registration, capacity management, real-time announcements using Socket.io, API documentation with Swagger, and automated testing.

## 🚀 Features

* User registration and login
* JWT-based authentication
* Role-based authorization with `admin` and `attendee` roles
* Event CRUD operations
* Event filtering by category, city, and date range
* Pagination
* Sorting
* Text search
* MongoDB relationships using Mongoose `populate()`
* Event registration and cancellation
* Event capacity management
* Prevention of duplicate registrations
* Real-time event announcements with Socket.io
* Centralized error handling
* Request validation
* Jest and Supertest testing
* Swagger API documentation
* Health monitoring endpoint
* MongoDB Atlas database
* Vercel deployment

---

## 🛠️ Tech Stack

* **Node.js** — JavaScript runtime
* **Express.js** — Web application framework
* **MongoDB** — Database
* **Mongoose** — MongoDB ODM
* **Socket.io** — Real-time communication
* **JWT** — Authentication
* **bcrypt** — Password hashing
* **express-validator** — Request validation
* **Jest** — Testing framework
* **Supertest** — HTTP/API testing
* **Swagger UI Express** — Interactive API documentation
* **Morgan** — HTTP request logging
* **Vercel** — Deployment platform

---

## 📁 Project Structure

```text
EventPulse/
├── config/
│   ├── db.js
│   └── swagger.js
├── controllers/
|   ├── announcements.controller.js
│   ├── auth.controller.js
│   ├── events.controller.js
│   |__ registrations.controller.js
├── middleware/
|   ├── auth.js
│   ├── errorHandler.js
│   ├── requireAuth.js
│   ├── requireRole.js
│   └── validate.js
├── models/
│   ├── User.js
│   ├── Event.js
│   ├── Category.js
│   ├── Registration.js
│   └── Message.js
├── routes/
│   ├── auth.routes.js
│   ├── events.routes.js
│   ├── registrations.routes.js
│   └── announcements.routes.js
├── tests/
|   ├── integration
|   |   └── events.test.js
│   └── unit
|       ├── AppError.test.js
|       └── asyncHandler.test.js
├── utils/
|   ├── AppError.js
│   ├── asyncHandler.js
│   └── errorHandler.js
├── app.js
├── server.js
├── seed.js
├── vercel.json
├── package.json
├── jest.config.js
└── README.md
```

---

## ⚙️ Local Installation

### 1. Clone the repository

```bash
git clone <https://github.com/islambahaanasheed/30910010106819-EventPulse.git>
```

Move into the project directory:

```bash
cd 30910010106819-EventPulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the `.env` file

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret
```

Replace the placeholder values with your actual MongoDB Atlas connection string and JWT secret.


### 4. Seed the database

Run the database seed script:

```bash
npm run seed
```

This populates the database with sample data required for development and testing.

### 5. Start the development server

```bash
npm start
```

The API will normally be available at:

```text
http://localhost:3000
```

---

## 📚 API Documentation

Swagger UI is available at:

```text
http://localhost:3000/api-docs
```

The Swagger documentation provides an interactive interface for testing the API.

It currently documents the main **Authentication** and **Events** endpoints, including HTTP methods, request parameters, request bodies, authentication requirements, and expected responses.

---

## 🩺 Health Check

The API provides a health monitoring endpoint:

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "environment": "development",
  "uptime": 123.456,
  "database": "connected"
}
```

The endpoint reports:

* API status
* Current environment
* Server uptime
* MongoDB connection status

---

# 📡 API Endpoint Summary

## Authentication

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register a new attendee |
| POST   | `/api/auth/login`    | Login and receive a JWT |

## Events

| Method | Endpoint          | Description                                                |
| ------ | ----------------- | ---------------------------------------------------------- |
| GET    | `/api/events`     | Get events with filtering, pagination, sorting, and search |
| GET    | `/api/events/:id` | Get a single event                                         |
| POST   | `/api/events`     | Create a new event — Admin only                            |
| PATCH  | `/api/events/:id` | Update an existing event — Admin only                      |
| DELETE | `/api/events/:id` | Delete an event — Admin only                               |

### Event Query Parameters

The event listing endpoint supports:

```text
/api/events?category=<id>
/api/events?city=Cairo
/api/events?startDate=2026-01-01&endDate=2026-12-31
/api/events?search=workshop
/api/events?page=1&limit=10
/api/events?sortBy=date&order=asc
```

Multiple parameters can be combined.

---

## Event Registration

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| POST   | `/api/registrations`     | Register for an event        |
| GET    | `/api/registrations/my`  | Get all my regestrations     |
| DELETE | `/api/registrations/:id` | Cancel an event registration |

The registration system enforces event capacity and prevents duplicate registrations.

---

## Announcements

| Method | Endpoint                      | Description                         |
| ------ | ----------------------------- | ----------------------------------- |
| POST   | `/api/announcements`          | Create an event announcement        |
| GET    | `/api/announcements/:eventId` | Retrieve announcements for an event |

Announcements are also delivered in real time using Socket.io event rooms.

---

## System

| Method | Endpoint    | Description                                |
| ------ | ----------- | ------------------------------------------ |
| GET    | `/`         | Verify that the EventPulse API is running  |
| GET    | `/health`   | Check API uptime and database connection   |
| GET    | `/api-docs` | Open interactive Swagger API documentation |

---

# 🔐 Authentication

EventPulse uses JSON Web Tokens (JWT) for authentication.

After logging in successfully, the API returns a JWT:

```json
{
  "status": "success",
  "token": "YOUR_JWT_TOKEN"
}
```

Protected endpoints require the token in the HTTP `Authorization` header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

There are two user roles:

* `admin` — Can manage events and send announcements
* `attendee` — Can register for events and access attendee functionality

---

# 🔄 Real-Time Announcements

EventPulse uses Socket.io to provide real-time announcements.

Each event has its own Socket.io room.

Clients can join an event room using:

```text
join-event
```

When an announcement is created, connected attendees can receive it in real time.

Announcements are also persisted in MongoDB.

---

# 🧪 Testing

The project uses:

* **Jest** for the testing framework
* **Supertest** for testing HTTP endpoints

Run the test suite with:

```bash
npm test
```

---

# 🌐 Live Deployment

The EventPulse API is deployed using Vercel.

**Live API:**

> Replace the URL below with your actual Vercel deployment URL.

```text
https://30910010106819-event-pulse-novu.vercel.app
```

### Health Check

```text
https://30910010106819-event-pulse-novu.vercel.app/health
```

### Swagger Documentation

```text
https://30910010106819-event-pulse-novu.vercel.app/api-docs
```

---

# 👨‍💻 Development Workflow

The project follows a structured Git workflow using Conventional Commits.

Examples:

```bash
git commit -m "feat: add event registration"
git commit -m "fix: resolve database connection issue"
git commit -m "docs: update API documentation"
git commit -m "test: add event API tests"
```

The release version is tagged using:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

---

# 📄 License

This project was developed as the second-semester final project for the EventPulse Backend API.
