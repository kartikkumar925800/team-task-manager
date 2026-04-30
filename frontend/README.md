# Enterprise Team Task Manager

A full-stack, role-based task management system designed to mirror enterprise workflows. Built to demonstrate secure authentication, relational database management, and dynamic frontend state.

## The Architecture
* **Frontend:** Next.js, Tailwind CSS, Context API for global state.
* **Backend:** FastAPI, Pydantic, SQLAlchemy.
* **Database:** PostgreSQL (Production) / SQLite (Local).
* **Security:** Stateless JWT Authentication, Bcrypt password hashing, strict Role-Based Access Control (RBAC).

## Live Demo & Testing Instructions

To properly evaluate the Role-Based Access Control (RBAC), please follow this testing flow using the provided credentials.

### 1. The Manager Flow (Admin)
**Credentials:**
* Email: `admin@test.com`
* Password: `securepassword123`

**Actions to test:**
Log in with these credentials. You have full system clearance. Navigate to the Projects tab to create a new project. Inside that project, you can create new tasks and assign them to specific team members. 

### 2. The Team Member Flow (Restricted)
**Actions to test:**
Log out of the Admin account. On the Login page, click "Sign up now" and create a fresh account. 

Notice that the system automatically assigns the `MEMBER` role to new signups. As a Member, your dashboard will be empty. You cannot create projects or tasks. You can only view and update the status of tasks that the Admin explicitly assigned to you.