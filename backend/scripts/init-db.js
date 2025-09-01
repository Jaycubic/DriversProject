require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  const client = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: 'driverconnect',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres'
  });

  try {
    // Read and execute schema
    const schema = fs.readFileSync(
      path.join(__dirname, '../migrations/001_initial_schema.sql'),
      'utf8'
    );
    await client.query(schema);

    // Create test data
    const saltRounds = 12;
    const testPassword = await bcrypt.hash('password123', saltRounds);

    // Insert test users
    const users = [
      {
        email: 'admin@driverconnect.com',
        password: testPassword,
        name: 'Admin User',
        role: 'admin',
        phone: '+919876543200',
        is_verified: true
      },
      {
        email: 'test@driver.com',
        password: testPassword,
        name: 'Test Driver',
        role: 'driver',
        phone: '+919876543210',
        is_verified: true
      },
      {
        email: 'test@company.com',
        password: testPassword,
        name: 'Test Company',
        role: 'company',
        phone: '+919876543220',
        is_verified: true
      }
    ];

    for (const user of users) {
      await client.query(`
        INSERT INTO users (email, password, name, role, phone, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, [user.email, user.password, user.name, user.role, user.phone, user.is_verified]);
    }

    // Insert test driver profiles
    const drivers = [
      {
        name: 'Rajesh Kumar',
        location: 'Mumbai, Maharashtra',
        experience: 12,
        vehicle_types: ['bus', 'cargo_truck', 'heavy_vehicle'],
        bio: 'Experienced professional driver with 12+ years in transportation. Specialized in long-haul cargo and passenger transport.',
        total_jobs: 152
      },
      {
        name: 'Suresh Patel',
        location: 'Pune, Maharashtra',
        experience: 8,
        vehicle_types: ['cargo_truck', 'delivery_van'],
        bio: 'Reliable driver with excellent track record in cargo transportation across Western India.',
        total_jobs: 85
      },
      {
        name: 'Amit Singh',
        location: 'Delhi',
        experience: 15,
        vehicle_types: ['bus', 'tourist_bus', 'heavy_vehicle'],
        bio: 'Senior driver with extensive experience in passenger transport and interstate travel.',
        total_jobs: 198
      }
    ];

    for (const driver of drivers) {
      // Create user
      const result = await client.query(`
        INSERT INTO users (email, password, name, role, phone, is_verified)
        VALUES ($1, $2, $3, 'driver', $4, true)
        RETURNING id
      `, [
        driver.name.toLowerCase().replace(/\s+/g, '.') + '@driver.com',
        testPassword,
        driver.name,
        '+91' + (Math.floor(Math.random() * 9000000000) + 1000000000),
      ]);

      const userId = result.rows[0].id;

      // Create driver profile
      await client.query(`
        INSERT INTO driver_profiles (
          user_id, experience, location, vehicle_types, bio,
          documents_verified, total_jobs
        )
        VALUES ($1, $2, $3, $4, $5, true, $6)
      `, [
        userId,
        driver.experience,
        driver.location,
        JSON.stringify(driver.vehicle_types),
        driver.bio,
        driver.total_jobs
      ]);
    }

    // Insert test company profile
    const companyResult = await client.query(`
      SELECT id FROM users WHERE role = 'company' LIMIT 1
    `);
    const companyUserId = companyResult.rows[0].id;

    await client.query(`
      INSERT INTO company_profiles (
        user_id, company_name, registration_number,
        subscription_tier, contact_limit, contacts_used
      )
      VALUES ($1, 'Test Transport Co', 'TC123456', 'pro', 50, 15)
    `, [companyUserId]);

    console.log('✅ Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

initializeDatabase();
