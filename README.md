![Status](https://img.shields.io/badge/Project%20Status-Active-brightgreen)
![License](https://img.shields.io/github/license/rasha-2k/PackTrack?color=blue)
---

![alt text](Documents/images/PackTrack-Logo.png)

---

# 📦 PackTrack

> **PackTrack** is a lightweight web-based application designed to help users organize and track their personal deliveries in one centralized platform. It streamlines delivery tracking, provides packaging tips, and adds a fun touch with motivational quotes.

---

## 📚 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Roles & Contributions](#-roles--contributions)
3. [Tech Stack](#-tech-stack)
4. [Core Features](#-core-features)

   * [User Features](#-user-features)
   * [Admin Features](#-admin-features)
   * [Add-on Dashboard Charts](#-add-on-dashboard-charts)
5. [Project Structure](#-project-structure)
6. [User Interface](#-user-interface)
7. [Setup Instructions](#️-setup-instructions)

   * [Local Setup](#-local-setup)
   * [Docker Setup](#-optional-docker-setup)
8. [Environment Variables](#-environment-variables)
9. [DevOps & CI/CD](#-devops--cicd)
10. [Contact](#-contact)
11. [Contributors](#-contributors)

---

## 📌 Problem Statement

Managing online deliveries is often chaotic—tracking numbers are scattered across emails and SMS, leading to missed deliveries and confusion. **PackTrack** solves this with a centralized dashboard, real-time status tracking, and insightful packaging tips.

---

## 👥 Roles & Contributions  

Each team member contributed to different aspects of the project, ensuring a well-rounded and structured development process.  

| Team Member        | Responsibilities                                                                 |
|--------------------|----------------------------------------------------------------------------------|
| **All Members**    | Planning & Requirement Gathering, Class Diagram                                  |
| **Rasha Al-Saleh** | Problem Statement, Business Case, Scope & Goals, UI Mockups, System Architecture |
| **Sdra Awameh**    | SDLC Model, Gantt Chart                                        |
| **Dalaa Saqer**    | Functional Requirements, System Use Case Diagram               |

---

## 🛠 Tech Stack

| Layer          | Technologies                    |
|----------------|---------------------------------|
| Frontend       | HTML, CSS, JavaScript           |
| Backend        | PHP                             |
| Database       | MySQL                           |
| Authentication | JWT Tokens                      |
| DevOps         | GitHub Actions, Docker          |
| APIs Used      | Quotable API                    |

---

## 🔥 Core Features

### User Features

- **JWT-secured User Registration & Login**
- **Dashboard** to manage deliveries
- **Add New Deliveries** (Courier, Tracking Number, Item Title, Expected Delivery Date)
- **View / Filter / Search / Sort** deliveries
- **Delivery Status Auto-Tracking** via Public API
- **Eco-friendly packaging tips**
- **Random Motivational Quotes**
<!-- - **Export Delivery Logs as PDF** -->

### Admin Features

- **Admin Dashboard** for managing users & logs
- **Manually / Automatically Update Delivery Status**
- **User Management (Add/Remove Users)**
<!-- - **Generate Reports (Export as PDF)** -->

### Add-on Dashboard Charts
- **Delivery Status Summary**
- **Monthly Delivery Trends**
- **Top Couriers Used**

---

## 📂 Project Structure

```bash
PackTrack/ 
├── .github/ 
│   └── workflows/ 
│       └── ci-cd.yml 
├── app/ 
│   ├── api/
│   │   ├── admin/
│   │   │   ├── charts/
│   │   │   │   ├── categories.php
│   │   │   │   ├── delivery-overview.php
│   │   │   │   ├── delivery-trends.php
│   │   │   │   └── status-by-time.php
│   │   │   ├── admin-stats.php
│   │   │   └── users-activity.php
│   │   ├── dashboard/
│   │   │   ├── charts/
│   │   │   │   ├── package-activity.php
│   │   │   │   └── package-status.php
│   │   │   └── dashboard-stats.php
│   │   ├── random/
│   │   │   └── quotes.json
│   │   ├── check-access.php
│   │   └── protectedRoute.php
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   ├── register.php
│   │   └── TokenValidator.php
│   ├── connection/ 
│   │   └── db-conn.php
│   ├── Core/
│   │   ├── jwt/
│   │   │   └── JwtHandler.php
│   │   └── middlewares/
│   │       └── authMiddleware.php
│   ├── data/
│   │   ├── MOCK_Deliveries_DATA.csv
│   │   ├── MOCK_Users_DATA.csv
│   │   └── PackTrackDB_users.sql
│   ├── handlers/
│   │   └── add-package.php
│   ├── helpers/
│   │   └── response.php
│   └── composer.json
├── docker/ 
│   └── Dockerfile
├── Documents/
│   ├── images/
│   │   ├── Diagrams/
│   │   └── UI/
│   └── references/
├── public
│   ├── assets/ 
│   │   ├── css/  
│   │   │   └── style.css
│   │   └── js/ 
│   │       ├── shared/
│   │       │   ├── auth.js
│   │       │   ├── backend-conn.js
│   │       │   ├── notification.js
│   │       │   ├── quotes.js
│   │       │   ├── script.js
│   │       │   └── style-switcher.js
│   │       ├── admin.js
│   │       └── dashboard.js
│   └── views/
│       ├── errors/
│       │   ├── 403.html
│       │   ├── 404.html
│       │   └── 500.html
│       ├── shared/
│       │   ├── add-package-modal.html
│       │   ├── add-package-modal.js
│       │   ├── loading.html
│       │   ├── maintenance.html
│       │   ├──sidebar.html
│       │   └── sidebar.js
│       ├── admin-panel.html 
│       ├── dashboard.html 
│       └── index.html
├── scripts/
│   ├── insert_deliveries_data.py
│   └── insert_users_data.py
├── .env
├── .htaccess
├── docker-compose.yml 
├── LICENSE
└── README.md
 ```

---

## 📸 User Interface

This section provides a visual overview of PackTrack’s user interface. Each screen has been designed to be clean, responsive, and highly functional with a modern dashboard layout that ensures great UX and security.

---

### Figure 1: Login Form (JWT-Based Authentication)
<p align="left">
  <img src="documents/images/UI/Login.png" alt="Login Form" width="1000"/>
</p>

A sleek, minimalist login screen for both Users and Admins.  
- **Security:** Secured using JWT-based authentication.  
- **UX:** Simple form with real-time validation.  
- **Access Control:** Redirects based on user roles after login.

---

### Figure 2: Registration Form with Role-Based Access
<p align="left">
  <img src="documents/images/UI/Register.png" alt="Registration Form" width="1000"/>
</p>

A role-aware signup form supporting User and Admin registration.  
- **Dynamic Fields:** Shows “Admin Secret Key” only when Admin role is selected.  
- **Access Control:** Only valid secret key holders can register as Admins.  

---

### Figure 3: User Dashboard
<p align="left">
  <img src="documents/images/UI/Dashboard.png" alt="User Dashboard" width="1000"/>
</p>

A powerful dashboard for regular users to monitor deliveries.  
- **Package Activity Chart:** Line graph tracking package trends over time.  
- **Package Status Chart:** Donut chart visualizing delivery status distribution.  
- **Add Delivery Form:** Easy input for new deliveries.  
- **Delivery Logs Table:** searchable table with delivery history.  
- **Navigation Bar:** Clean sidebar for fast access to all sections.

---

### Figure 4: Add New Package Modal  
<p align="left">
  <img src="documents/images/UI/Add Package Modal.png" alt="Add Package Modal" width="1000"/>
</p>

This modal allows users to add new delivery records in a structured, user-friendly format.  
- **Dynamic Fields:** Includes dropdowns, date pickers, and required inputs for all relevant delivery details.
- **UX Design:** Dark/light-mode compatible, responsive layout, and visually integrated into the dashboard flow.
- **Data Entry:** Supports real-time validation and direct entry of courier, route, status, dates, and package type.
- **Secure Submission:** Accessible only to authenticated users; validated through backend token checks to prevent unauthorized submission.

---

### Figure 5: Admin Panel Overview
<p align="left">
  <img src="documents/images/UI/Admin Panel.png" alt="Admin Panel Overview" width="1000"/>
</p>

Admin dashboard featuring full system oversight.  
- **Stats Overview:** Real-time system stats with trend indicators.  
- **Charts:** Visual breakdowns of delivery patterns and delays.  
- **Role-Based Access:** Restricted to Admins only.

---

### Figure 6: Admin Panel (cont) & Recent Users Activity Log
<p align="left">
  <img src="documents/images/UI/Admin Panel&Users Log.png" alt="Admin Logs" width="1000"/>
</p>

Detailed activity tracking and user management tools.  
- **Recent Logs:** Shows login timestamps and delivery changes.  
- **User List:** Track users, their status, and last activity.

---

### Figure 7: Daily Quote Widget
<p align="left">
  <img src="documents/images/UI/Daily Quote Widget.png" alt="Quote Widget" width="1000"/>
</p>

A motivational widget embedded in the dashboard.  
- **Quote APIs:** Fetches from Quotable API and custom endpoint.  
- **User Options:** Refresh, auto-update, or hide quotes.  
- **Custom Themes:** Matches delivery/logistics productivity themes.

---

### Figure 8: Forbidden Access (403)
<p align="left">
  <img src="documents/images/UI/Forbidden (403).png" alt="403 Forbidden" width="1000"/>
</p>

Access denied screen when permissions are insufficient.  
- **JWT Enforcement:** Ensures role-based access with token validation.  
- **User-Friendly Feedback:** Offers quick links to login or return to dashboard.

---

### Figure 9: Internal Server Error (500)
<p align="left">
  <img src="documents/images/UI/Internal Server Error (500).png" alt="500 Error" width="1000"/>
</p>

Graceful error screen for backend/server failures.  
- **Safe Debugging:** Hides internal server info.  
- **Recovery Options:** Prompt to reload or return to dashboard.

---

### Figure 10: Not Found (404)
<p align="left">
  <img src="documents/images/UI/Not Found (404).png" alt="404 Not Found" width="1000"/>
</p>

Displayed when users land on non-existent routes.  
- **Design Consistency:** Keeps UX polished even in error.  
- **Navigation Help:** Offers links to guide users back on track.

---

### Figure 11: Loading Animation
<p align="left">
  <img src="documents/images/UI/Loading Animation.png" alt="Loading Screen" width="1000"/>
</p>

Animated loader shown during data fetch or navigation.  
- **Dynamic Messages:** Provides status updates or tips.  
- **Reduced Friction:** Keeps users engaged during wait time.

---

> These UI components together create a seamless, modern web experience that’s both secure and intuitive for delivery tracking and management. PackTrack is built for performance, clarity, and role-aware interaction.

---

## ⚙️ Setup Instructions

### Local Setup
1. **Clone the Repository**

```bash
git clone https://github.com/rasha-2k/PackTrack.git
cd packtrack
```

2. **Copy `.env.example` and fill in credentials**

```bash
cp .env.example .env
```

> open the `.env` file and fill in the following details:
>
> - **DB credentials**: MySQL host, port, username, and password.
> - **JWT secret**
> - **Other API keys** (optional for quotes API)

3. **Database Set Up**
    - Configure your PHP/Apache local server 
    - Locate the `PackTrackDB_users.sql` file inside the `data/` folder. 
    - Import the SQL file into your local MySQL database using the following command:
```bash
mysql -u root -p PackTrackDB < data/PackTrackDB_users.sql
```
 
4. **Start Frontend**
    - Start from [index.html](http://localhost:8080/public/views/index.html) (Login Page)

### Optional: Docker Setup 

Instead of using a local server like XAMPP, use Docker for a consistent setup:

1. **Build Docker Images**: Build the `web` (backend + frontend) and `db` images using Docker Compose

```bash
docker-compose build
docker-compose up -d
```
> This will start the backend and the MySQL database on the specified ports.

2. **Verify containers are running**: Run the following command to check running containers:

```bash
docker ps
```

**Expected Output**:
- You should see at least two containers: one for the backend and one for the database.
- The STATUS column should show "Up" (e.g., Up 10 minutes).

**Example**:

```bash
CONTAINER ID   IMAGE           COMMAND                  CREATED        STATUS       PORTS                               NAMES
551eb2492fc4   packtrack-web   "docker-php-entrypoi…"   13 hours ago   Up 4 hours   0.0.0.0:8080->80/tcp                packtrack-web-1
3b25816a991f   mysql:8.0       "docker-entrypoint.s…"   13 hours ago   Up 2 hours   0.0.0.0:3306->3306/tcp, 33060/tcp   packtrack-db-1
```

3. Visit: [http://localhost:8080/public/views/index.html](http://localhost:8080/public/views/index.html)

---

## 🌍 Environment Variables
```env
DB_HOST=db
DB_PORT=3306
DB_NAME=PackTrackDB
DB_USER=root
DB_PASS=your_database_password

ADMIN_SECRET=admin_secret_key
JWT_SECRET=your_secret_jwt_key
QUOTES_API_URL=https://api.quotable.io/random
```

---

## 🚀 DevOps & CI/CD

- **Automated Build & Deployment** via GitHub Actions.
- The `.github/workflows/ci-cd.yml` file defines the CI/CD steps, including:
    - Code linting and testing.
    - Docker image builds.
    - Deploy to the server automatically when new changes are merged.

> Workflow: `.github/workflows/ci-cd.yml`

---

## 📞 Contact
> Email: [rasha.k.alsaleh@gmail.com](mailto:rasha.k.alsaleh@gmail.com) | LinkedIn: [@rasha-alsaleh](https://www.linkedin.com/in/rasha-alsaleh/) <br>
> Email: [awamasdra@gmail.com](mailto:awamasdra@gmail.com) | LinkedIn: [@sdra-awameh](https://www.linkedin.com/in/sdra-awameh-3b1391326/) <br>
> Email: [Saqerdalaa@gmail.com](mailto:Saqerdalaa@gmail.com) | LinkedIn: [@dalaa-saqer](https://www.linkedin.com/in/dalaa-saqer/)
---

## 👥 Contributors
<div style="display: flex; align-items: center; margin-bottom: 20px;">
    <a href="https://github.com/rasha-2k" style="text-decoration: none; display: flex; align-items: center;">
        <img src="https://github.com/rasha-2k.png" alt="@rasha-2k" title="@rasha-2k" width="100px" height="100px" style="border-radius: 50%; margin-right: 10px;">
    </a>
    <a href="https://github.com/Sdra-Awameh" style="text-decoration: none; display: flex; align-items: center;">
        <img src="https://github.com/Sdra-Awameh.png" alt="@awsdra" title="@awsdra" width="100px" height="100px" style="border-radius: 50%; margin-right: 10px;">
    </a>
    <a href="https://github.com/dalaasaqer" style="text-decoration: none; display: flex; align-items: center;">
        <img src="https://github.com/dalaasaqer.png" alt="@dalaasaqer" title="@dalaasaqer" width="100px" height="100px" style="border-radius: 50%; margin-right: 10px;">
    </a>
</div>
