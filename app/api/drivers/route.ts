import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/drivers`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch drivers from backend');
    }
    
    const drivers = await response.json();
    
    // Transform backend data to match frontend expectations
    const transformedDrivers = drivers.map((driver: any) => ({
      id: driver.id.toString(),
      user: {
        name: driver.name,
        email: driver.email,
        phone: driver.phone
      },
      experience: driver.experience,
      location: driver.location,
      state: driver.location?.split(', ')[1] || driver.location,
      city: driver.location?.split(', ')[0] || driver.location,
      rating: driver.rating ? parseFloat(driver.rating) : 4.5,
      totalReviews: parseInt(driver.review_count) || 0,
      totalJobs: driver.total_jobs || 0,
      completedJobs: driver.total_jobs || 0,
      isAvailable: driver.availability_status === 'available',
      vehicleTypes: Array.isArray(driver.vehicle_types) ? driver.vehicle_types : [],
      bio: driver.bio || 'Professional driver with extensive experience.'
    }));
    
    return NextResponse.json(transformedDrivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}
