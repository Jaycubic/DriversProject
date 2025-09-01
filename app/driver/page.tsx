'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Star, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  FileText, 
  Upload, 
  Award,
  MapPin,
  Phone,
  Calendar
} from 'lucide-react';

export default function DriverDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  // Mock data for demonstration
  const mockProfile = {
    rating: 4.8,
    totalReviews: 45,
    totalJobs: 156,
    completedJobs: 152,
    successRate: 97.4,
    documents: {
      drivingLicense: { status: 'verified' },
      aadhaar: { status: 'pending' },
      pan: { status: 'pending' },
      backgroundCheck: { status: 'not_started' }
    },
    recentActivity: [
      {
        rating: 5,
        comment: 'Excellent driver! Very professional and punctual.',
        company: 'ABC Transport Solutions',
        date: '2024-01-15'
      },
      {
        rating: 5,
        comment: 'Highly recommended. Great communication throughout the journey.',
        company: 'XYZ Logistics',
        date: '2024-01-10'
      },
      {
        rating: 4,
        comment: 'Good driver, completed the job successfully.',
        company: 'Quick Delivery',
        date: '2024-01-05'
      }
    ]
  };

  const getDocumentStatus = (docType: string) => {
    if (!mockProfile.documents || !mockProfile.documents[docType]) {
      return { status: 'not_started', label: 'Not Started', color: 'secondary' };
    }
    
    const doc = mockProfile.documents[docType];
    switch (doc.status) {
      case 'verified':
        return { status: 'verified', label: 'Verified', color: 'default' };
      case 'pending':
        return { status: 'pending', label: 'Pending', color: 'secondary' };
      default:
        return { status: 'not_started', label: 'Not Started', color: 'secondary' };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('common.welcomeBack')}, {user?.name || 'Driver'}!
        </h1>
        <p className="text-muted-foreground">
          {t('driver.dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('driver.dashboard.rating')}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProfile.rating}</div>
            <p className="text-xs text-muted-foreground">
              {t('driver.dashboard.basedOnReviews', { count: mockProfile.totalReviews })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('driver.dashboard.totalJobs')}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProfile.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {t('driver.dashboard.lifetimeOpportunities')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('driver.dashboard.completed')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProfile.completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              {mockProfile.successRate}% {t('driver.dashboard.successRate')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('driver.dashboard.availability')}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <span className="text-sm">
                {isAvailable ? t('driver.dashboard.currentlyAvailable') : t('driver.dashboard.unavailable')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Status */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('driver.dashboard.profileStatus')}</CardTitle>
              <CardDescription>
                {t('driver.dashboard.completeProfile')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5" />
                  <span>{t('driver.dashboard.personalInfo')}</span>
                </div>
                <Badge variant="default">{t('common.complete')}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="h-5 w-5" />
                  <span>{t('driver.dashboard.licenseDocuments')}</span>
                </div>
                <Badge variant={getDocumentStatus('drivingLicense').status === 'verified' ? 'default' : 'secondary'}>
                  {getDocumentStatus('drivingLicense').status === 'verified' ? 
                    t('common.verified') : t('common.pendingVerification')}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5" />
                  <span>{t('driver.dashboard.vehicleTypes')}</span>
                </div>
                <Badge variant="default">{t('common.complete')}</Badge>
              </div>

              <Button className="w-full mt-4">
                {t('driver.dashboard.editProfile')}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('driver.dashboard.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProfile.recentActivity.map((review, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.company}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Verification Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('driver.dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                {t('driver.dashboard.updateProfile')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                {t('driver.dashboard.uploadDocuments')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                {t('driver.dashboard.viewReviews')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="mr-2 h-4 w-4" />
                {t('driver.dashboard.trainingCertification')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('driver.dashboard.verificationStatus')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('driver.dashboard.drivingLicense')}</span>
                <Badge variant={getDocumentStatus('drivingLicense').status === 'verified' ? 'default' : 'secondary'}>
                  {getDocumentStatus('drivingLicense').label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('driver.dashboard.aadhaarCard')}</span>
                <Badge variant={getDocumentStatus('aadhaar').status === 'verified' ? 'default' : 'secondary'}>
                  {getDocumentStatus('aadhaar').label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('driver.dashboard.panCard')}</span>
                <Badge variant={getDocumentStatus('pan').status === 'verified' ? 'default' : 'secondary'}>
                  {getDocumentStatus('pan').label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('driver.dashboard.backgroundCheck')}</span>
                <Badge variant={getDocumentStatus('backgroundCheck').status === 'verified' ? 'default' : 'secondary'}>
                  {getDocumentStatus('backgroundCheck').label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
