# 🏨 Hotel Booking System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for hotel booking management with separate user and admin dashboards.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Default Admin Credentials](#default-admin-credentials)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- **User Registration & Authentication** - Secure signup/login with JWT
- **Hotel Search & Browse** - View available hotels with filters
- **Hotel Details** - Detailed hotel information with images and amenities
- **Room Booking** - Book rooms with date selection
- **User Dashboard** - Manage profile and view booking history
- **Booking Management** - View, modify, and cancel bookings

### Admin Features
- **Admin Dashboard** - Comprehensive statistics and analytics
- **Hotel Management** - Add, edit, and delete hotels
- **Room Management** - Manage room types, pricing, and availability
- **User Management** - View and manage registered users
- **Booking Management** - Monitor all bookings across the platform
- **Admin Authentication** - Secure admin login system

## 🛠 Tech Stack

### Frontend
- **React.js 19.1.1** - UI library
- **Material-UI (MUI) 7.2.0** - Component library
- **Redux Toolkit 2.8.2** - State management
- **React Router DOM 7.7.1** - Client-side routing
- **Axios 1.11.0** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 7.5.0** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs 2.4.3** - Password hashing
- **Multer 1.4.5** - File upload handling

### Security & Middleware
- **Helmet 7.0.0** - Security headers
- **CORS 2.8.5** - Cross-origin resource sharing
- **Express Rate Limit 6.10.0** - Rate limiting
- **Express Validator 7.0.1** - Input validation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd hotel-booking-system
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Setup MongoDB

#### Option A: Local MongoDB Installation
1. Install MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (using Homebrew)
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace the `MONGODB_URI` in the environment variables

### Step 5: Environment Variables Setup

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env  # On Windows: type nul > .env
```

Add the following environment variables to `.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure_for_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important:** 
- Replace `JWT_SECRET` with a strong, unique secret key for production
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string

## 🏃‍♂️ Running the Application

### Method 1: Run Both Servers Simultaneously

#### Terminal 1 - Backend Server
```bash
cd backend
npm start
```
The backend server will run on `http://localhost:5001`

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm start
```
The frontend application will run on `http://localhost:3000`

### Method 2: Development Mode (with auto-reload)

#### Backend (with nodemon)
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm start
```

## 🔑 Default Admin Credentials

The application automatically creates a default admin account on first run:

- **Email:** `admin@mybook.com`
- **Password:** `admin123`

**Access Admin Dashboard:** `http://localhost:3000/admin/login`

## 📊 Sample Data

The application automatically seeds the database with sample data including:
- **2 Hotels** (Grand Palace Hotel, Seaside Resort)
- **6 Rooms** (3 rooms per hotel)
- **1 Regular User** for testing
- **1 Admin User**

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels` - Create hotel (Admin only)
- `PUT /api/hotels/:id` - Update hotel (Admin only)
- `DELETE /api/hotels/:id` - Delete hotel (Admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (Admin only)
- `GET /api/bookings/user` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin only)

## 📁 Project Structure

```
hotel-booking-system/
├── backend/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   └── dbInit.js           # Database initialization & seeding
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── Hotel.js            # Hotel model
│   │   ├── Room.js             # Room model
│   │   └── Booking.js          # Booking model
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication routes
│   │   ├── hotelRoutes.js      # Hotel routes
│   │   ├── bookingRoutes.js    # Booking routes
│   │   └── userRoutes.js       # User routes
│   ├── services/
│   │   ├── authService.js      # Authentication logic
│   │   ├── hotelService.js     # Hotel business logic
│   │   └── bookingService.js   # Booking business logic
│   ├── .env                    # Environment variables
│   ├── package.json            # Backend dependencies
│   └── server.js               # Entry point
├── frontend/
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin components
│   │   │   └── common/         # Shared components
│   │   ├── pages/
│   │   │   ├── HomePage.js     # Landing page
│   │   │   ├── LoginPage.js    # User login
│   │   │   ├── SignupPage.js   # User registration
│   │   │   ├── UserDashboard.js # User dashboard
│   │   │   ├── AdminLoginPage.js # Admin login
│   │   │   └── AdminDashboard.js # Admin dashboard
│   │   ├── services/
│   │   │   ├── api.js          # API configuration
│   │   │   └── dashboardService.js # Dashboard services
│   │   ├── store/
│   │   │   └── authSlice.js    # Redux auth state
│   │   ├── App.js              # Main app component
│   │   └── index.js            # Entry point
│   └── package.json            # Frontend dependencies
└── README.md                   # This file
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution:** Make sure MongoDB is running locally or check your Atlas connection string.

2. **Port Already in Use**
   ```bash
   Error: listen EADDRINUSE :::5001
   ```
   **Solution:** Kill the process using the port or change the PORT in `.env`

3. **JWT Secret Error**
   ```bash
   Error: secretOrPrivateKey has a value
   ```
   **Solution:** Make sure `JWT_SECRET` is set in your `.env` file

4. **CORS Error**
   ```bash
   Access to XMLHttpRequest blocked by CORS policy
   ```
   **Solution:** Ensure both frontend and backend servers are running

### Reset Database
To reset the database and reseed with sample data:
```bash
# Connect to MongoDB
mongo
# Drop the database
use hotel-booking
db.dropDatabase()
# Restart the backend server to reseed
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jobayer Hasan Rifat**

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- MongoDB for the flexible database solution
- The React and Node.js communities for excellent documentation

---

**Happy Coding! 🚀**

For any questions or issues, please create an issue in the repository or contact the author.
