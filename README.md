# BookShop_API

📌 Overview

This project demonstrates real-world backend development concepts such as:

RESTful API design

Authentication & Authorization

Database management

Layered architecture (Controller – Service – Repository)

Exception handling & validation

🛠️ Tech Stack

Backend: Spring Boot

Language: Java

Database: SQL Server / MySQL (update if needed)

ORM: Spring Data JPA

Security: Spring Security + JWT (if you used it)

Build Tool: Maven

API Testing: Postman

📂 Project Structure

    src/main/java/com/bookshop
    │
    ├── controller      # Handle API requests
    ├── service         # Business logic
    ├── repository      # Data access layer (JPA)
    ├── entity          # Database entities
    ├── dto             # Data Transfer Objects
    ├── config          # Security & app configurations
    └── exception       # Custom exceptions
🚀 Features

👤 User

Register / Login

Update profile

Role-based access (Admin / User)

📚 Book

Get all books

Search books by name/category

Add / Update / Delete books (Admin)

🛒 Order

Create order

View order history

Confirm payment

🔐 Authentication

JWT-based authentication

Secure endpoints with Spring Security

⚙️ Installation & Setup

Clone repository

git clone https://github.com/justlamvt05/BookShop_API.git

cd BookShop_API

Configure database

Update application.properties:

spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=bookshop

spring.datasource.username=your_username

spring.datasource.password=your_password

doc: https://docs.google.com/document/d/1iTgzkfybPUHIybZKzLbGeOrD23QcJJX8tN2KpHdpbOY/edit?tab=t.0

👨‍💻 Author

Vuong Thanh Lam

GitHub: https://github.com/justlamvt05 

📜 License

This project is for educational purposes.
