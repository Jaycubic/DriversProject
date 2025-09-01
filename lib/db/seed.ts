import { db } from './index';
import { users, driverProfiles, companyProfiles, reviews, jobs } from './schema';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create driver user
    const [driverUser] = await db.insert(users).values({
      email: 'test@driver.com',
      password: hashedPassword,
      name: 'Rajesh Kumar',
      role: 'driver',
      phone: '+91 9876543210',
      isVerified: true,
    }).returning();

    // Create driver profile
    const [driverProfile] = await db.insert(driverProfiles).values({
      userId: driverUser.id,
      licenseNumber: 'MH12-20230001',
      experience: 12,
      location: 'Mumbai, Maharashtra',
      state: 'Maharashtra',
      city: 'Mumbai',
      rating: 4.8,
      totalReviews: 45,
      totalJobs: 156,
      completedJobs: 152,
      isAvailable: true,
      vehicleTypes: ['Bus', 'Cargo Truck', 'Heavy Vehicle'],
      documents: {
        drivingLicense: { status: 'verified', uploadedAt: new Date() },
        aadhaar: { status: 'pending', uploadedAt: new Date() },
        pan: { status: 'pending', uploadedAt: new Date() },
        backgroundCheck: { status: 'not_started' }
      },
      bio: 'Experienced professional driver with 12+ years in transportation. Specialized in long-haul cargo and passenger transport.',
    }).returning();

    // Create company user
    const [companyUser] = await db.insert(users).values({
      email: 'test@company.com',
      password: hashedPassword,
      name: 'ABC Transport Solutions',
      role: 'company',
      phone: '+91 9876543211',
      isVerified: true,
    }).returning();

    // Create company profile
    const [companyProfile] = await db.insert(companyProfiles).values({
      userId: companyUser.id,
      companyName: 'ABC Transport Solutions',
      registrationNumber: 'CIN-U60200MH2020PTC123456',
      address: '123 Transport Hub, Andheri East, Mumbai, Maharashtra 400069',
      city: 'Mumbai',
      state: 'Maharashtra',
      website: 'https://abctransport.com',
      description: 'Leading transportation company providing reliable logistics solutions across India.',
      subscriptionTier: 'pro',
      contactsUsed: 15,
      contactsLimit: 50,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }).returning();

    // Create admin user
    await db.insert(users).values({
      email: 'admin@driverconnect.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      isVerified: true,
    });

    // Create sample jobs
    await db.insert(jobs).values([
      {
        companyId: companyProfile.id,
        title: 'Long Haul Cargo Driver - Mumbai to Delhi',
        description: 'Transport cargo from Mumbai to Delhi. 2-day trip with overnight stay.',
        vehicleType: 'Cargo Truck',
        route: 'Mumbai → Nashik → Indore → Gwalior → Delhi',
        fromLocation: 'Mumbai, Maharashtra',
        toLocation: 'Delhi',
        salary: 25000,
        duration: '2 days',
        requirements: {
          experience: 5,
          vehicleTypes: ['Cargo Truck', 'Heavy Vehicle'],
          license: 'Heavy Vehicle License Required'
        },
        status: 'open',
      },
      {
        companyId: companyProfile.id,
        title: 'Bus Driver - Mumbai Local Routes',
        description: 'Drive passenger bus on Mumbai local routes. Daily shifts available.',
        vehicleType: 'Bus',
        route: 'Mumbai Local Routes',
        fromLocation: 'Mumbai, Maharashtra',
        toLocation: 'Mumbai, Maharashtra',
        salary: 35000,
        duration: 'Monthly',
        requirements: {
          experience: 3,
          vehicleTypes: ['Bus'],
          license: 'Commercial Driving License'
        },
        status: 'open',
      }
    ]);

    // Create sample reviews
    await db.insert(reviews).values([
      {
        driverId: driverProfile.id,
        companyId: companyProfile.id,
        rating: 5,
        comment: 'Excellent driver! Very professional and punctual. Delivered cargo safely and on time.',
      },
      {
        driverId: driverProfile.id,
        companyId: companyProfile.id,
        rating: 5,
        comment: 'Highly recommended. Great communication throughout the journey.',
      },
      {
        driverId: driverProfile.id,
        companyId: companyProfile.id,
        rating: 4,
        comment: 'Good driver, completed the job successfully. Minor delay due to traffic.',
      }
    ]);

    console.log('Database seeding completed successfully!');
    console.log('Test accounts created:');
    console.log('Driver: test@driver.com / password123');
    console.log('Company: test@company.com / password123');
    console.log('Admin: admin@driverconnect.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('Seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}
