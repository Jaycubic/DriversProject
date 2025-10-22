'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translations inline to avoid import issues
const enTranslation = {
  "common": {
    "login": "Login",
    "signup": "Sign Up",
    "logout": "Logout",
    "search": "Search",
    "filter": "Filter",
    "save": "Save",
    "cancel": "Cancel",
    "submit": "Submit",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View",
    "contact": "Contact",
    "available": "Available",
    "unavailable": "Unavailable",
    "verified": "Verified",
    "unverified": "Unverified",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "welcomeBack": "Welcome Back",
    "complete": "Complete",
    "pendingVerification": "Pending Verification"
  },
  "nav": {
    "home": "Home",
    "home.hero.title": "Connect. Drive.",
    "home.hero.succeed": "Succeed.",
    "home.hero.subtitle": "India's leading platform connecting professional drivers with transport companies. Join thousands of verified drivers and companies transforming the transportation industry.",
    "home.hero.registerDriver": "Register as Driver",
    "home.hero.registerCompany": "Register Company",
    "home.stats.drivers": "Verified Drivers",
    "home.stats.companies": "Transport Companies",
    "home.stats.trips": "Successful Trips",
    "home.stats.satisfaction": "Satisfaction Rate",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "drivers": "Drivers",
    "companies": "Companies",
    "admin": "Admin",
    "settings": "Settings"
  },
  "auth": {
    "welcomeBack": "Welcome Back",
    "createAccount": "Create Account",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "fullName": "Full Name",
    "companyName": "Company Name",
    "forgotPassword": "Forgot Password?",
    "dontHaveAccount": "Don't have an account?",
    "alreadyHaveAccount": "Already have an account?",
    "loginAsDriver": "Login as Driver",
    "loginAsCompany": "Login as Company",
    "loginAsAdmin": "Login as Admin"
  },
  "driver": {
    "profile": "Driver Profile",
    "personalInfo": "Personal Information",
    "licenseInfo": "License Information",
    "experience": "Experience",
    "vehicleTypes": "Vehicle Types",
    "documents": "Documents",
    "availability": "Availability",
    "ratings": "Ratings & Reviews",
    "name": "Full Name",
    "age": "Age",
    "phone": "Phone Number",
    "city": "City",
    "state": "State",
    "licenseNumber": "License Number",
    "licenseExpiry": "License Expiry",
    "yearsExperience": "Years of Experience",
    "uploadDL": "Upload Driving License",
    "uploadAadhaar": "Upload Aadhaar",
    "uploadPAN": "Upload PAN Card",
    "uploadPhoto": "Upload Profile Photo",
    "toggleAvailability": "Toggle Availability",
    "currentlyAvailable": "Currently Available",
    "currentlyUnavailable": "Currently Unavailable",
    "dashboard": {
      "subtitle": "Manage your profile and track your opportunities",
      "rating": "Rating",
      "basedOnReviews": "Based on {{count}} reviews",
      "totalJobs": "Total Jobs",
      "lifetimeOpportunities": "Lifetime opportunities",
      "completed": "Completed",
      "successRate": "Success rate",
      "availability": "Availability",
      "profileStatus": "Profile Status",
      "completeProfile": "Complete your profile to get more opportunities",
      "personalInfo": "Personal Information",
      "licenseDocuments": "License Documents",
      "vehicleTypes": "Vehicle Types",
      "editProfile": "Edit Profile",
      "recentActivity": "Recent Activity",
      "quickActions": "Quick Actions",
      "updateProfile": "Update Profile",
      "uploadDocuments": "Upload Documents",
      "viewReviews": "View Reviews",
      "trainingCertification": "Training & Certification",
      "verificationStatus": "Verification Status",
      "drivingLicense": "Driving License",
      "aadhaarCard": "Aadhaar Card",
      "panCard": "PAN Card",
      "backgroundCheck": "Background Check"
    }
  },
  "company": {
    "searchDrivers": "Search Drivers",
    "filterDrivers": "Filter Drivers",
    "subscriptionPlan": "Subscription Plan",
    "contactsRemaining": "Contacts Remaining",
    "upgradeSubscription": "Upgrade Subscription",
    "location": "Location",
    "experienceLevel": "Experience Level",
    "verifiedOnly": "Verified Only",
    "availableOnly": "Available Only",
    "contactDriver": "Contact Driver",
    "viewProfile": "View Profile",
    "leaveReview": "Leave Review",
    "subscriptionTiers": {
      "free": "Free",
      "pro": "Pro",
      "premium": "Premium"
    },
    "dashboard": {
      "subtitle": "Manage your company profile and find drivers",
      "subscription": "Subscription",
      "contactsUsed": "Contacts Used",
      "remaining": "remaining",
      "activeJobs": "Active Jobs",
      "openPositions": "open positions",
      "totalJobs": "Total Jobs",
      "allTimeJobs": "all-time jobs",
      "companyProfile": "Company Profile",
      "editProfile": "Edit Profile",
      "postJob": "Post Job",
      "recentJobs": "Recent Jobs",
      "manageJobPostings": "Manage your job postings",
      "viewAllJobs": "View All Jobs",
      "subscriptionPlan": "Subscription Plan",
      "quickActions": "Quick Actions",
      "searchDrivers": "Search Drivers",
      "manageContacts": "Manage Contacts",
      "viewAnalytics": "View Analytics",
      "planFeatures": "Plan Features",
      "upgradePlan": "Upgrade Plan"
    },
    "drivers": {
      "title": "Search Drivers",
      "subtitle": "Find qualified drivers for your transportation needs",
      "subscriptionStatus": "Subscription Status",
      "contactsUsed": "contacts used",
      "contactLimitReached": "Contact limit reached",
      "searchFilters": "Search & Filters",
      "searchPlaceholder": "Search by name or location...",
      "selectState": "Select State",
      "allStates": "All States",
      "selectVehicleType": "Select Vehicle Type",
      "allVehicleTypes": "All Vehicle Types",
      "minExperience": "Minimum Experience",
      "anyExperience": "Any Experience",
      "resultsFound": "{{count}} drivers found",
      "yearsExperience": "years experience",
      "completedJobs": "completed jobs",
      "contactInfo": "Contact Information",
      "upgradeToView": "Upgrade to view",
      "available": "Available",
      "contact": "Contact",
      "upgradeForWhatsApp": "Upgrade for WhatsApp",
      "noResults": "No drivers found",
      "tryDifferentFilters": "Try adjusting your search filters"
    }
  }
};

const resources = {
  en: {
    translation: enTranslation,
  },
  'en-US': {
    translation: enTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;

// Add Hindi translations for home page
const hiHome = {
  "home.hero.title": "कनेक्ट करें. ड्राइव करें.",
  "home.hero.succeed": "सफल हों.",
  "home.hero.subtitle": "भारत का अग्रणी प्लेटफॉर्म जो पेशेवर ड्राइवरों को परिवहन कंपनियों से जोड़ता है। हजारों सत्यापित ड्राइवरों और कंपनियों में शामिल हों जो परिवहन उद्योग को बदल रहे हैं।",
  "home.hero.registerDriver": "ड्राइवर के रूप में पंजीकरण करें",
  "home.hero.registerCompany": "कंपनी पंजीकृत करें",
  "home.stats.drivers": "सत्यापित ड्राइवर",
  "home.stats.companies": "परिवहन कंपनियां",
  "home.stats.trips": "सफल यात्राएं",
  "home.stats.satisfaction": "संतुष्टि दर"
};

// Update i18n resources
i18n.addResourceBundle('hi', 'translation', hiHome, true, true);
