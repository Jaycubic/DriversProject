import { db } from './index';
import { users, driverProfiles, companyProfiles, reviews, jobs, contactHistory, notifications } from './schema';
import { eq, and, desc, sql, count } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// User Authentication Services
export class AuthService {
  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: 'driver' | 'company' | 'admin';
    phone?: string;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [user] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
    }).returning();

    // Create profile based on role
    if (userData.role === 'driver') {
      await db.insert(driverProfiles).values({
        userId: user.id,
        location: '',
        state: '',
        city: '',
        vehicleTypes: [],
        documents: {},
      });
    } else if (userData.role === 'company') {
      await db.insert(companyProfiles).values({
        userId: user.id,
        companyName: userData.name,
      });
    }

    return user;
  }

  static async authenticateUser(email: string, password: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        driverProfile: true,
        companyProfile: true,
      },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return null;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getUserById(id: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        driverProfile: true,
        companyProfile: true,
      },
    });
  }
}

// Driver Services
export class DriverService {
  static async getDriverProfile(userId: string) {
    return await db.query.driverProfiles.findFirst({
      where: eq(driverProfiles.userId, userId),
      with: {
        user: true,
        reviews: {
          with: {
            company: {
              with: {
                user: true,
              },
            },
          },
          orderBy: [desc(reviews.createdAt)],
          limit: 10,
        },
      },
    });
  }

  static async updateDriverProfile(userId: string, profileData: Partial<{
    licenseNumber: string;
    experience: number;
    location: string;
    state: string;
    city: string;
    vehicleTypes: string[];
    bio: string;
    isAvailable: boolean;
  }>) {
    return await db.update(driverProfiles)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(driverProfiles.userId, userId))
      .returning();
  }

  static async searchDrivers(filters: {
    state?: string;
    city?: string;
    vehicleType?: string;
    experience?: number;
    isAvailable?: boolean;
    rating?: number;
  }) {
    let query = db.query.driverProfiles.findMany({
      with: {
        user: true,
      },
      orderBy: [desc(driverProfiles.rating)],
    });

    // Apply filters (simplified - in production, use proper query building)
    return await query;
  }

  static async getDriverStats(userId: string) {
    const profile = await db.query.driverProfiles.findFirst({
      where: eq(driverProfiles.userId, userId),
    });

    const reviewCount = await db.select({ count: count() })
      .from(reviews)
      .where(eq(reviews.driverId, profile?.id || ''));

    return {
      rating: profile?.rating || 0,
      totalReviews: reviewCount[0]?.count || 0,
      totalJobs: profile?.totalJobs || 0,
      completedJobs: profile?.completedJobs || 0,
      isAvailable: profile?.isAvailable || false,
    };
  }
}

// Company Services
export class CompanyService {
  static async getCompanyProfile(userId: string) {
    return await db.query.companyProfiles.findFirst({
      where: eq(companyProfiles.userId, userId),
      with: {
        user: true,
        jobs: {
          orderBy: [desc(jobs.createdAt)],
          limit: 10,
        },
      },
    });
  }

  static async updateCompanyProfile(userId: string, profileData: Partial<{
    companyName: string;
    registrationNumber: string;
    address: string;
    city: string;
    state: string;
    website: string;
    description: string;
  }>) {
    return await db.update(companyProfiles)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(companyProfiles.userId, userId))
      .returning();
  }

  static async getSubscriptionInfo(userId: string) {
    const profile = await db.query.companyProfiles.findFirst({
      where: eq(companyProfiles.userId, userId),
    });

    return {
      tier: profile?.subscriptionTier || 'free',
      contactsUsed: profile?.contactsUsed || 0,
      contactsLimit: profile?.contactsLimit || 10,
      expiresAt: profile?.subscriptionExpiresAt,
    };
  }

  static async recordContact(companyUserId: string, driverId: string, contactType: string) {
    const companyProfile = await db.query.companyProfiles.findFirst({
      where: eq(companyProfiles.userId, companyUserId),
    });

    if (!companyProfile) throw new Error('Company profile not found');

    // Check if contact limit exceeded
    if (companyProfile.contactsUsed >= companyProfile.contactsLimit) {
      throw new Error('Contact limit exceeded');
    }

    // Record contact
    await db.insert(contactHistory).values({
      companyId: companyProfile.id,
      driverId,
      contactType,
    });

    // Update contacts used
    await db.update(companyProfiles)
      .set({
        contactsUsed: companyProfile.contactsUsed + 1,
        updatedAt: new Date(),
      })
      .where(eq(companyProfiles.id, companyProfile.id));

    return true;
  }

  static async upgradeSubscription(userId: string, tier: 'pro' | 'premium') {
    const limits = {
      pro: 50,
      premium: 300,
    };

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    return await db.update(companyProfiles)
      .set({
        subscriptionTier: tier,
        contactsLimit: limits[tier],
        subscriptionExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(companyProfiles.userId, userId))
      .returning();
  }
}

// Review Services
export class ReviewService {
  static async createReview(reviewData: {
    driverId: string;
    companyId: string;
    jobId?: string;
    rating: number;
    comment?: string;
  }) {
    const [review] = await db.insert(reviews).values(reviewData).returning();

    // Update driver's average rating
    const driverReviews = await db.select({
      avgRating: sql<number>`AVG(${reviews.rating})`,
      count: count(),
    })
    .from(reviews)
    .where(eq(reviews.driverId, reviewData.driverId));

    if (driverReviews[0]) {
      await db.update(driverProfiles)
        .set({
          rating: driverReviews[0].avgRating,
          totalReviews: driverReviews[0].count,
          updatedAt: new Date(),
        })
        .where(eq(driverProfiles.id, reviewData.driverId));
    }

    return review;
  }

  static async getDriverReviews(driverId: string, limit = 10) {
    return await db.query.reviews.findMany({
      where: eq(reviews.driverId, driverId),
      with: {
        company: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(reviews.createdAt)],
      limit,
    });
  }
}

// Job Services
export class JobService {
  static async createJob(companyUserId: string, jobData: {
    title: string;
    description?: string;
    vehicleType?: string;
    route?: string;
    fromLocation?: string;
    toLocation?: string;
    salary?: number;
    duration?: string;
    requirements?: any;
  }) {
    const companyProfile = await db.query.companyProfiles.findFirst({
      where: eq(companyProfiles.userId, companyUserId),
    });

    if (!companyProfile) throw new Error('Company profile not found');

    return await db.insert(jobs).values({
      companyId: companyProfile.id,
      ...jobData,
    }).returning();
  }

  static async getJobsByCompany(companyUserId: string) {
    const companyProfile = await db.query.companyProfiles.findFirst({
      where: eq(companyProfiles.userId, companyUserId),
    });

    if (!companyProfile) return [];

    return await db.query.jobs.findMany({
      where: eq(jobs.companyId, companyProfile.id),
      orderBy: [desc(jobs.createdAt)],
    });
  }

  static async getAvailableJobs(filters?: {
    vehicleType?: string;
    location?: string;
  }) {
    return await db.query.jobs.findMany({
      where: eq(jobs.status, 'open'),
      with: {
        company: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(jobs.createdAt)],
    });
  }
}

// Notification Services
export class NotificationService {
  static async createNotification(notificationData: {
    userId: string;
    title: string;
    message?: string;
    type?: string;
    data?: any;
  }) {
    return await db.insert(notifications).values(notificationData).returning();
  }

  static async getUserNotifications(userId: string, limit = 20) {
    return await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
      limit,
    });
  }

  static async markAsRead(notificationId: string) {
    return await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
      .returning();
  }
}
