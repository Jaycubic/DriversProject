'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Target, Building2, Users, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About DriverConnect</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolutionizing the transportation industry by connecting professional drivers with transport companies through innovative technology and comprehensive solutions.
          </p>
        </div>

        {/* Vision, Mission, Business Model */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To become the leading platform that transforms the transportation ecosystem by creating seamless connections between drivers and companies, ensuring safety, efficiency, and growth for all stakeholders.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To empower professional drivers and transport companies through innovative technology, comprehensive verification systems, and reliable communication platforms that enhance operational efficiency and safety standards.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Business Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We operate on a subscription-based model for companies and provide free registration for drivers. Our revenue streams include premium subscriptions, verification services, and value-added features for enhanced connectivity.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose DriverConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <Users className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Verified Network</h3>
                <p className="text-sm text-muted-foreground">
                  All drivers and companies undergo thorough verification processes including document validation and background checks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Safety First</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive safety protocols, real-time tracking, and emergency support systems ensure secure operations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Globe className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Pan-India Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  Extensive network covering all major routes across North, South, East, and West India with local language support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-primary/5 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Verified Drivers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-muted-foreground">Transport Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Successful Trips</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Rajesh Kumar</CardTitle>
                <CardDescription>CEO & Founder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  20+ years in transportation industry with expertise in logistics and technology innovation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Priya Sharma</CardTitle>
                <CardDescription>CTO</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Technology leader with 15+ years in building scalable platforms and mobile applications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Amit Patel</CardTitle>
                <CardDescription>COO</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Operations expert with deep understanding of driver recruitment and fleet management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
