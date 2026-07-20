const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const promoRoutes = require('./routes/promos');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/promos', promoRoutes);

// Serve static frontend assets in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventora')
  .then(async () => {
    console.log('MongoDB Connected');
    try {
      const User = require('./models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('Database empty! Auto-seeding initial admin and demo user...');
        const bcrypt = require('bcryptjs');
        const Event = require('./models/Event');
        
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('password123', salt);
        const userPass = await bcrypt.hash('password123', salt);

        const admin = await User.create({
          name: 'Admin User',
          email: 'admin@eventora.com',
          password: adminPass,
          role: 'admin',
          isVerified: true
        });

        await User.create({
          name: 'Demo User',
          email: 'user@eventora.com',
          password: userPass,
          role: 'user',
          isVerified: true
        });

        await Event.create({
          title: 'React & Node.js Developer Retreat',
          description: 'Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to take their skills to the next level.',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          location: 'Silicon Valley Innovation Center, CA',
          category: 'Technology',
          totalSeats: 200,
          availableSeats: 200,
          ticketPrice: 0,
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
          createdBy: admin._id
        });
        console.log('Auto-seed complete: Created admin@eventora.com and user@eventora.com (Password: password123)');
      }
    } catch (seedErr) {
      console.error('Auto-seed error:', seedErr.message);
    }
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

