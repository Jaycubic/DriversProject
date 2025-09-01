'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Filter,
  Search,
  Truck,
  Award,
  Calendar
} from 'lucide-react';

export default function CompanyDriverSearch() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { subscription, canContact, recordContact } = useSubscription();
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');

  // Mock drivers data
  const mockDrivers = [
    {
      id: '1',
      user: {
        name: 'Rajesh Kumar',
        email: 'rajesh@driver.com',
        phone: '+91 9876543210'
      },
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
      bio: 'Experienced professional driver with 12+ years in transportation. Specialized in long-haul cargo and passenger transport.'
    },
    {
      id: '2',
      user: {
        name: 'Suresh Patel',
        email: 'suresh@driver.com',
        phone: '+91 9876543211'
      },
      experience: 8,
      location: 'Pune, Maharashtra',
      state: 'Maharashtra',
      city: 'Pune',
      rating: 4.6,
      totalReviews: 32,
      totalJobs: 89,
      completedJobs: 85,
      isAvailable: true,
      vehicleTypes: ['Cargo Truck', 'Delivery Van'],
      bio: 'Reliable driver with excellent track record in cargo transportation across Western India.'
    },
    {
      id: '3',
      user: {
        name: 'Amit Singh',
        email: 'amit@driver.com',
        phone: '+91 9876543212'
      },
      experience: 15,
      location: 'Delhi',
      state: 'Delhi',
      city: 'Delhi',
      rating: 4.9,
      totalReviews: 67,
      totalJobs: 203,
      completedJobs: 198,
      isAvailable: true,
      vehicleTypes: ['Bus', 'Tourist Bus', 'Heavy Vehicle'],
      bio: 'Senior driver with extensive experience in passenger transport and interstate travel.'
    },
    {
      id: '4',
      user: {
        name: 'Ravi Sharma',
        email: 'ravi@driver.com',
        phone: '+91 9876543213'
      },
      experience: 6,
      location: 'Bangalore, Karnataka',
      state: 'Karnataka',
      city: 'Bangalore',
      rating: 4.4,
      totalReviews: 28,
      totalJobs: 67,
      completedJobs: 63,
      isAvailable: true,
      vehicleTypes: ['Cargo Truck', 'Container Truck'],
      bio: 'Dedicated driver specializing in technology sector logistics and container transport.'
    },
    {
      id: '5',
      user: {
        name: 'Vikram Reddy',
        email: 'vikram@driver.com',
        phone: '+91 9876543214'
      },
      experience: 10,
      location: 'Hyderabad, Telangana',
      state: 'Telangana',
      city: 'Hyderabad',
      rating: 4.7,
      totalReviews: 41,
      totalJobs: 124,
      completedJobs: 119,
      isAvailable: true,
      vehicleTypes: ['Bus', 'Cargo Truck'],
      bio: 'Versatile driver with experience in both passenger and cargo transportation.'
    },
    {
      id: '6',
      user: {
        name: 'Manoj Gupta',
        email: 'manoj@driver.com',
        phone: '+91 9876543215'
      },
      experience: 9,
      location: 'Chennai, Tamil Nadu',
      state: 'Tamil Nadu',
      city: 'Chennai',
      rating: 4.5,
      totalReviews: 35,
      totalJobs: 98,
      completedJobs: 94,
      isAvailable: true,
      vehicleTypes: ['Cargo Truck', 'Heavy Vehicle'],
      bio: 'Experienced in heavy vehicle operations and industrial cargo transport.'
    }
  ];

  const handleContactDriver = async (driverId: string, contactType: string) => {
    if (!canContact) {
      alert('Contact limit reached. Please upgrade your subscription.');
      return;
    }

    try {
      const success = await recordContact(driverId, contactType);
      if (success) {
        alert(`Contact recorded successfully! You have ${subscription.contactsLimit - subscription.contactsUsed - 1} contacts remaining.`);
      } else {
        alert('Failed to record contact. Please try again.');
      }
    } catch (error) {
      console.error('Error recording contact:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const filteredDrivers = mockDrivers.filter(driver => {
    const matchesSearch = !searchTerm || 
      driver.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesState = stateFilter === 'all' || driver.state === stateFilter;
    
    const matchesVehicleType = vehicleTypeFilter === 'all' || 
      driver.vehicleTypes?.includes(vehicleTypeFilter);
    
    const matchesExperience = experienceFilter === 'all' || 
      (driver.experience && driver.experience >= parseInt(experienceFilter));

    return matchesSearch && matchesState && matchesVehicleType && matchesExperience;
  });

  const getUniqueStates = () => {
    const states = mockDrivers.map(driver => driver.state).filter(Boolean);
    return [...new Set(states)];
  };

  const getUniqueVehicleTypes = () => {
    const types = mockDrivers.flatMap(driver => driver.vehicleTypes || []);
    return [...new Set(types)];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('company.drivers.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('company.drivers.subtitle')}
        </p>
      </div>

      {/* Subscription Status */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">
                {t('company.drivers.subscriptionStatus')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {subscription.contactsUsed}/{subscription.contactsLimit} {t('company.drivers.contactsUsed')}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={subscription.tier === 'free' ? 'secondary' : 'default'}>
                {subscription.tier.toUpperCase()} PLAN
              </Badge>
              {!canContact && (
                <p className="text-sm text-red-600 mt-1">
                  {t('company.drivers.contactLimitReached')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('company.drivers.searchFilters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder={t('company.drivers.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('company.drivers.selectState')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('company.drivers.allStates')}</SelectItem>
                {getUniqueStates().map(state => (
                  <SelectItem key={state} value={state!}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('company.drivers.selectVehicleType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('company.drivers.allVehicleTypes')}</SelectItem>
                {getUniqueVehicleTypes().map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('company.drivers.minExperience')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('company.drivers.anyExperience')}</SelectItem>
                <SelectItem value="1">1+ years</SelectItem>
                <SelectItem value="3">3+ years</SelectItem>
                <SelectItem value="5">5+ years</SelectItem>
                <SelectItem value="10">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Driver Results */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          {t('company.drivers.resultsFound', { count: filteredDrivers.length })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {driver.user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{driver.user.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{driver.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({driver.totalReviews})
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {t('common.available')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{driver.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>{driver.experience} {t('company.drivers.yearsExperience')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>{driver.vehicleTypes?.join(', ') || 'Not specified'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{driver.completedJobs} {t('company.drivers.completedJobs')}</span>
                </div>
              </div>

              {driver.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {driver.bio}
                </p>
              )}

              {/* Contact Information */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('company.drivers.contactInfo')}</span>
                  {subscription.tier === 'free' ? (
                    <Badge variant="secondary">{t('company.drivers.upgradeToView')}</Badge>
                  ) : (
                    <Badge variant="outline">{t('company.drivers.available')}</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {subscription.tier === 'free' ? (
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      <span className="blur-sm">+91 98765 43210</span>
                    </div>
                  ) : (
                    <span>{driver.user.phone || 'Not provided'}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={!canContact}
                  onClick={() => handleContactDriver(driver.id, 'phone')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t('company.drivers.contact')}
                </Button>
                
                {subscription.tier === 'pro' || subscription.tier === 'premium' ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={!canContact}
                    onClick={() => handleContactDriver(driver.id, 'whatsapp')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('company.drivers.upgradeForWhatsApp')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t('company.drivers.noResults')}</h3>
          <p className="text-muted-foreground">
            {t('company.drivers.tryDifferentFilters')}
          </p>
        </div>
      )}
    </div>
  );
}
