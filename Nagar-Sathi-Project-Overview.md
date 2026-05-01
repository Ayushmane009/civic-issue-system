# Nagar-Sathi: Civic Issue System

Nagar-Sathi is a full-stack civic issue reporting platform that empowers citizens to report local problems (like potholes, broken streetlights, or waste dumps) and allows local authorities to track and resolve these issues efficiently.

## 🏗️ Architecture Overview

The system is built on a modern **React** frontend and a robust **Node.js/Express** backend, utilizing a relational **MySQL** database.

---

## 🎨 Frontend (Client-Side)

The frontend provides an intuitive, responsive, and aesthetically pleasing interface for users to report issues, track their progress, and view community reports on a map.

### Technologies & Libraries
- **React.js (v18)**: Core framework for building UI components.
- **React Router (v6)**: For declarative routing across different pages (Home, Dashboard, Report, Map, Admin Panel).
- **Leaflet & React-Leaflet**: Integrated for interactive map features. It allows users to pinpoint exact issue locations and view issue clusters.
- **Lucide-React**: Provides crisp, consistent, and customizable SVG icons used throughout the app.
- **Axios**: For making asynchronous HTTP requests to the backend API.
- **Context API (`AuthContext`)**: Manages global authentication state (login status, user profile, role).
- **Custom CSS Variables**: Implements a modern Light Theme using dynamic CSS variables for colors, typography, borders, and animations (`globals.css`).

### Key Features
1. **Interactive Dashboard**: Displays statistics (total, pending, resolved issues) and a live activity feed.
2. **Issue Reporting Form**: Users can upload evidence (photos), provide a title/description, select categories (Infrastructure, Sanitization, Safety, Transport), assign a priority, and specify a precise location.
3. **Interactive Map View**: Visualizes all reported issues on an interactive map using custom Leaflet popups and markers based on issue status.
4. **Community Engagement**: Users can browse issues reported by others and interact with them.
5. **Admin Panel**: Provides a dedicated workspace for department admins to manage, update status, and add remarks to issues assigned to their specific department.
6. **Authentication Views**: Login and Registration pages supporting both traditional email/password and Google OAuth workflows.

---

## ⚙️ Backend (Server-Side)

The backend exposes a secure RESTful API that handles business logic, database management, file uploads, authentication, and email notifications.

### Technologies & Libraries
- **Node.js & Express.js**: The core runtime and web framework.
- **MySQL2**: Relational database driver used with raw SQL queries for performant data access and automatic table migrations on startup.
- **JSON Web Tokens (JWT) & bcryptjs**: Used for secure authentication, token generation, and password hashing.
- **Passport.js**: Implements Google OAuth2 strategy for seamless social logins.
- **Multer**: Middleware used to handle multipart/form-data for image uploads during issue reporting.
- **Nodemailer**: Integrates with Gmail OAuth2 (via OAuth2 client) to send automated email updates to users when their issues are resolved or updated.

### Database Schema (MySQL)
The application automatically creates and migrates the following tables on startup:
1. **`users`**: Stores user credentials, profile information, role (`user` vs `admin`), and `department_id` (for admin routing).
2. **`issues`**: Central table containing issue details (title, description, location, lat/lng, image path, category, priority, status, timestamps) and foreign keys linking to the reporting user and assigned department.
3. **`departments`**: Stores the available city departments (e.g., Infrastructure, Sanitization).
4. **`upvotes`**: A join table tracking user upvotes on specific issues to prioritize popular community problems.

### Key Features
1. **Role-Based Access Control (RBAC)**: Enforces access restrictions. Only users with the `admin` role can access department-specific endpoints to update issue statuses or add resolution remarks.
2. **Department Routing**: Issues are automatically or manually routed to specific departments based on category (e.g., Waste issues to Sanitization). Admins only see issues assigned to their department.
3. **Automated Email Service**: Whenever an admin updates an issue's status (e.g., moving it to 'Resolved'), the backend triggers a professional, HTML-formatted email to notify the user.
4. **Auto-Migration**: The `database.js` configuration includes automated scripts to create missing tables or columns (like `lat`, `lng`, `priority`, `department_id`) ensuring smooth deployments.
5. **Local File Storage**: Uploaded photo evidence is stored locally in an `/uploads` directory and served statically.

---

## 🚀 Workflow Example: Reporting an Issue

1. **User Action**: A citizen logs in and navigates to the Report page. They upload a photo of a broken streetlight, add a description, select the 'Infrastructure' category, and drop a pin on the map.
2. **API Request**: The frontend sends a `multipart/form-data` POST request to the backend.
3. **Processing**: Express handles the request, Multer saves the image to `/uploads`, and the backend extracts the data.
4. **Database Entry**: A new record is inserted into the `issues` table, linked to the user's ID and flagged as 'Pending'.
5. **Resolution**: An Infrastructure Admin sees the issue on their Admin Panel, fixes the light, and changes the status to 'Resolved' with a remark.
6. **Notification**: The backend triggers Nodemailer to send a success email to the user, and the Map updates the pin color to green!
