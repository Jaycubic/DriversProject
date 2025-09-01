# DriverConnect - Transportation Workforce Platform

A comprehensive web application connecting transportation companies with qualified drivers across India. Built with Next.js, PostgreSQL, and modern UI components.

## Features

### For Companies
- **Driver Search & Discovery**: Advanced search with filters for location, experience, and vehicle types
- **Subscription Management**: Tiered plans (Free, Pro, Premium) with contact limits
- **Contact Management**: Track driver contacts and subscription usage
- **Job Posting**: Post and manage transportation job opportunities
- **Company Profiles**: Comprehensive company information and verification

### For Drivers
- **Professional Profiles**: Showcase experience, skills, and vehicle types
- **Document Verification**: Upload and verify driving licenses, Aadhaar, PAN
- **Availability Management**: Toggle availability status
- **Rating System**: Build reputation through company reviews
- **Job Opportunities**: Access to posted jobs from verified companies

### For Administrators
- **User Management**: Oversee drivers and companies
- **Document Verification**: Approve/reject driver documents
- **Subscription Management**: Monitor and manage company subscriptions
- **Platform Analytics**: Track platform usage and growth

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, PostgreSQL
- **Database ORM**: Drizzle ORM
- **Authentication**: Custom JWT-based auth
- **Internationalization**: i18next (English, Hindi, Marathi, Tamil)
- **Icons**: Lucide React

## Database Schema

### Core Tables
- `users` - Base user authentication and profiles
- `driver_profiles` - Driver-specific information and documents
- `company_profiles` - Company details and subscription info
- `jobs` - Job postings and assignments
- `reviews` - Rating and review system
- `contact_history` - Subscription usage tracking
- `notifications` - User notification system

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL 14+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jaycubic/DriversProject.git
cd DriversProject
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=driver_connect
PGHOST=localhost
PGPORT=5432
```

5. Set up the database:
```bash
# Create database
createdb -h localhost driver_connect

# Run migrations
bun run db:migrate

# Seed with test data
bun run db:seed
```

6. Start the development server:
```bash
bun run dev
# or
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Accounts

### Driver Account
- Email: `test@driver.com`
- Password: `password123`

### Company Account
- Email: `test@company.com`
- Password: `password123`

### Admin Account
- Email: `admin@driverconnect.com`
- Password: `password123`

## Database Commands

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Seed database
bun run db:seed

# Reset database (development only)
bun run db:reset
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── company/           # Company dashboard
│   ├── driver/            # Driver dashboard
│   └── admin/             # Admin dashboard
├── components/            # Reusable UI components
├── contexts/              # React contexts
├── lib/                   # Utilities and database
│   ├── db/               # Database schema and services
│   └── utils.ts          # Helper functions
├── public/               # Static assets and translations
└── hooks/                # Custom React hooks
```

## Subscription Tiers

### Free Plan
- 10 contacts per month
- Basic search functionality
- Email support

### Pro Plan (₹999/month)
- 50 contacts per month
- Advanced search filters
- WhatsApp contact integration
- Priority support

### Premium Plan (₹2999/month)
- 300 contacts per month
- All features included
- Direct chat functionality
- 24/7 support
- Auto-matching algorithms

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@driverconnect.com or join our Slack channel.
