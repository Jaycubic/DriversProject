import { pgTable, serial, varchar, text, timestamp, boolean, integer, decimal, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - base table for all user types
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'driver', 'company', 'admin'
  phone: varchar('phone', { length: 20 }),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Driver profiles
export const driverProfiles = pgTable('driver_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  licenseNumber: varchar('license_number', { length: 50 }),
  experience: integer('experience'), // years
  location: varchar('location', { length: 255 }),
  state: varchar('state', { length: 100 }),
  city: varchar('city', { length: 100 }),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
  totalReviews: integer('total_reviews').default(0),
  totalJobs: integer('total_jobs').default(0),
  completedJobs: integer('completed_jobs').default(0),
  isAvailable: boolean('is_available').default(true),
  vehicleTypes: jsonb('vehicle_types'), // array of vehicle types
  documents: jsonb('documents'), // document verification status
  bio: text('bio'),
  profileImage: varchar('profile_image', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Company profiles
export const companyProfiles = pgTable('company_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  registrationNumber: varchar('registration_number', { length: 100 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  website: varchar('website', { length: 255 }),
  description: text('description'),
  logo: varchar('logo', { length: 500 }),
  subscriptionTier: varchar('subscription_tier', { length: 20 }).default('free'), // 'free', 'pro', 'premium'
  contactsUsed: integer('contacts_used').default(0),
  contactsLimit: integer('contacts_limit').default(10),
  subscriptionExpiresAt: timestamp('subscription_expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Reviews and ratings
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  driverId: uuid('driver_id').references(() => driverProfiles.id).notNull(),
  companyId: uuid('company_id').references(() => companyProfiles.id).notNull(),
  jobId: uuid('job_id').references(() => jobs.id),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Jobs/Opportunities
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companyProfiles.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  vehicleType: varchar('vehicle_type', { length: 100 }),
  route: varchar('route', { length: 500 }),
  fromLocation: varchar('from_location', { length: 255 }),
  toLocation: varchar('to_location', { length: 255 }),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  duration: varchar('duration', { length: 100 }),
  requirements: jsonb('requirements'),
  status: varchar('status', { length: 20 }).default('open'), // 'open', 'assigned', 'completed', 'cancelled'
  assignedDriverId: uuid('assigned_driver_id').references(() => driverProfiles.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Contact history for subscription tracking
export const contactHistory = pgTable('contact_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companyProfiles.id).notNull(),
  driverId: uuid('driver_id').references(() => driverProfiles.id).notNull(),
  contactType: varchar('contact_type', { length: 50 }).notNull(), // 'phone', 'whatsapp', 'direct_chat'
  createdAt: timestamp('created_at').defaultNow(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  type: varchar('type', { length: 50 }), // 'job_offer', 'review', 'verification', etc.
  isRead: boolean('is_read').default(false),
  data: jsonb('data'), // additional data for the notification
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  driverProfile: one(driverProfiles, {
    fields: [users.id],
    references: [driverProfiles.userId],
  }),
  companyProfile: one(companyProfiles, {
    fields: [users.id],
    references: [companyProfiles.userId],
  }),
}));

export const driverProfilesRelations = relations(driverProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [driverProfiles.userId],
    references: [users.id],
  }),
  reviews: many(reviews),
  jobs: many(jobs),
  contactHistory: many(contactHistory),
}));

export const companyProfilesRelations = relations(companyProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [companyProfiles.userId],
    references: [users.id],
  }),
  jobs: many(jobs),
  reviews: many(reviews),
  contactHistory: many(contactHistory),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  driver: one(driverProfiles, {
    fields: [reviews.driverId],
    references: [driverProfiles.id],
  }),
  company: one(companyProfiles, {
    fields: [reviews.companyId],
    references: [companyProfiles.id],
  }),
  job: one(jobs, {
    fields: [reviews.jobId],
    references: [jobs.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companyProfiles, {
    fields: [jobs.companyId],
    references: [companyProfiles.id],
  }),
  assignedDriver: one(driverProfiles, {
    fields: [jobs.assignedDriverId],
    references: [driverProfiles.id],
  }),
  reviews: many(reviews),
}));

export const contactHistoryRelations = relations(contactHistory, ({ one }) => ({
  company: one(companyProfiles, {
    fields: [contactHistory.companyId],
    references: [companyProfiles.id],
  }),
  driver: one(driverProfiles, {
    fields: [contactHistory.driverId],
    references: [driverProfiles.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
