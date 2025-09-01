'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building, FileCheck, Crown, TrendingUp, AlertCircle } from 'lucide-react';
import { mockDrivers, mockCompanies } from '@/lib/data/mockData';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = {
    totalDrivers: mockDrivers.length,
    totalCompanies: mockCompanies.length,
    pendingVerifications: mockDrivers.filter(d => !d.isVerified).length,
    activeSubscriptions: mockCompanies.filter(c => c.subscriptionTier !== 'free').length
  };

  const pendingDrivers = mockDrivers.filter(d => !d.isVerified);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('admin.dashboard')}
        </h1>
        <p className="text-muted-foreground">
          Manage drivers, companies, and platform operations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalDrivers')}</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrivers}</div>
            <p className="text-xs text-muted-foreground">
              {mockDrivers.filter(d => d.isVerified).length} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalCompanies')}</CardTitle>
            <Building className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubscriptions} with paid plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.pendingVerifications')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
            <p className="text-xs text-muted-foreground">
              Require document review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.activeSubscriptions')}</CardTitle>
            <Crown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Pro & Premium plans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="verifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="verifications">Document Verifications</TabsTrigger>
          <TabsTrigger value="drivers">Driver Management</TabsTrigger>
          <TabsTrigger value="companies">Company Management</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.verifyDocuments')}</CardTitle>
              <CardDescription>
                Review and approve driver document submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {driver.city}, {driver.state} • {driver.yearsExperience} years exp
                        </p>
                        <div className="flex gap-2 mt-1">
                          {driver.documents.drivingLicense && (
                            <Badge variant="outline" className="text-xs">DL</Badge>
                          )}
                          {driver.documents.aadhaar && (
                            <Badge variant="outline" className="text-xs">Aadhaar</Badge>
                          )}
                          {driver.documents.pan && (
                            <Badge variant="outline" className="text-xs">PAN</Badge>
                          )}
                          {driver.documents.photo && (
                            <Badge variant="outline" className="text-xs">Photo</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {t('common.view')}
                      </Button>
                      <Button size="sm" variant="destructive">
                        {t('admin.reject')}
                      </Button>
                      <Button size="sm">
                        {t('admin.approve')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Driver Management</CardTitle>
              <CardDescription>
                Manage all registered drivers on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {driver.email} • {driver.phone}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={driver.isVerified ? "default" : "secondary"}>
                            {driver.isVerified ? t('common.verified') : t('common.unverified')}
                          </Badge>
                          <Badge variant={driver.isAvailable ? "outline" : "secondary"}>
                            {driver.isAvailable ? t('common.available') : t('common.unavailable')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {t('common.view')}
                      </Button>
                      <Button size="sm" variant="outline">
                        {t('common.edit')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Company Management</CardTitle>
              <CardDescription>
                Manage all registered companies on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCompanies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {company.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {company.email} • {company.phone}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className={
                            company.subscriptionTier === 'premium' ? 'bg-purple-50 text-purple-700' :
                            company.subscriptionTier === 'pro' ? 'bg-blue-50 text-blue-700' :
                            'bg-gray-50 text-gray-700'
                          }>
                            {company.subscriptionTier.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {company.contactsUsed} contacts used
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {t('common.view')}
                      </Button>
                      <Button size="sm" variant="outline">
                        {t('common.edit')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.manageSubscriptions')}</CardTitle>
              <CardDescription>
                Monitor subscription plans and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Free Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {mockCompanies.filter(c => c.subscriptionTier === 'free').length}
                    </div>
                    <p className="text-sm text-muted-foreground">Active users</p>
                    <p className="text-sm text-muted-foreground mt-2">₹0/month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pro Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {mockCompanies.filter(c => c.subscriptionTier === 'pro').length}
                    </div>
                    <p className="text-sm text-muted-foreground">Active users</p>
                    <p className="text-sm text-muted-foreground mt-2">₹999/month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Premium Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {mockCompanies.filter(c => c.subscriptionTier === 'premium').length}
                    </div>
                    <p className="text-sm text-muted-foreground">Active users</p>
                    <p className="text-sm text-muted-foreground mt-2">₹2999/month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-4">Monthly Revenue</h4>
                <div className="text-3xl font-bold text-green-600">
                  ₹{(mockCompanies.filter(c => c.subscriptionTier === 'pro').length * 999 + 
                      mockCompanies.filter(c => c.subscriptionTier === 'premium').length * 2999).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  From {stats.activeSubscriptions} paid subscriptions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
