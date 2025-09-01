'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Users, Shield, Star, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their dashboard
  React.useEffect(() => {
    if (user) {
      router.push(`/${user.role}`);
    }
  }, [user, router]);

  if (user) {
    return null; // Will redirect
  }

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Connect with Professional Drivers",
      description: "Access a network of verified, experienced drivers across India"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verified & Trusted",
      description: "All drivers undergo document verification and background checks"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Rating & Review System",
      description: "Make informed decisions with our comprehensive rating system"
    }
  ];

  const stats = [
    { number: "5000+", label: "Registered Drivers" },
    { number: "500+", label: "Partner Companies" },
    { number: "50,000+", label: "Successful Connections" },
    { number: "4.8", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Truck className="h-12 w-12 text-primary" />
              <span className="text-4xl font-bold">DriverConnect</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connect with Professional Drivers Across India
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The leading platform for transportation companies to find verified, experienced drivers 
              for buses, cargo trucks, and long-haul vehicles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/auth/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose DriverConnect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make it easy for companies to find reliable drivers and for drivers to find great opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Drivers Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">For Drivers</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Build Your Professional Profile
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Create a comprehensive profile showcasing your experience, certifications, 
                and vehicle expertise to attract top transportation companies.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Upload driving license and documents</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Get verified and build trust</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Receive ratings and reviews</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Access training and certification</span>
                </div>
              </div>
              
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Join as Driver
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <Card className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    RK
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Rajesh Kumar</h3>
                    <p className="text-muted-foreground">Bus & Cargo Driver</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.8</span>
                      </div>
                      <Badge variant="outline">Verified</Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Available</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium">12 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">Mumbai, Maharashtra</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle Types:</span>
                    <span className="font-medium">Bus, Cargo Truck</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="p-8">
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Subscription Plans</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Free Plan</div>
                        <div className="text-sm text-muted-foreground">10 contacts/month</div>
                      </div>
                      <Badge variant="outline">₹0</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border rounded-lg bg-blue-50">
                      <div>
                        <div className="font-medium">Pro Plan</div>
                        <div className="text-sm text-muted-foreground">50 contacts + WhatsApp</div>
                      </div>
                      <Badge className="bg-blue-500">₹999</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border rounded-lg bg-purple-50">
                      <div>
                        <div className="font-medium">Premium Plan</div>
                        <div className="text-sm text-muted-foreground">300 contacts + Direct chat</div>
                      </div>
                      <Badge className="bg-purple-500">₹2999</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="mb-4">For Companies</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Find the Right Drivers for Your Fleet
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Search, filter, and connect with verified drivers based on your specific requirements. 
                Choose from flexible subscription plans that fit your business needs.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Advanced search and filtering</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Verified driver profiles</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Direct contact and WhatsApp integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Rating and review system</span>
                </div>
              </div>
              
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Join as Company
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of drivers and companies already using DriverConnect 
            to build successful partnerships in the transportation industry.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/auth/signup">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/auth/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
