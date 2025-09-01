require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: 'driverconnect',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all drivers
app.get('/drivers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.*, 
        u.name, 
        u.email, 
        u.phone,
        (
          SELECT ROUND(AVG(rating)::numeric, 1)
          FROM reviews r
          WHERE r.driver_id = d.id
        ) as rating,
        (
          SELECT COUNT(*)
          FROM reviews r
          WHERE r.driver_id = d.id
        ) as review_count
      FROM driver_profiles d
      JOIN users u ON d.user_id = u.id
      WHERE u.deleted_at IS NULL
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get driver by ID
app.get('/drivers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        d.*, 
        u.name, 
        u.email, 
        u.phone,
        (
          SELECT ROUND(AVG(rating)::numeric, 1)
          FROM reviews r
          WHERE r.driver_id = d.id
        ) as rating,
        (
          SELECT COUNT(*)
          FROM reviews r
          WHERE r.driver_id = d.id
        ) as review_count
      FROM driver_profiles d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = $1 AND u.deleted_at IS NULL
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get company profile
app.get('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        c.*, 
        u.name, 
        u.email, 
        u.phone
      FROM company_profiles c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1 AND u.deleted_at IS NULL
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');
    pool.end(() => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
});
