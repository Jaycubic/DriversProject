'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Search, 
  MessageCircle, 
  TrendingUp, 
  Calendar,
  Building,
  Phone,
  Mail,
  Globe,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function CompanyDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Mock data for demonstration
  const mockProfile = {
    companyName: 'ABC Transport Solutions',
    registrationNumber: 'CIN-U60200MH2020PTC123456',
    address: '123 Transport Hub, Andheri East, Mumbai, Maharashtra 400069',
    city: 'Mumbai',
    state: 'Maharashtra',
    website: 'https://abctransport.com',
    description: 'Leading transportation company providing reliable logistics solutions across India.',
    jobs: [
      {
        id: 1,
        title: 'Long Haul Cargo Driver - Mumbai to Delhi',
        fromLocation: 'Mumbai, Maharashtra',
        toLocation: 'Delhi',
        salary: 25000,
        status: 'open',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: 'Bus Driver - Mumbai Local Routes',
        fromLocation: 'Mumbai, Maharashtra',
        toLocation: 'Mumbai, Maharashtra',
        salary: 35000,
        status: 'open',
        createdAt: '2024-01-10'
      },
      {
        id: 3,
        title: 'Delivery Driver - Express Service',
        fromLocation: 'Mumbai, Maharashtra',
        toLocation: 'Pune, Maharashtra',
        salary: 20000,
        status: 'assigned',
        createdAt: '2024-01-05'
      }
    ]
  };

  const subscriptionProgress = (subscription.contactsUsed / subscription.contactsLimit) * 100;

  const getSubscriptionBadgeColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('common.welcomeBack')}, {mockProfile.companyName}!
        </h1>
        <p className="text-muted-foreground">
          {t('company.dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('company.dashboard.subscription')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getSubscriptionBadgeColor(subscription.tier)}>
                {subscription.tier.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {subscription.tier === 'free' ? 'Free Plan' : 
               subscription.tier === 'pro' ? '₹999/month' : '₹2999/month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('company.dashboard.contactsUsed')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription.contactsUsed}/{subscription.contactsLimit}
            </div>
            <Progress value={subscriptionProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {subscription.contactsLimit - subscription.contactsUsed} {t('company.dashboard.remaining')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('company.dashboard.activeJobs')}</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProfile.jobs.filter(job => job.status === 'open').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('company.dashboard.openPositions')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('company.dashboard.totalJobs')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProfile.jobs.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('company.dashboard.allTimeJobs')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Profile & Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {t('company.dashboard.companyProfile')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{mockProfile.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={mockProfile.website} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      {mockProfile.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{mockProfile.city}, {mockProfile.state}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">{mockProfile.description}</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button size="sm">
                  {t('company.dashboard.editProfile')}
                </Button>
                <Button size="sm" variant="outline">
                  {t('company.dashboard.postJob')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>{t('company.dashboard.recentJobs')}</CardTitle>
              <CardDescription>
                {t('company.dashboard.manageJobPostings')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProfile.jobs.slice(0, 3).map((job, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{job.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {job.fromLocation} → {job.toLocation}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                        <span className="text-sm font-medium">₹{job.salary.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  {t('company.dashboard.viewAllJobs')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('company.dashboard.subscriptionPlan')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className={`${getSubscriptionBadgeColor(subscription.tier)} text-white mb-2`}>
                  {subscription.tier.toUpperCase()} PLAN
                </Badge>
                <div className="text-2xl font-bold">
                  {subscription.contactsUsed}/{subscription.contactsLimit}
                </div>
                <p className="text-sm text-muted-foreground">Contacts Used</p>
              </div>
              
              <Progress value={subscriptionProgress} className="w-full" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-medium capitalize">{subscription.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-medium">{subscription.contactsLimit - subscription.contactsUsed}</span>
                </div>
                {subscription.expiresAt && (
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span className="font-medium">
                      {new Date(subscription.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              {subscription.tier === 'free' && (
                <Button className="w-full">
                  {t('company.dashboard.upgradePlan')}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('company.dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/company/drivers">
                  <Search className="mr-2 h-4 w-4" />
                  {t('company.dashboard.searchDrivers')}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {t('company.dashboard.postJob')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('company.dashboard.manageContacts')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                {t('company.dashboard.viewAnalytics')}
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Features */}
          <Card>
            <CardHeader>
              <CardTitle>{t('company.dashboard.planFeatures')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Driver Search</span>
                  <Badge variant="outline">✓</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Contact Info</span>
                  <Badge variant={subscription.tier !== 'free' ? 'outline' : 'secondary'}>
                    {subscription.tier !== 'free' ? '✓' : 'Limited'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>WhatsApp Integration</span>
                  <Badge variant={subscription.tier === 'pro' || subscription.tier === 'premium' ? 'outline' : 'secondary'}>
                    {subscription.tier === 'pro' || subscription.tier === 'premium' ? '✓' : '✗'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Direct Chat</span>
                  <Badge variant={subscription.tier === 'premium' ? 'outline' : 'secondary'}>
                    {subscription.tier === 'premium' ? '✓' : '✗'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
