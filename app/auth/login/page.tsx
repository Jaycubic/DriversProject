'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, Building } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'driver' | 'company'>('driver');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, activeTab as UserRole);
      router.push(`/${activeTab}`);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const roleIcons = {
    driver: <Truck className="h-5 w-5" />,
    company: <Building className="h-5 w-5" />
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">DriverConnect</span>
          </div>
          <CardTitle>{t('auth.welcomeBack')}</CardTitle>
          <CardDescription>
            Choose your role and sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'driver' | 'company')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="driver" className="flex items-center gap-2">
                {roleIcons.driver}
                <span className="hidden sm:inline">Driver</span>
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                {roleIcons.company}
                <span className="hidden sm:inline">Company</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('common.loading') : t('common.login')}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {t('auth.dontHaveAccount')}{' '}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    {t('common.signup')}
                  </Link>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
