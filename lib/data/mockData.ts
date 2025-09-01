export interface Driver {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  city: string;
  state: string;
  licenseNumber: string;
  licenseExpiry: string;
  yearsExperience: number;
  vehicleTypes: string[];
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  avatar: string;
  documents: {
    drivingLicense?: string;
    aadhaar?: string;
    pan?: string;
    photo?: string;
  };
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  subscriptionTier: 'free' | 'pro' | 'premium';
  contactsUsed: number;
}

export interface Review {
  id: string;
  driverId: string;
  companyId: string;
  companyName: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockDrivers: Driver[] = [
  {
    id: 'driver_1',
    name: 'Rajesh Kumar',
    age: 35,
    phone: '+91 9876543210',
    email: 'rajesh.kumar@email.com',
    city: 'Mumbai',
    state: 'Maharashtra',
    licenseNumber: 'MH12-20180001234',
    licenseExpiry: '2026-03-15',
    yearsExperience: 12,
    vehicleTypes: ['Bus', 'Cargo Truck'],
    isAvailable: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 45,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
    documents: {
      drivingLicense: '/docs/dl_rajesh.pdf',
      aadhaar: '/docs/aadhaar_rajesh.pdf',
      pan: '/docs/pan_rajesh.pdf',
      photo: '/docs/photo_rajesh.jpg'
    }
  },
  {
    id: 'driver_2',
    name: 'Suresh Patel',
    age: 42,
    phone: '+91 9876543211',
    email: 'suresh.patel@email.com',
    city: 'Ahmedabad',
    state: 'Gujarat',
    licenseNumber: 'GJ01-20160005678',
    licenseExpiry: '2025-08-20',
    yearsExperience: 18,
    vehicleTypes: ['Long-haul Truck', 'Container'],
    isAvailable: false,
    isVerified: true,
    rating: 4.9,
    reviewCount: 67,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh',
    documents: {
      drivingLicense: '/docs/dl_suresh.pdf',
      aadhaar: '/docs/aadhaar_suresh.pdf',
      pan: '/docs/pan_suresh.pdf',
      photo: '/docs/photo_suresh.jpg'
    }
  },
  {
    id: 'driver_3',
    name: 'Amit Singh',
    age: 28,
    phone: '+91 9876543212',
    email: 'amit.singh@email.com',
    city: 'Delhi',
    state: 'Delhi',
    licenseNumber: 'DL07-20200009876',
    licenseExpiry: '2027-01-10',
    yearsExperience: 6,
    vehicleTypes: ['Bus', 'Mini Truck'],
    isAvailable: true,
    isVerified: false,
    rating: 4.3,
    reviewCount: 23,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
    documents: {
      drivingLicense: '/docs/dl_amit.pdf',
      photo: '/docs/photo_amit.jpg'
    }
  },
  {
    id: 'driver_4',
    name: 'Ravi Sharma',
    age: 39,
    phone: '+91 9876543213',
    email: 'ravi.sharma@email.com',
    city: 'Bangalore',
    state: 'Karnataka',
    licenseNumber: 'KA03-20170003456',
    licenseExpiry: '2026-11-05',
    yearsExperience: 15,
    vehicleTypes: ['Cargo Truck', 'Tanker'],
    isAvailable: true,
    isVerified: true,
    rating: 4.7,
    reviewCount: 89,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ravi',
    documents: {
      drivingLicense: '/docs/dl_ravi.pdf',
      aadhaar: '/docs/aadhaar_ravi.pdf',
      pan: '/docs/pan_ravi.pdf',
      photo: '/docs/photo_ravi.jpg'
    }
  },
  {
    id: 'driver_5',
    name: 'Vikram Reddy',
    age: 31,
    phone: '+91 9876543214',
    email: 'vikram.reddy@email.com',
    city: 'Hyderabad',
    state: 'Telangana',
    licenseNumber: 'TS09-20190007890',
    licenseExpiry: '2026-06-30',
    yearsExperience: 9,
    vehicleTypes: ['Bus', 'Long-haul Truck'],
    isAvailable: false,
    isVerified: true,
    rating: 4.6,
    reviewCount: 34,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
    documents: {
      drivingLicense: '/docs/dl_vikram.pdf',
      aadhaar: '/docs/aadhaar_vikram.pdf',
      pan: '/docs/pan_vikram.pdf',
      photo: '/docs/photo_vikram.jpg'
    }
  }
];

export const mockCompanies: Company[] = [
  {
    id: 'company_1',
    name: 'ABC Transport Solutions',
    email: 'contact@abctransport.com',
    phone: '+91 9876543220',
    city: 'Mumbai',
    state: 'Maharashtra',
    subscriptionTier: 'pro',
    contactsUsed: 15
  },
  {
    id: 'company_2',
    name: 'XYZ Logistics',
    email: 'info@xyzlogistics.com',
    phone: '+91 9876543221',
    city: 'Delhi',
    state: 'Delhi',
    subscriptionTier: 'premium',
    contactsUsed: 45
  }
];

export const mockReviews: Review[] = [
  {
    id: 'review_1',
    driverId: 'driver_1',
    companyId: 'company_1',
    companyName: 'ABC Transport Solutions',
    rating: 5,
    comment: 'Excellent driver, very punctual and professional. Highly recommended!',
    date: '2024-08-15'
  },
  {
    id: 'review_2',
    driverId: 'driver_1',
    companyId: 'company_2',
    companyName: 'XYZ Logistics',
    rating: 4,
    comment: 'Good driving skills and maintained the vehicle well.',
    date: '2024-07-22'
  },
  {
    id: 'review_3',
    driverId: 'driver_2',
    companyId: 'company_1',
    companyName: 'ABC Transport Solutions',
    rating: 5,
    comment: 'Outstanding experience! Very reliable for long-haul trips.',
    date: '2024-08-01'
  }
];

export const vehicleTypes = [
  'Bus',
  'Cargo Truck',
  'Long-haul Truck',
  'Mini Truck',
  'Container',
  'Tanker',
  'Trailer',
  'Auto Rickshaw'
];

export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi'
];
