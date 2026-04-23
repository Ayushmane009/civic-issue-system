NagarSathi - Civic Issue Reporting and Resolution System

This is a web application made to help people report civic problems in their area like potholes, garbage, water leakage, broken street lights, etc.

The main idea of this project is that if a person sees a problem, they can directly upload a photo and location through the app, and the complaint will reach the correct authority.

Why We Made This

Many times people see problems near theirNagarSathi - Civic Issue Reporting System

NagarSathi is a web application that helps people report civic issues like potholes, garbage, water leakage, and broken street lights.

Users can upload a photo, add location, and send the complaint directly to the concerned authority.

Why This Project?

Many people see problems around them but don’t know where to report them.

This project makes it simple:

Report issues in seconds
Track complaint status
Get updates when resolved
Features
For Users
Login / Sign up with Google
Report an issue with image
Add location using map
Select issue type
Track complaint status
View previous complaints
Get notifications
For Admin
View all issues
Filter by type and location
Update status (Pending → In Progress → Resolved)
Assign issues to departments
How It Works
1. User sees a problem  
2. Uploads photo & location  
3. Issue is stored in database  
4. Admin reviews the issue  
5. Status is updated  
6. User gets notification  
Technologies Used
Frontend: React.js, HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MySQL
ORM: Sequelize
Authentication: Google OAuth + JWT
Maps: Google Maps API / Leaflet
Image Upload: Cloudinary
Database (Simple Overview)

The project uses MySQL with these main tables:

Users → stores user details
Issues → stores all complaints
Departments → handles issue categories
Issue History → tracks status updates
Notifications → informs users
Project Structure
NagarSathi/
│
├── frontend/
├── backend/
│   ├── config/      (MySQL connection)
│   ├── models/      (Sequelize models)
│   ├── routes/
│   └── controllers/
│
├── README.md
How to Run
1. Clone project
git clone https://github.com/Ayushmane009/civic-issue-system.git
cd nagarsathi
2. Start frontend
cd frontend
npm install
npm start
3. Start backend
cd backend
npm install
npm run dev
Environment Variables

Create .env file in backend:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nagarsathi

JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
Status Types
Pending → Issue reported
In Progress → Work started
Resolved → Issue fixed
Future Improvements
AI to detect issue from image
Multi-language support
Voice-based complaint
Reward system for users
Author

Ayush Mane

License

Free for learning and college use home or college, but they do not know where to complain or if anyone will solve it.

So we made this project to make the process simple.

With this project, anyone can:

Report a problem
Upload a photo
Add the location
Track if the problem is solved
Main Features
User Features
Login / Sign Up with Google
Report an issue
Upload image of the issue
Add location using map
Choose issue type
Track complaint status
View all previous complaints
Get notifications when issue is solved
Admin Features
View all reported issues
Filter issues by type and location
Change complaint status
Assign issue to department
View analytics and reports
Example

Suppose there is a pothole near your road.

You open the app, login with Google, upload a photo of the pothole, select the location from the map and submit it.

After that, the admin can see the complaint and update its status.

Technologies Used
Part	Technology
Frontend	React.js / HTML / CSS / JavaScript
Backend	Node.js + Express.js
Database	MySQL
ORM	Sequelize
Authentication	Google OAuth 2.0 + JWT
Maps	Google Maps API or Leaflet
Image Upload	Cloudinary / Local Storage
Notifications	Email / SMS / Push Notification
Project Structure
NagarSathi/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.js
│
├── backend/
│   ├── config/        ← database connection (MySQL)
│   ├── models/        ← Sequelize models
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── database/          ← SQL schema (optional)
├── README.md
└── package.json
How to Run the Project
1. Clone the Project
git clone https://github.com/Ayushmane009/civic-issue-system
cd nagarsathi
2. Install Frontend
cd frontend
npm install
npm start

Frontend will run on:

http://localhost:3000
3. Install Backend

Open a new terminal:

cd backend
npm install
npm run dev

Backend will run on:

http://localhost:5000
Environment Variables

Create a .env file inside backend folder.

PORT=5000

# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nagarsathi

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_URL=your_cloudinary_url
Database Info (MySQL)

This project uses MySQL with Sequelize ORM.

Main tables:

Users
Issues

Relations:

One user can create multiple issues
Each issue belongs to one user
Pages in the Project
Home Page
Login Page
Register Page
Dashboard
Report Issue Page
Map Page
Complaint History Page
Admin Dashboard
Complaint Status

Each complaint can have one of these statuses:

Status	Meaning
Pending	The issue was reported but not checked yet
In Progress	Workers are fixing the issue
Resolved	The issue has been fixed
Project Flow
User sees a problem
        ↓
User uploads photo + location
        ↓
Issue is stored in MySQL database
        ↓
Admin sees the issue
        ↓
Admin changes status
        ↓
User gets update
Future Improvements

In the future, we can add:

AI to detect the type of issue from photo
Live chat with city office
Voice complaint system
Multiple language support
Reward points for users who report issues
Contributors
Ayush Mane
License

This project is free to use for learning and college projects.
