const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const { User } = require('./models');
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidates');
const voteRoutes = require('./routes/votes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Unable to connect to the database:', err));

async function seedAdmin() {
  try {
    const existing = await User.findOne({ where: { email: 'admin@votingapp.com' } });
    if (!existing) {
      await User.create({
        username: 'admin',
        email: 'admin@votingapp.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Default admin user created: admin@votingapp.com / admin123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err);
  }
}

// Sync database and seed default admin
sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log('Database synced');
    await seedAdmin();
  })
  .catch((err) => console.error('Error syncing database:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Blockchain Voting API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
