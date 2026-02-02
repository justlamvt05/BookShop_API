    📚 BookShop – Full Stack Application

BookShop is a full-stack web application for managing an online book shop, built with Spring Boot on the backend and React (Vite) on the frontend.
📌 Overview

BookShop is a full-stack project designed to practice real-world web development concepts, including RESTful APIs, frontend–backend integration, security, and clean architecture.

Backend: Spring Boot REST API

Frontend: React + Vite

Architecture: Layered & scalable
🧩 Project Structure

BookShop

    ├── backend (Spring Boot)
    │   └── src/main/java/com.justlamvt05.bookshop
    │       ├── domain
    │       ├── payload
    │       ├── mapper
    │       ├── service
    │       ├── payment
    │       ├── security
    │       ├── exception
    │       └── BookshopApplication.java
    │
    ├── frontend (React + Vite)
    │   ├── src
    │   │   ├── components
    │   │   ├── pages
    │   │   ├── services
    │   │   ├── api
    │   │   └── App.jsx
    │   └── vite.config.js

🔙 Backend – Spring Boot
📂 Backend Package Structure
com.justlamvt05.bookshop

    ├── domain        # Entities & domain models
    ├── payload       # Request / Response DTOs
    ├── mapper        # Entity ↔ DTO mapping
    ├── service       # Business logic
    ├── payment       # Payment-related logic
    ├── security      # Authentication & authorization
    ├── exception     # Global exception handling

🔧 Backend Features

RESTful API design

Clean layered architecture

DTO mapping

Centralized exception handling

Security-ready structure

Payment module separation

Frontend – React + Vite
🛠️ Frontend Technologies

React

Vite

JavaScript

Axios / Fetch API

Sample API Endpoints
Method	Endpoint	Description
GET	/api/books	Get all books
GET	/api/books/{id}	Get book by ID
POST	/api/books	Create a new book
PUT	/api/books/{id}	Update book
DELETE	/api/books/{id}	Delete book


▶️ How to Run the Project
git clone -b Develop https://github.com/justlamvt05/BookShop_API
mvn clean install
mvn spring-boot:run


Backend runs at:

http://localhost:8080

2️⃣ Frontend
git clone -b Develop-fe https://github.com/justlamvt05/BookShop_API
npm install
npm run dev


Frontend runs at:

http://localhost:5173


🔗 Frontend – Backend Integration

Frontend communicates with backend via REST APIs

CORS is configured in Spring Boot

API base URL is configured in frontend services

Example:

const API_BASE_URL = "http://localhost:8080/api";

🧪 Testing

Backend: Postman / cURL

Frontend: Browser & React DevTools

📈 Future Enhancements

Authentication with JWT

Role-based access control

Shopping cart & order flow

Payment gateway integration

👤 Author

Vuong Thanh Lam
GitHub: justlamvt05







