# 🚗 Ride Booking API

A comprehensive backend API for a ride booking system built with Node.js, Express.js, TypeScript, and MongoDB. This system supports riders, drivers, and administrators with complete ride management functionality.

## 🚀 Features

- **Multi-Role Authentication**: Admin, Rider, and Driver roles
- **Complete Ride Management**: Request, accept, track, and complete rides
- **Driver Management**: Registration, approval, and status tracking
- **Admin Dashboard**: User management, system statistics, and oversight
- **Real-time Updates**: Ride status tracking and location updates
- **Secure Authentication**: JWT-based authentication with refresh tokens

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Security**: CORS, Input validation

## 🏗️ System Architecture

### User Roles
- **Admin**: System management and oversight
- **Rider**: Request and manage rides
- **Driver**: Accept rides and provide transportation services

### Ride Workflow
```
Rider (Request Ride) → Driver (Check Available Rides) → Driver (Accept Ride) 
→ Driver (Update to picked_up) → Driver (Update to in-transit) → Driver (Complete Ride)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ride-booking-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create `.env` file:
```env
NODE_ENV=development
PORT=5002
DATABASE_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
BCRYPT_SALT_ROUNDS=12
```

4. **Start the server**
```bash
npm run dev
```

Server will run on `http://localhost:5002`

## 🔐 Test Accounts

### Admin Accounts
| Email | Password |
|-------|----------|
| super@gmail.com | Admin@1234 |
| admin@gmail.com | Admin@1234 |

## 📚 API Documentation

### Base URL
```
http://localhost:5002/api/v1
```

---

## 👤 User Management

### User Registration & Profile
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/user/register` | Register new user | Public |
| GET | `/user/profile` | Get user profile | Authenticated |
| GET | `/user/${id}` | Get user by ID | Admin |

**Registration Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "rider" // or "driver"
}
```

---

## 🔐 Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/logout` | User logout | Authenticated |
| POST | `/auth/reset-password` | Reset user password | Public |
| POST | `/auth/refresh-token` | Refresh access token | Public |

**Login Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "rider"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

---

## 👨‍💼 Admin Management

### Driver Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| PATCH | `/user/${driverId}/approve` | Approve/suspend driver | Admin |
| PATCH | `/user/${userId}/status` | Block/unblock user | Admin |
| GET | `/user/drivers` | Get all drivers | Admin |

**Driver Approval Request:**
```json
{
  "status": "approved" // or "suspended"
}
```

**User Status Update Request:**
```json
{
  "status": "active" // or "blocked"
}
```

### System Analytics
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/user/stats` | Get system statistics | Admin |
| GET | `/user/rides` | Get all rides | Admin |
| GET | `/user/all-users` | Get all users | Admin |

**Stats Response Example:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalDrivers": 45,
    "totalRides": 320,
    "activeRides": 12,
    "completedRides": 280
  }
}
```

---

## 🚗 Driver Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/driver/register` | Register as driver | Driver |
| PATCH | `/driver/status` | Update driver status | Driver |
| GET | `/driver/earnings` | Get driver earnings | Driver |
| PATCH | `/driver/location` | Update driver location | Driver |
| GET | `/driver/rides` | Get driver's rides | Driver |

### Driver Registration
**Request Body:**
```json
{
  "licenseNumber": "DL123456789",
  "vehicleInfo": {
    "type": "Sedan",
    "model": "Toyota Camry 2020",
    "plateNumber": "ABC-1234",
    "color": "White"
  }
}
```

### Driver Status Update
**Request Body:**
```json
{
  "isOnline": true, // true for online, false for offline
  "status": "available" // available, busy, offline
}
```

### Location Update
**Request Body:**
```json
{
  "location": {
    "lat": 23.8103,
    "lng": 90.4125,
    "address": "Dhaka, Bangladesh"
  }
}
```

**Earnings Response:**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 2500.50,
    "todayEarnings": 180.00,
    "totalRides": 45,
    "completedRides": 42,
    "rating": 4.8
  }
}
```

---

## 🚕 Ride Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/rides/request` | Request a ride | Rider |
| GET | `/rides/available` | Get available rides | Driver |
| PATCH | `/rides/${rideId}/status` | Accept/Update ride status | Driver |
| PATCH | `/rides/${rideId}/cancel` | Cancel ride | Rider/Driver |

### Ride Request (Rider)
**Request Body:**
```json
{
  "pickup": {
    "address": "Dhaka University, Dhaka",
    "coordinates": {
      "lat": 23.7356,
      "lng": 90.3918
    }
  },
  "destination": {
    "address": "Shahbag Square, Dhaka", 
    "coordinates": {
      "lat": 23.7389,
      "lng": 90.3944
    }
  },
  "rideType": "economy", // economy, premium
  "scheduledTime": "2025-08-01T14:30:00Z" // optional for scheduled rides
}
```

### Ride Status Updates (Driver)

**Accept Ride:**
```json
{
  "status": "accepted"
}
```

**Update to Picked Up:**
```json
{
  "status": "picked_up"
}
```

**Update to In Transit:**
```json
{
  "status": "in_transit"
}
```

**Complete Ride:**
```json
{
  "status": "completed",
  "completionNotes": "Ride completed successfully"
}
```

### Ride Status Flow
```
requested → accepted → picked_up → in_transit → completed
    ↓           ↓           ↓
cancelled   cancelled   cancelled
```

### Available Rides Response (Driver)
```json
{
  "success": true,
  "data": [
    {
      "rideId": "ride_id_123",
      "rider": {
        "name": "John Doe",
        "phone": "+1234567890",
        "rating": 4.5
      },
      "pickup": {
        "address": "Dhaka University",
        "coordinates": { "lat": 23.7356, "lng": 90.3918 }
      },
      "destination": {
        "address": "Shahbag Square",
        "coordinates": { "lat": 23.7389, "lng": 90.3944 }
      },
      "estimatedFare": 120.00,
      "distance": "2.5 km",
      "requestedAt": "2025-08-01T10:30:00Z"
    }
  ]
}
```

### Cancel Ride
**Request Body:**
```json
{
  "reason": "Change of plans", // Required
  "cancelledBy": "rider" // rider or driver
}
```

---

## 🔒 Authentication Headers

For protected routes, include the JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

**Example using curl:**
```bash
curl -H "Authorization: Bearer your_jwt_token" \
     -H "Content-Type: application/json" \
     http://localhost:5002/api/v1/user/profile
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

---

## 🧪 Testing with Postman

### 1. **Setup Environment Variables**
- `baseUrl`: `http://localhost:5002/api/v1`
- `accessToken`: (will be set after login)

### 2. **Authentication Flow**
1. Register a new user
2. Login to get access token
3. Use token for protected routes

### 3. **Complete Ride Flow Test**
1. **Rider**: Request a ride using `/rides/request`
2. **Driver**: Check available rides using `/rides/available`
3. **Driver**: Accept ride using `/rides/{rideId}/status` with `"status": "accepted"`
4. **Driver**: Update to picked up: `"status": "picked_up"`
5. **Driver**: Update to in transit: `"status": "in_transit"`
6. **Driver**: Complete ride: `"status": "completed"`

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5002` |
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/ride-booking` |
| `JWT_ACCESS_SECRET` | JWT access token secret | `your-secret-key` |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | `your-refresh-secret` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `12` |

---

## 📱 Mobile App Integration

This API is designed to work seamlessly with mobile applications:

- **RESTful endpoints** for easy integration
- **JWT authentication** for secure mobile sessions
- **Real-time status updates** for live tracking
- **Location-based services** for driver-rider matching
- **Push notification ready** (endpoints provide necessary data)

---

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=5002
DATABASE_URL=your_production_mongodb_url
JWT_ACCESS_SECRET=your_production_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
```

### Build and Deploy
```bash
npm run build
npm start
```

---

## 📞 Support

For questions and support:
- Check the API responses for detailed error messages
- Ensure proper authentication headers
- Verify request body formats match documentation
- Check server logs for debugging information

---

## 📝 License

This project is licensed under the MIT License.

---

**🎯 Built with ❤️ for modern ride booking solutions**