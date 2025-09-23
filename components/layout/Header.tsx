'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/common/ModeToggle';
import { Truck, User, LogOut, Settings, Crown } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import LanguageSwitcher with no SSR to prevent hydration mismatch
const LanguageSwitcher = dynamic(
  () => import('@/components/common/LanguageSwitcher').then(mod => ({ default: mod.LanguageSwitcher })),
  { ssr: false }
);

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { currentPlan, contactsRemaining } = useSubscription();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Truck className="h-6 w-6 text-primary" />
          <span>DriverConnect</span>
        </Link>

        {/* Main Navigation - Always visible */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            // Logged in user navigation
            <>
              <Link href={`/${user.role}`} className="text-sm font-medium hover:text-primary">
                {t('nav.dashboard')}
              </Link>
              {user.role === 'driver' && (
                <Link href="/driver/profile" className="text-sm font-medium hover:text-primary">
                  {t('nav.profile')}
                </Link>
              )}
              {user.role === 'company' && (
                <Link href="/company/drivers" className="text-sm font-medium hover:text-primary">
                  {t('nav.drivers')}
                </Link>
              )}
              {user.role === 'admin' && (
                <>
                  <Link href="/admin/drivers" className="text-sm font-medium hover:text-primary">
                    {t('nav.drivers')}
                  </Link>
                  <Link href="/admin/companies" className="text-sm font-medium hover:text-primary">
                    {t('nav.companies')}
                  </Link>
                </>
              )}
            </>
          ) : (
            // Public navigation for non-logged in users
            <>
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/research" className="text-sm font-medium hover:text-primary transition-colors">
                Research
              </Link>
              <Link href="/news" className="text-sm font-medium hover:text-primary transition-colors">
                News
              </Link>
              <Link href="/blacklisted-drivers" className="text-sm font-medium hover:text-primary transition-colors">
                Blacklisted Drivers
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ModeToggle />
          
          {user ? (
            <div className="flex items-center gap-3">
              {/* Subscription info for companies */}
              {user.role === 'company' && (
                <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="outline" className={`${getPlanColor(currentPlan)} text-white`}>
                    <Crown className="h-3 w-3 mr-1" />
                    {t(`company.subscriptionTiers.${currentPlan}`)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {contactsRemaining} {t('company.contactsRemaining')}
                  </span>
                </div>
              )}

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${user.role}/profile`}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${user.role}/settings`}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('nav.settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('common.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">{t('common.login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">{t('common.signup')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
