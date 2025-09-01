'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'driver' | 'company' | 'admin';
  phone?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: 'driver' | 'company', phone?: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('driverconnect_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('driverconnect_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock authentication - in real app, this would be an API call
      const mockUsers = [
        {
          id: '1',
          email: 'test@driver.com',
          password: 'password123',
          name: 'John Driver',
          role: 'driver' as const,
          phone: '+91 9876543210',
          isVerified: true
        },
        {
          id: '2',
          email: 'test@company.com',
          password: 'password123',
          name: 'ABC Transport Solutions',
          role: 'company' as const,
          phone: '+91 9876543211',
          isVerified: true
        },
        {
          id: '3',
          email: 'admin@driverconnect.com',
          password: 'password123',
          name: 'Admin User',
          role: 'admin' as const,
          isVerified: true
        }
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('driverconnect_user', JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'driver' | 'company',
    phone?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock signup - in real app, this would be an API call
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        phone,
        isVerified: false
      };

      setUser(newUser);
      localStorage.setItem('driverconnect_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('driverconnect_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signup,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
