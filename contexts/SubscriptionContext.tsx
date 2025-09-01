'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: {
    tier: 'free' | 'pro' | 'premium';
    contactsLimit: number;
    contactsUsed: number;
    expiresAt?: string;
  };
  canContact: boolean;
  recordContact: (driverId: string, contactType: string) => Promise<boolean>;
  upgradeSubscription: (tier: 'pro' | 'premium') => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState({
    tier: 'pro' as const,
    contactsLimit: 50,
    contactsUsed: 15,
    expiresAt: '2024-02-01'
  });

  const canContact = subscription.contactsUsed < subscription.contactsLimit;

  const recordContact = async (driverId: string, contactType: string): Promise<boolean> => {
    if (!canContact) {
      return false;
    }

    try {
      // Mock recording contact - in real app, this would be an API call
      setSubscription(prev => ({
        ...prev,
        contactsUsed: prev.contactsUsed + 1
      }));
      
      return true;
    } catch (error) {
      console.error('Error recording contact:', error);
      return false;
    }
  };

  const upgradeSubscription = async (tier: 'pro' | 'premium'): Promise<boolean> => {
    try {
      // Mock subscription upgrade - in real app, this would be an API call
      const newLimits = {
        pro: 50,
        premium: 300
      };

      setSubscription(prev => ({
        ...prev,
        tier,
        contactsLimit: newLimits[tier],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      }));

      return true;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      return false;
    }
  };

  // Load subscription data when user changes
  useEffect(() => {
    if (user?.role === 'company') {
      // Mock subscription data based on user
      if (user.email === 'test@company.com') {
        setSubscription({
          tier: 'pro',
          contactsLimit: 50,
          contactsUsed: 15,
          expiresAt: '2024-02-01'
        });
      } else {
        setSubscription({
          tier: 'free',
          contactsLimit: 10,
          contactsUsed: 3,
          expiresAt: undefined
        });
      }
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      canContact,
      recordContact,
      upgradeSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
