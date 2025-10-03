Complaint Registration Web Application

A full-stack web application built with Spring Boot (backend) and React (frontend) for managing complaint registration and resolution.

This system allows users to log in as either Student or Admin:

Students can submit complaints and track their status.

Admins can view all complaints and update their statuses.

Features
Student

Register/Login to the system

Submit a complaint with details (title, description, category, etc.)

View list of submitted complaints

Track the status of each complaint (Pending, In Progress, Resolved)

Admin

Login as Admin

View all complaints submitted by students

Change the status of complaints (Pending → Resolved)

Tech Stack
Backend (Spring Boot)

Java + Spring Boot

Spring Data JPA (for database operations)

MySQL/PostgreSQL (or H2 for development)

Spring Security (for authentication and role-based access)

REST APIs

Frontend (React)

React (CRA or Vite)

React Router (for navigation)

Axios/Fetch (for API calls)

TailwindCSS / Bootstrap (for UI styling)
