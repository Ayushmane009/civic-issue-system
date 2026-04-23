# Setup & Installation Guide

Follow these steps to set up the Civic Issue System after cloning the repository from GitHub:

## 1. Prerequisites
- **Node.js** (v14 or higher recommended)
- **MySQL Server** installed and running

## 2. Database Setup
1. Open your MySQL client.
2. Create a new database for the project:
   ```sql
   CREATE DATABASE civic_system;
   ```
3. Update the database connection settings in `backend/config/database.js` to match your local MySQL credentials (username and password).
4. Run the necessary SQL queries to create the tables (`users`, `issues`, `comments`) or import the provided SQL dump if available.

## 3. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory based on the `.env.example` file (if provided), or just ensure it has:
   ```env
   JWT_SECRET=your_jwt_secret_here
   BACKEND_PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

## 4. Frontend Setup
1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. The application should now be running at `http://localhost:3000`.

## 5. (Optional) Make yourself an Admin
If you need to test the admin controls, register a new account through the frontend, then run this SQL command in your database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your_registered_email@example.com';
```
