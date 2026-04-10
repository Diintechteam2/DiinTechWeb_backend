const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');
const projectRoutes = require('./routes/projectRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const industryRoutes = require('./routes/industryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const siteContentRoutes = require('./routes/siteContentRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/hero', heroRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/solutions', solutionRoutes);
app.use('/api/v1/industries', industryRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/site-content', siteContentRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DiinTech API is running...'
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
