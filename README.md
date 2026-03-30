# 🏙️ NagarSathi - Civic Issue Reporting and Resolution System

Welcome to NagarSathi!

This project helps people tell the city about problems around them, like:

* Broken roads 🛣️
* Garbage on the street 🗑️
* Water leakage 💧
* Street lights not working 💡
* Potholes 🚧

Think of it like a "complaint app" for your city.
A user clicks a photo, sends the location, and the problem is shown to the correct department.

---

# 🌟 Why We Made This

Sometimes people see a problem near their home, but they do not know:

* Who to tell
* Where to complain
* Whether the problem is fixed or not

So we made NagarSathi.

With this project, anyone can:

1. Report a problem
2. Upload a photo
3. Add the location
4. Track if the problem is solved

---

# 🎯 Main Features

## For Users

* Login / Sign Up with Google
* Report an issue
* Upload image of the issue
* Add location using map
* Choose issue type
* Track complaint status
* View all previous complaints
* Get notifications when issue is solved

## For Admin / Government Officer

* View all reported issues
* Filter issues by type and location
* Change complaint status
* Assign issue to department
* View analytics and reports

---

# 🧒 Simple Example

Imagine you are walking to school and see a big pothole.

You open NagarSathi.

1. Click "Report Issue"
2. Take a photo of the pothole
3. Select "Road Problem"
4. Tap your location on the map
5. Press Submit

Now the city office can see it and fix it.

---

# 🛠️ Technologies Used

| Part           | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | React.js / HTML / CSS / JavaScript |
| Backend        | Node.js + Express.js               |
| Database       | MongoDB                            |
| Authentication | Google OAuth 2.0 + JWT             |
| Maps           | Google Maps API or Leaflet         |
| Image Upload   | Cloudinary / Local Storage         |
| Notifications  | Email / SMS / Push Notification    |

---

# 🗂️ Project Structure

```text
NagarSathi/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.js
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── database/
├── README.md
└── package.json
```

---

# 🚀 How To Run This Project

## 1. Clone the Project

```bash
git clone https://github.com/your-username/nagarsathi.git
cd nagarsathi
```

## 2. Install Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

## 3. Install Backend

Open a new terminal:

```bash
cd backend
npm install
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

# 🔐 Environment Variables

Create a `.env` file inside backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_URL=your_cloudinary_url
```

---

# 📸 Screens in the Project

* Home Page
* Login Page
* Register Page
* Dashboard
* Report Issue Page
* Map Page
* Complaint History Page
* Admin Dashboard

---

# 📊 Complaint Status

Each complaint can have one of these statuses:

| Status      | Meaning                                    |
| ----------- | ------------------------------------------ |
| Pending     | The issue was reported but not checked yet |
| In Progress | Workers are fixing the issue               |
| Resolved    | The issue has been fixed                   |

---

# 🔄 Flow of the Project

```text
User sees a problem
        ↓
User uploads photo + location
        ↓
Issue is stored in database
        ↓
Admin sees the issue
        ↓
Admin changes status
        ↓
User gets update
```

---

# 🧠 Future Improvements

In the future, we can add:

* AI to detect the type of issue from photo
* Live chat with city office
* Voice complaint system
* Multiple language support
* Reward points for users who report issues

---

# 🤝 Contributors

Made with hard work and chai ☕ by:

* Ayush Mane
* Team Members

---

# 📜 License

This project is free to use for learning and college projects.

---

# ❤️ Final Line

"Small reports can make a big city better."
