
# Blog API with JWT Authentication

🔗 [https://github.com/COZYTECH/Blog-API-with-JWTAuth](https://github.com/COZYTECH/Blog-API-with-JWTAuth)

> A secure, stateless, RESTful Blog API built with **Express.js**, implementing **JWT authentication**, clear authorization boundaries, and scalable architecture principles.

---

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?size=24&duration=3500&color=0A66C2&center=true&vCenter=true&width=800&lines=Secure+RESTful+Blog+API;Express.js+%7C+JWT+Auth+%7C+Clean+Architecture;Designed+for+Scalability+&+Production+Usage" />
</p>

---

## 🚀 Executive Summary

This project is more than just a CRUD API — it is structured to reflect **professional backend engineering standards**:

* Stateless authentication for horizontal scalability
* Ownership-based authorization for secure resource mutation
* Layered architecture for maintainability and testability
* Production-ready error and security models

It’s suited as a backend foundation for medium to large-scale applications, content platforms, or microservices-backed systems.

---

## 🧠 Architectural Overview

### 🔐 Stateless JWT Authentication

* JSON Web Tokens secure all protected routes
* Tokens are verified independently per request
* Supports scalable distributed deployments (no server sessions)
* Secret managed via environment variables

**Authorization header format:**

```
Authorization: Bearer <JWT>
```

---

### 📐 Layered Structure

```
src/
 ├── controllers/     // HTTP layer
 ├── services/        // Core business logic
 ├── middleware/      // Auth & validation
 ├── models/          // Database schemas
 ├── routes/          // API definitions
 └── app.js           // App config
```

Benefits:

* Clean separation of responsibilities
* Easier unit testing
* Independent evolution of layers
* Resilient to future protocol changes (e.g., GraphQL)

---

### 🔑 Ownership-Based Authorization

Mutation routes (update/delete post) enforce ownership rules:

* Only the author of a post can modify it
* Authorization logic resides in the service layer
* Prevents horizontal privilege escalation

This is a **real-world security pattern**, not just token verification.

---

## 📍 Core Features

### 🛡 Authentication

* User registration with bcrypt-hashed passwords
* JWT token generation with expiration
* Protected routes via token middleware
* Clear separation of auth & business logic

---

### 📝 Blog Post Resource

| Method | Endpoint             | Access        |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Public        |
| POST   | `/api/auth/login`    | Public        |
| GET    | `/api/posts`         | Public        |
| GET    | `/api/posts/:id`     | Public        |
| POST   | `/api/posts`         | Authenticated |
| PUT    | `/api/posts/:id`     | Owner Only    |
| DELETE | `/api/posts/:id`     | Owner Only    |

RESTful semantics with predictable behavior.

---

## 🔐 Security Model

### Passwords

* Passwords hashed using bcrypt
* Never stored in plaintext

### Token Lifecycle

* JWT signed with secret from `.env`
* Expiration enforced
* Verification middleware protects routes

### Access Control

* Authenticated routes require token
* Authorization logic ensures safe mutations

---

## ⚠ Error Strategy

* Centralized error handler
* Consistent status codes
* No sensitive data leakage
* Clear error format

Example:

```json
{
  "error": "Unauthorized",
  "status": 401
}
```

---

## 📈 Scalability Considerations

* Stateless auth → horizontal scaling
* No in-memory session storage
* Service layer ready for caching (Redis)
* Easily containerizable
* Ready for production deployment behind API gateways

---

## ⚙ Environment Setup

`.env` file:

```
PORT=5000
JWT_SECRET=supersecretkey
DB_URI=your_database_connection_string
NODE_ENV=development
```

---

## 🚀 Local Setup

```bash
git clone https://github.com/COZYTECH/Blog-API-with-JWTAuth
cd Blog-API-with-JWTAuth
npm install
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🏁 Production Readiness

This project is structured with production concerns:

✔ Stateless authentication
✔ Role-aware authorization
✔ Clear error surface
✔ Layered architecture
✔ Scalable design
✔ Environment-based config
✔ Readable, maintainable code

---

## ⏭ Future Enhancements

* Refresh token + rotation
* Swagger / OpenAPI documentation
* Request validation schemas (Joi / Zod)
* Pagination & filtering
* API rate limiting
* Redis caching for list endpoints
* Docker + Kubernetes support
* CI/CD pipelines

---

## 🧠 Engineering Decisions

**Why JWT?**
Scales across distributed services without session storage.

**Why layered design?**
Supports evolving requirements and improves testability.

**Why ownership enforcement in services?**
Keeps security enforcement consistent across controllers.


## 👤 Author

**Arigi Adinoyi Samuel**
Senior Backend & Full-Stack / DevOps Engineer
GitHub: [https://github.com/cozytech](https://github.com/cozytech)
LinkedIn: *https://www.linkedin.com/in/samuel-adinoyi*

