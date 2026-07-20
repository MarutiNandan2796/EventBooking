# Eventora - Premium Full-Stack Event Booking Platform 🎟️

Eventora is a modern, feature-rich MERN stack application designed for seamless event discovery, interactive seat reservation, promo code management, and automated booking approvals. It features an intuitive dark-mode glassmorphism UI, real-time seating charts, and a powerful Admin Control Panel with business revenue analytics.

---

## ✨ Key Features

### 👤 User Features
- **Instant 1-Click Seat Reservation**: Browse upcoming events, pick specific seats from an interactive visual seating layout (Row A-J, Seats 1-10), and reserve instantly.
- **Dynamic Seating Matrix**: Real-time visual indicator for seat availability (`Available`, `Selected`, `Pending Approval`, `Confirmed Reserved`).
- **Promo Code & Discount Engine**: Apply flat amount (₹) or percentage (%) discount codes (e.g., `WELCOME100`, `FESTIVAL20`) with dynamic checkout price recalculation.
- **Attendee Reviews & Star Ratings**: Verified attendees can submit star ratings and detailed reviews for past events.
- **User Dashboard**: Track personal booking statuses (`Pending`, `Confirmed`, `Cancelled`) and manage ticket cancellations in real-time.
- **Debounced Search & Calendar View**: Filter events by keyword or toggle between Grid View and Calendar Month View.

### 👑 Admin Control Panel
- **Real-Time Revenue Analytics**: Live dashboard metrics for `Total Revenue (₹)`, `Paid Clients`, and `Pending Requests`.
- **Event Management**: Create, edit, and delete events with custom image URLs, categories, locations, dates, and seating capacities.
- **Live Seating Chart Inspector**: Inspect real-time seating layouts for any published event to monitor seat occupancy.
- **Promo Code Generator**: Generate and manage discount codes with custom expiration dates and discount types.
- **Booking Approval Workflow**: Approve incoming booking requests as `Paid` or `Not Paid`, or reject requests to release seats back into availability.

---

## 🛠️ Tech Stack & Technologies Used

### Frontend
- **Framework**: React 18 (with Vite 5)
- **Styling**: Vanilla CSS, Tailwind CSS (Glassmorphism & Micro-animations)
- **Icons**: React Icons (`fa` set)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with JWT Interceptors & Dynamic BaseURL)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas & Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS password hashing
- **Email Service**: Nodemailer (Non-blocking background email notifications with fast SMTP timeouts)

---

## 📁 Project Structure

```text
eventpro/
├── client/                     # React Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Chatbot, Seating Grid
│   │   ├── context/            # AuthContext (JWT & User state)
│   │   ├── pages/              # Home, EventDetail, Login, Register, UserDashboard, AdminDashboard
│   │   └── utils/              # Axios instance configuration
│   └── package.json
├── server/                     # Node.js Express Backend
│   ├── controllers/            # authController, eventController, bookingController, reviewController, promoController
│   ├── middleware/             # auth.js (JWT verification middleware)
│   ├── models/                 # User, Event, Booking, Review, PromoCode, OTP
│   ├── routes/                 # Express route handlers
│   ├── utils/                  # Nodemailer helper
│   ├── seed.js                 # Database seed script for dummy data
│   ├── server.js               # Main Express app entry & static production server
│   └── package.json
├── README.md
└── package.json                # Root scripts for single-service execution
```

---

## ⚡ Default Demo Credentials

When the database is freshly initialized, default accounts are automatically seeded:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@eventora.com` | `password123` | Full Admin Control Panel (`/admin`) |
| **User** | `user@eventora.com` | `password123` | User Booking Dashboard (`/dashboard`) |

---

## 🚀 Environment Variables Setup

Create a `.env` file in the `server/` directory:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=supersecretjwtkey_eventora

# Optional Gmail Nodemailer Config
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_digit_app_password
```

---

## 💻 Local Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/MarutiNandan2796/EventBooking.git
   cd eventpro
   ```

2. **Install Dependencies for Root, Client, & Server:**
   ```bash
   npm run install:all
   ```

3. **Start Development Servers (Single Command):**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 🌐 Production Deployment (Render)

This repository is optimized for **Single Web Service Deployment** on [Render.com](https://render.com):

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- Express serves both `/api/*` endpoints and the Vite production React static files from `client/dist` on a single unified URL.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
