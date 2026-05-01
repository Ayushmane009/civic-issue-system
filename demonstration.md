# Civic Issue System - API & Functionality Demonstration

This document provides a simple overview of how the Civic Issue System works, explaining the various APIs and functions that power the application.

---

## 1. User Authentication & Profile
These functions manage how users join the platform and access their information.

*   **User Registration (`POST /api/users/register`)**: Allows new users to create an account by providing their name, email, and password.
*   **User Login (`POST /api/users/login`)**: Authenticates existing users and provides a security token (JWT) to access protected features.
*   **Google Login (`GET /auth/google`)**: A convenient way to sign in using your Google account without needing a separate password.
*   **User Profile (`GET /api/users/profile`)**: Retrieves the current logged-in user's details, such as their name, email, and role (User or Admin).

---

## 2. Civic Issue Management
This is the core of the application, where issues are reported and tracked.

*   **Report an Issue (`POST /api/issues/report`)**: Allows users to submit a new civic problem. They can include:
    *   **Title & Description**: What the problem is.
    *   **Category**: Type of issue (e.g., Infrastructure, Safety).
    *   **Location & Coordinates**: An address and precise map coordinates (Lat/Lng).
    *   **Priority**: How urgent the issue is (Low, Medium, High, Urgent).
    *   **Image**: A photo of the issue.
*   **View All Issues (`GET /api/issues/all`)**: Shows a list of all reported issues from across the city.
*   **View Issue Details (`GET /api/issues/:id`)**: Shows everything about a specific issue, including the map, description, and comments.
*   **Delete Issue (`DELETE /api/issues/:id`)**: Allows administrators to remove inappropriate or duplicate reports.

---

## 3. Interaction & Engagement
Functions that let the community participate in solving issues.

*   **Upvote Issue (`POST /api/issues/:id/upvote`)**: Users can upvote issues to show they agree it's important. This helps officials prioritize work.
*   **Add Comment (`POST /api/issues/comment`)**: Allows users to discuss an issue, provide updates, or ask questions.

---

## 4. Administration & Tracking
Tools for officials to manage the lifecycle of a complaint.

*   **Update Status (`PUT /api/issues/status`)**: Administrators can change an issue's status (e.g., from "Pending" to "In Progress" or "Resolved").
*   **Update Priority (`PUT /api/issues/priority`)**: Administrators can change how urgent an issue is based on their assessment.

---

## 5. Map & Location Services
How the system handles geographic data.

*   **Location Detection**: The frontend uses your browser's GPS to find your current location when reporting.
*   **Map Visualization**: Uses Leaflet and OpenStreetMap to display issues on a dark-themed interactive map.
*   **India-Centric Defaults**: The map is designed to default to the Delhi region in India for a localized experience.

---

## 6. Departments
*   **List Departments (`GET /api/departments`)**: Shows the different city departments responsible for various issues.
*   **Department Issues (`GET /api/departments/:id/issues`)**: Shows issues specific to a single department (e.g., all "Transport" issues).

---

## Technical Highlights
*   **Frontend**: Built with React for a fast, responsive user interface.
*   **Backend**: Powered by Node.js and Express.
*   **Database**: Uses MySQL to store all user data and issue reports securely.
*   **Storage**: Images are stored locally on the server and served via a static route.
