![Status](https://img.shields.io/badge/Project%20Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-Educational-blue)
<!--![Tech Stack](https://img.shields.io/badge/Tech%20Stack-PHP%20%7C%20JS%20%7C%20MySQL%20%7C%20Docker-lightgrey)-->
---

# PackTrack – Personal Delivery Log with Status Tracker and Smart Tips

> PackTrack is a lightweight web-based application that helps users organize and track their personal deliveries in one centralized platform. Designed with modern users in mind, PackTrack combines powerful delivery tracking features with smart tips and motivational quotes to make package management fun and insightful.

---

## Problem Statement

Most online shoppers manage their deliveries through fragmented sources like emails and SMS links. There’s no centralized tool tailored for personal delivery management, which leads to confusion, missed deliveries, and lack of packaging awareness.

**PackTrack** solves this by offering a streamlined delivery log dashboard, real-time status tracking, and insightful packaging tips — all while demonstrating best practices in modern software engineering.

---

## Core Features

### User Features
- JWT-based secure **User Registration & Login**
- Personal **Dashboard** to manage delivery logs
- **Add New Deliveries**: Courier, Tracking Number, Item Title, Expected Delivery Date
- **View / Filter / Search / Sort** delivery logs
- **Delivery Status Auto-Tracking** via Public Courier Tracking API
- Smart Packaging & Delivery **Tips Section**
- **Random Quote Integration** (via Quotable API)
- **PDF Export** for Delivery Records

### Admin Features
- Admin Dashboard for managing all users and logs
- **Update Delivery Status** manually or automatically
- **User Management** (Add/Remove Users)
- **Report Generation** (Export as PDF)

### Add-on Dashboard Charts
- Delivery Status Summary
- Monthly Delivery Trends
- Top Couriers Used
> Charts are added for better data visualization and user engagement.

---

## Tech Stack

| Layer          | Technologies                      |
|----------------|-----------------------------------|
| Frontend       | HTML, CSS, JavaScript             |
| Backend        | PHP (REST APIs)                   |
| Database       | MySQL / PostgreSQL                |
| Authentication | JWT Tokens                        |
| DevOps         | GitHub Actions, Docker (Advanced) |
| APIs Used      | TrackingMore API, Quotable API    |

---

## API References

- **TrackingMore API** (Real-time package tracking): [https://www.trackingmore.com/](https://www.trackingmore.com/)
- **Quotable API** (Random quotes): [https://api.quotable.io/random](https://api.quotable.io/random)

---

## Project Structure
 ```bash
PackTrack/ 
├── docs/
├── backend/ 
│   ├── api/ 
│   │   └── protectedRoute.php
│   ├── auth/
│   │   ├── login.php
│   │   ├── register.php
│   │   └── validateToken.php
│   ├── controllers/ 
│   ├── db/ 
│   │   └── db.php
│   ├── helpers/
│   │   └── response.php
│   ├── jwt/
│   │   └── JwtHandler.php
│   └── test/
│       └── responseTest.php
├── frontend/ 
│   ├── assets/ 
│   │   ├── css/  
│   │   └── js/ 
│   ├── index.html 
│   ├── dashboard.html 
│   └── admin-panel.html 
├── docker/ 
├── .env.example
├── .github/ 
│   └── workflows/ 
│       └── ci-cd.yml 
├── docker-compose.yml 
├── Dockerfile  
├── LICENSE/ 
└── README.md
 ```
<!--
# ├── docs/ 
# │   ├── SDLC_Model.pdf 
# │   ├── Use_Case_Diagram.png 
# │   ├── Gantt_Chart.pdf 
# │   └── Project_Plan.pdf -->

---

## Setup Instructions

### Local Setup
1. **Clone the Repository**
```bash
git clone https://github.com/your-username/packtrack.git
cd packtrack
```
2. **Copy `.env.example` and fill in credentials**
```bash
cp .env.example .env
```
> Fill in your database credentials, JWT secret, and API keys.
3. **Run Backend Server**
    - Configure your Apache or PHP local server (XAMPP, Laragon, etc.)
    - Import `packtrackdb.sql` to your database  
4. Open Frontend
    - Start from `index.html` (Login Page)
5. **Optional: Docker Deployment**
```bash
docker build -t packtrack-app .
docker run -p 8000:80 packtrack-app
```

---

## Environment Variables
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=packtrackdb
DB_USER=your_db_user
DB_PASS=your_db_password

JWT_SECRET=your_secret_key

TRACKING_API_KEY=your_trackingmore_api_key
QUOTES_API_URL=https://api.quotable.io/random
```
---
## DevOps & CI/CD
PackTrack includes GitHub Actions workflow for Continuous Integration and Deployment:
- Code Linting & Testing
- Auto Deployment (Optional)
- Docker Support for Containerized Environments
> Workflow: `.github/workflows/ci-cd.yml`

---

<!-- ---

## 📸 Screenshots 

> ✅ UI Mockups  
> ✅ User Dashboard  
> ✅ Admin Panel  
> ✅ API Responses  
> ✅ PDF Export Example -->

## Future Enhancements

- Interactive Dashboard Charts:
    - Delivery status pie chart
    - Monthly delivery trends line chart
    - Top couriers usage bar chart
- Mobile App for native experience
- User Notification System for status updates

---

## Contact
> Website: [rashaalsaleh.com](https://rashaalsaleh.com) | Email: [rasha.k.alsaleh@gmail.com](mailto:rasha.k.alsaleh@gmail.com) | LinkedIn: [@rasha-alsaleh](https://www.linkedin.com/in/rasha-alsaleh/)

---

## Contributors
<div style="display: flex; align-items: center; margin-bottom: 20px;">
    <a href="https://github.com/rasha-2k" style="text-decoration: none; display: flex; align-items: center;">
        <img src="https://github.com/rasha-2k.png" alt="@rasha-2k" title="@rasha-2k" width="100px" height="100px" style="border-radius: 50%; margin-right: 10px;">
    </a>
    <a href="https://github.com/awsdra" style="text-decoration: none; display: flex; align-items: center;">
        <img src="https://github.com/awsdra.png" alt="@awsdra" title="@awsdra" width="100px" height="100px" style="border-radius: 50%; margin-right: 10px;">
    </a>
    <a href="https://github.com/dalaasaqer" style="text-decoration: none; display: flex; align-items: center;">
        <img src="https://github.com/dalaasaqer.png" alt="@dalaasaqer" title="@dalaasaqer" width="100px" height="100px" style="border-radius: 50%; margin-right: 10px;">
    </a>
</div>
